/**
 * Kolejka zadań renderu: jedno zadanie naraz (CPU 4 rdzenie) + trwała historia.
 *
 * Stan zadań ląduje w `<OUT_DIR>/jobs.json` (wolumen na hoście), więc historia i pliki
 * przeżywają restart kontenera. Logi trzymamy w pamięci i jednocześnie puszczamy do
 * stdout kontenera (`docker logs kni-posters`), żeby nie rosły bez końca na dysku.
 */
import fs from "node:fs";
import path from "node:path";
import {randomUUID} from "node:crypto";

const MAX_LOG_LINES = 250;
const MAX_ERROR_LENGTH = 1500;
const KINDS = new Set(["video", "still", "preview"]);

const stripAnsi = (text) => text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const stamp = (date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${String(
    date.getHours()
  ).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;

/** Przechwytuje wyjście Remotion (postęp, ostrzeżenia) do logu zadania. */
const captureOutput = (onLine) => {
  const streams = [
    {stream: process.stdout, original: process.stdout.write},
    {stream: process.stderr, original: process.stderr.write}
  ];
  let buffer = "";

  const flush = (chunk) => {
    buffer += stripAnsi(chunk);
    const parts = buffer.split(/\r?\n|\r/);
    buffer = parts.pop() ?? "";
    for (const line of parts) {
      const trimmed = line.trimEnd();
      if (trimmed.length > 0) onLine(trimmed);
    }
  };

  for (const {stream, original} of streams) {
    stream.write = (chunk, encoding, callback) => {
      try {
        const text =
          typeof chunk === "string" ? chunk : Buffer.from(chunk).toString(typeof encoding === "string" ? encoding : "utf8");
        flush(text);
      } catch {
        // logowanie nie może wywalić renderu
      }
      return original.call(stream, chunk, encoding, callback);
    };
  }

  return () => {
    for (const {stream, original} of streams) {
      stream.write = original;
    }
  };
};

export class RenderQueue {
  constructor({outDir, runRender}) {
    this.outDir = outDir;
    this.runRender = runRender;
    this.jobsFile = path.join(outDir, "jobs.json");
    this.jobs = this.load();
    this.running = null;
  }

  load() {
    try {
      const raw = fs.readFileSync(this.jobsFile, "utf8");
      const jobs = JSON.parse(raw).jobs ?? [];
      return jobs.map((job) =>
        job.status === "rendering" || job.status === "queued"
          ? {...job, status: "error", error: "Przerwane restartem serwera", finishedAt: new Date().toISOString()}
          : {...job, log: []}
      );
    } catch {
      return [];
    }
  }

  persist() {
    const payload = JSON.stringify({jobs: this.jobs.map(({log, ...job}) => job)}, null, 2);
    const tempFile = `${this.jobsFile}.tmp`;
    fs.writeFileSync(tempFile, payload, "utf8");
    fs.renameSync(tempFile, this.jobsFile);
  }

  appendLog(job, line) {
    job.log.push(line);
    if (job.log.length > MAX_LOG_LINES) job.log.splice(0, job.log.length - MAX_LOG_LINES);
  }

  list() {
    return this.jobs.map((job) => this.serialize(job));
  }

  get(id) {
    const job = this.jobs.find((candidate) => candidate.id === id);
    return job ? this.serialize(job) : null;
  }

  raw(id) {
    return this.jobs.find((candidate) => candidate.id === id) ?? null;
  }

  serialize(job) {
    return {
      id: job.id,
      compositionId: job.compositionId,
      kind: job.kind,
      status: job.status,
      progress: job.progress ?? 0,
      renderedFrames: job.renderedFrames ?? 0,
      totalFrames: job.totalFrames ?? null,
      stitchStage: job.stitchStage ?? null,
      props: job.props,
      frame: job.frame ?? null,
      scale: job.scale ?? null,
      createdAt: job.createdAt,
      startedAt: job.startedAt ?? null,
      finishedAt: job.finishedAt ?? null,
      outputName: job.outputFile ? path.basename(job.outputFile) : null,
      outputSize: job.outputSize ?? null,
      error: job.error ?? null,
      log: job.log ?? [],
      logLineCount: (job.log ?? []).length
    };
  }

  /** Tworzy zadanie i (jeśli nic się nie renderuje) startuje je od razu. */
  enqueue({compositionId, kind, props, frame, scale}) {
    if (!KINDS.has(kind)) throw new Error(`Nieznany typ zadania: ${kind}`);

    const job = {
      id: randomUUID(),
      compositionId,
      kind,
      props,
      frame,
      scale,
      status: "queued",
      progress: 0,
      renderedFrames: 0,
      totalFrames: null,
      createdAt: new Date().toISOString(),
      log: []
    };

    this.jobs.push(job);
    this.persist();
    void this.pump();
    return this.serialize(job);
  }

  /** Anuluje zadanie (w kolejce od razu, w trakcie renderu przez cancelSignal). */
  cancel(id) {
    const job = this.raw(id);
    if (!job) return null;
    if (job.status === "queued") {
      job.status = "cancelled";
      job.finishedAt = new Date().toISOString();
      job.error = "Anulowane przez użytkownika";
      this.appendLog(job, "Anulowane w kolejce");
      this.persist();
      return this.serialize(job);
    }
    if (job.status === "rendering") {
      job.cancelRequested = true;
      this.appendLog(job, "Zgłoszono anulowanie...");
      job.cancel?.();
      this.persist();
      return this.serialize(job);
    }
    return this.serialize(job);
  }

  /** Usuwa zadanie i jego plik wynikowy. Render w trakcie jest najpierw anulowany. */
  remove(id) {
    const job = this.raw(id);
    if (!job) return false;
    if (job.status === "rendering") {
      job.cancelRequested = true;
      job.cancel?.();
      return false;
    }
    this.deleteOutput(job);
    this.jobs = this.jobs.filter((candidate) => candidate.id !== id);
    this.persist();
    return true;
  }

  deleteOutput(job) {
    const file = this.resolveOutputFile(job);
    if (!file) return;
    try {
      fs.rmSync(file, {force: true});
    } catch {
      // brak pliku nie jest błędem
    }
  }

  /** Ścieżka wynikowa zadania (absolutna) albo null, gdy pliku nie ma. */
  resolveOutputFile(job) {
    if (!job.outputFile) return null;
    const file = path.join(this.outDir, job.outputFile);
    return fs.existsSync(file) ? file : null;
  }

  outputDirectory(kind) {
    return kind === "preview" ? "previews" : "";
  }

  /** Nazwa pliku wynikowego, unikalna w katalogu docelowym. */
  buildOutputFile(job) {
    const directory = this.outputDirectory(job.kind);
    const baseDir = path.join(this.outDir, directory);
    fs.mkdirSync(baseDir, {recursive: true});

    const extension = job.kind === "video" ? "mp4" : "png";
    const suffix = job.kind === "preview" ? "-podglad" : "";
    const stem = `${slug(job.compositionId)}${suffix}-${stamp(new Date())}`;

    let name = `${stem}.${extension}`;
    let counter = 2;
    while (fs.existsSync(path.join(baseDir, name))) {
      name = `${stem}-${counter}.${extension}`;
      counter += 1;
    }

    return directory ? `${directory}/${name}` : name;
  }

  async pump() {
    if (this.running) return;

    const job = this.jobs.find((candidate) => candidate.status === "queued");
    if (!job) return;

    this.running = job;
    job.status = "rendering";
    job.startedAt = new Date().toISOString();
    job.totalFrames = null;
    this.persist();

    const stopCapture = captureOutput((line) => this.appendLog(job, line));
    job.outputFile = this.buildOutputFile(job);
    const outputPath = path.join(this.outDir, job.outputFile);
    this.appendLog(
      job,
      job.kind === "video"
        ? `Start video: ${job.compositionId}`
        : `Start ${job.kind === "preview" ? "podglądu" : "PNG"}: ${job.compositionId}, klatka ${job.frame ?? 45}, skala ${job.scale ?? 1}`
    );
    let lastLoggedPercent = -1;

    try {
      const result = await this.runRender(
        {
          compositionId: job.compositionId,
          kind: job.kind,
          props: job.props,
          frame: job.frame ?? 45,
          scale: job.scale ?? (job.kind === "preview" ? 0.4 : 1),
          outputPath
        },
        {
          onLog: (line) => this.appendLog(job, line),
          onCancelReady: (cancel) => {
            job.cancel = cancel;
            if (job.cancelRequested) cancel();
          },
          onProgress: ({progress, renderedFrames, totalFrames, stitchStage}) => {
            job.progress = progress ?? job.progress;
            job.renderedFrames = renderedFrames ?? job.renderedFrames;
            job.totalFrames = totalFrames ?? job.totalFrames;
            job.stitchStage = stitchStage ?? job.stitchStage;

            const percent = Math.floor((job.progress ?? 0) * 10);
            if (percent > lastLoggedPercent) {
              lastLoggedPercent = percent;
              this.appendLog(
                job,
                `Postęp: ${Math.round((job.progress ?? 0) * 100)}%${
                  job.totalFrames ? ` (${job.renderedFrames}/${job.totalFrames} klatek)` : ""
                }`
              );
            }

            this.persist();
          }
        }
      );

      job.status = "done";
      job.progress = 1;
      job.renderedFrames = job.totalFrames ?? job.renderedFrames;
      job.outputSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : null;
      job.stitchStage = "done";
      this.appendLog(job, `Gotowe: ${job.outputFile} (kompozycja ${result.width}x${result.height})`);
    } catch (error) {
      const message = String(error?.message ?? error).slice(0, MAX_ERROR_LENGTH);
      if (job.cancelRequested) {
        job.status = "cancelled";
        job.error = "Anulowane przez użytkownika";
        this.appendLog(job, "Anulowane");
      } else {
        job.status = "error";
        job.error = message;
        this.appendLog(job, `Błąd: ${message}`);
      }
      try {
        fs.rmSync(outputPath, {force: true});
      } catch {
        // ignorujemy - plik mógł nie powstać
      }
    } finally {
      stopCapture();
      job.cancel = undefined;
      job.finishedAt = new Date().toISOString();
      this.running = null;
      this.persist();
      void this.pump();
    }
  }

  status() {
    return {
      queued: this.jobs.filter((job) => job.status === "queued").length,
      rendering: this.jobs.filter((job) => job.status === "rendering").length
    };
  }
}
