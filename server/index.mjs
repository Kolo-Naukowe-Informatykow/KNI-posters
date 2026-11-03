/**
 * Serwer webowy KNI posters: formularz -> render materialow (Remotion).
 *
 * Endpointy:
 *   GET    /                     UI (formularz + lista zadan)
 *   GET    /api/health           stan serwera, wersja Remotion, status bundla
 *   GET    /api/compositions     kompozycje + opisy pol formularza
 *   GET    /api/seeds            aktualny seed tla + historia
 *   POST   /api/seeds            {action: roll|back|select, seed?}
 *   GET    /api/jobs             historia zadan
 *   POST   /api/jobs             nowe zadanie {compositionId, kind, props, frame, scale}
 *   GET    /api/jobs/<id>        stan zadania
 *   GET    /api/jobs/<id>/log    log zadania (text/plain)
 *   GET    /api/jobs/<id>/file   plik wynikowy
 *   DELETE /api/jobs/<id>        anuluj (w trakcie) / usun zadanie i plik
 *
 * Kontener wystawia port tylko na 127.0.0.1 hosta, na swiat idzie przez Tailscale Serve.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import {randomInt} from "node:crypto";
import {describeFields, sanitizeProps} from "./lib/fields.mjs";
import {RenderQueue} from "./lib/jobs.mjs";
import {config, ensureOutDirs, listCompositions, prewarm, remotionVersion, repoRoot, runRender} from "./lib/renderer.mjs";
import {createUiState} from "./lib/uiState.mjs";

const PORT = Number.parseInt(process.env.PORT ?? "8083", 10);
const HOST = process.env.HOST ?? "0.0.0.0";
const PUBLIC_DIR = path.join(import.meta.dirname, "public");
const MAX_BODY_BYTES = 128 * 1024;
const MAX_FRAME = 100000;

const STATIC_FILES = new Map([
  ["/", {file: path.join(PUBLIC_DIR, "index.html"), type: "text/html; charset=utf-8"}],
  ["/index.html", {file: path.join(PUBLIC_DIR, "index.html"), type: "text/html; charset=utf-8"}],
  ["/app.js", {file: path.join(PUBLIC_DIR, "app.js"), type: "text/javascript; charset=utf-8"}],
  ["/styles.css", {file: path.join(PUBLIC_DIR, "styles.css"), type: "text/css; charset=utf-8"}]
]);

const LOGO_FILES = new Set([
  "logoKNI-white.svg",
  "logoKNI.svg",
  "logoKNI-text-white.svg",
  "logoKNI-text.svg",
  "logoKNI-text-accent.svg"
]);

ensureOutDirs();

const SHAPE_TILES = 9;
const DEFAULT_SEED = 1;
const MAX_SEED = 2147483647;
const uiState = createUiState(config.outDir);

const lastShapeIndex = () => {
  const value = Number(uiState.read().lastShapeIndex);
  return Number.isInteger(value) && value >= 0 && value < SHAPE_TILES ? value : null;
};
/** Następny kafelek układu: po zapamiętanym indeksie, a bez historii od 0. */
const nextShapeIndex = () => {
  const last = lastShapeIndex();
  return last === null ? 0 : (last + 1) % SHAPE_TILES;
};

const currentSeed = () => {
  const value = Number(uiState.read().currentSeed);
  return Number.isInteger(value) && value >= 0 && value <= MAX_SEED ? value : DEFAULT_SEED;
};

const seedState = () => ({currentSeed: currentSeed(), seeds: uiState.seeds()});

/** Nowe ziarno tła — zawsze inne od aktualnego i od tych z historii. */
const randomSeed = () => {
  const used = new Set(uiState.seeds());
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = randomInt(1, MAX_SEED);
    if (!used.has(candidate)) return candidate;
  }
  return randomInt(1, MAX_SEED);
};

const queue = new RenderQueue({outDir: config.outDir, runRender});
let bundleReady = false;

const sendJson = (response, statusCode, payload) => {
  const body = JSON.stringify(payload, null, 2);
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store"
  });
  response.end(body);
};

const sendText = (response, statusCode, text, contentType = "text/plain; charset=utf-8") => {
  response.writeHead(statusCode, {
    "content-type": contentType,
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store"
  });
  response.end(text);
};

const readJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Żądanie jest za duże"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Nieprawidłowy JSON w treści żądania"));
      }
    });
    request.on("error", reject);
  });

const serveStatic = (response, entry, request) => {
  if (!fs.existsSync(entry.file)) {
    sendText(response, 404, "Brak pliku statycznego");
    return;
  }
  const stat = fs.statSync(entry.file);
  response.writeHead(200, {
    "content-type": entry.type,
    "content-length": stat.size,
    "cache-control": request.url === "/" ? "no-store" : "no-cache"
  });
  fs.createReadStream(entry.file).pipe(response);
};

const serveLogo = (response, name) => {
  if (!LOGO_FILES.has(name)) {
    sendText(response, 404, "Nie znaleziono");
    return;
  }
  const file = path.join(repoRoot, "assets", name);
  if (!fs.existsSync(file)) {
    sendText(response, 404, "Nie znaleziono");
    return;
  }
  const stat = fs.statSync(file);
  response.writeHead(200, {
    "content-type": "image/svg+xml",
    "content-length": stat.size,
    "cache-control": "public, max-age=3600"
  });
  fs.createReadStream(file).pipe(response);
};

const compositionPayload = async () => {
  const compositions = await listCompositions();
  bundleReady = true;
  return compositions.map((composition) => {
    const fields = describeFields(composition.defaultProps);
    return {
      id: composition.id,
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
      durationSeconds: Number((composition.durationInFrames / composition.fps).toFixed(2)),
      format: composition.width === 1080 && composition.height === 1920 ? "story" : "post",
      fields,
      editable: fields.filter((field) => !field.advanced && field.type === "string").length,
      advanced: fields.filter((field) => field.advanced).length
    };
  });
};

const findComposition = async (compositionId) => {
  const compositions = await compositionPayload();
  return compositions.find((composition) => composition.id === compositionId) ?? null;
};

const downloadName = (job) => job.outputName ?? "material";

const handleFile = (response, job) => {
  const file = queue.resolveOutputFile(queue.raw(job.id));
  if (!file) {
    sendText(response, 404, "Plik nie istnieje (mógł zostać usunięty)");
    return;
  }
  const stat = fs.statSync(file);
  const extension = path.extname(file).replace(".", "");
  const type = extension === "mp4" ? "video/mp4" : "image/png";
  response.writeHead(200, {
    "content-type": type,
    "content-length": stat.size,
    "cache-control": "no-store",
    "content-disposition": `inline; filename="${downloadName(job)}"`
  });
  fs.createReadStream(file).pipe(response);
};

const handle = async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
  const route = url.pathname;
  const method = request.method ?? "GET";

  const staticEntry = STATIC_FILES.get(route);
  if (method === "GET" && staticEntry) {
    serveStatic(response, staticEntry, request);
    return;
  }

  if (method === "GET" && route.startsWith("/assets/")) {
    const name = decodeURIComponent(route.slice("/assets/".length));
    if (!name.includes("/") && !name.includes("\\")) {
      serveLogo(response, name);
      return;
    }
  }

  if (route === "/api/health" && method === "GET") {
    sendJson(response, 200, {
      ok: true,
      remotion: remotionVersion,
      bundleReady,
      outDir: config.outDir,
      concurrency: config.concurrency,
      queue: queue.status()
    });
    return;
  }

  if (route === "/api/compositions" && method === "GET") {
    sendJson(response, 200, {
      compositions: await compositionPayload(),
      shapeIndexSuggestion: nextShapeIndex(),
      lastShapeIndex: lastShapeIndex(),
      ...seedState()
    });
    return;
  }

  if (route === "/api/seeds" && method === "GET") {
    sendJson(response, 200, seedState());
    return;
  }

  if (route === "/api/seeds" && method === "POST") {
    const body = await readJsonBody(request);
    const action = body.action ?? "roll";

    if (action === "roll") {
      uiState.rememberSeed(randomSeed());
    } else if (action === "back") {
      const history = uiState.seeds();
      const trimmed = history.length > 1 ? history.slice(0, -1) : history;
      const previous = trimmed[trimmed.length - 1];
      uiState.write({seeds: trimmed, currentSeed: previous ?? DEFAULT_SEED});
    } else if (action === "select") {
      const seed = Number(body.seed);
      if (!Number.isInteger(seed) || seed < 0 || seed > MAX_SEED) {
        sendJson(response, 400, {error: "Nieprawidłowy seed"});
        return;
      }
      uiState.rememberSeed(seed);
    } else {
      sendJson(response, 400, {error: `Nieznana akcja: ${action}`});
      return;
    }

    sendJson(response, 200, seedState());
    return;
  }

  if (route === "/api/jobs" && method === "GET") {
    sendJson(response, 200, {jobs: queue.list().reverse()});
    return;
  }

  if (route === "/api/jobs" && method === "POST") {
    const body = await readJsonBody(request);
    const composition = await findComposition(body.compositionId);
    if (!composition) {
      sendJson(response, 400, {error: `Nieznana kompozycja: ${body.compositionId}`});
      return;
    }

    const {props, errors} = sanitizeProps(composition.fields, body.props);
    if (errors.length > 0) {
      sendJson(response, 400, {error: "Popraw pola formularza", details: errors});
      return;
    }

    const kind = body.kind ?? "preview";
    if (!["video", "still", "preview"].includes(kind)) {
      sendJson(response, 400, {error: `Nieznany typ zadania: ${kind}`});
      return;
    }

    const frameRaw = body.frame ?? 45;
    const frame = Number(frameRaw);
    if (!Number.isInteger(frame) || frame < 0 || frame > MAX_FRAME) {
      sendJson(response, 400, {error: "Klatka musi być liczbą całkowitą >= 0"});
      return;
    }
    const resolvedFrame = Math.min(frame, composition.durationInFrames - 1);

    const scaleRaw = body.scale ?? (kind === "preview" ? 0.4 : 1);
    const scale = Number(scaleRaw);
    if (!Number.isFinite(scale) || scale <= 0 || scale > 1) {
      sendJson(response, 400, {error: "Skala musi być w zakresie (0, 1]"});
      return;
    }

    const job = queue.enqueue({
      compositionId: composition.id,
      kind,
      props,
      frame: kind === "video" ? null : resolvedFrame,
      scale: kind === "video" ? null : scale
    });

    if (Number.isInteger(props.shapeIndex)) {
      uiState.write({lastShapeIndex: props.shapeIndex});
    }
    if (Number.isInteger(props.seed)) {
      uiState.rememberSeed(props.seed);
    }

    sendJson(response, 202, {
      job: queue.get(job.id),
      shapeIndexSuggestion: nextShapeIndex(),
      ...seedState()
    });
    return;
  }

  const jobMatch = route.match(/^\/api\/jobs\/([0-9a-f-]{36})(\/(log|file))?$/);
  if (jobMatch) {
    const [, id, , action] = jobMatch;
    const job = queue.get(id);
    if (!job) {
      sendJson(response, 404, {error: "Nie ma takiego zadania"});
      return;
    }

    if (!action && method === "GET") {
      sendJson(response, 200, {job});
      return;
    }

    if (action === "log" && method === "GET") {
      const lines = (queue.raw(id)?.log ?? []).join("\n");
      sendText(response, 200, lines.length > 0 ? `${lines}\n` : "Brak logu\n");
      return;
    }

    if (action === "file" && method === "GET") {
      if (job.status !== "done") {
        sendText(response, 409, "Zadanie nie jest jeszcze gotowe");
        return;
      }
      handleFile(response, job);
      return;
    }

    if (!action && method === "DELETE") {
      const removed = queue.remove(id);
      sendJson(response, removed || !queue.get(id) ? 200 : 202, {
        removed,
        job: queue.get(id)
      });
      return;
    }
  }

  if (route === "/api/health") {
    sendJson(response, 405, {error: "Metoda niedozwolona"});
    return;
  }

  sendJson(response, 404, {error: "Nie znaleziono"});
};

const server = http.createServer((request, response) => {
  handle(request, response).catch((error) => {
    console.error(`Błąd obsługi ${request.method} ${request.url}:`, error);
    if (!response.headersSent) {
      sendJson(response, 500, {error: String(error?.message ?? error)});
    } else {
      response.end();
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`KNI posters UI: http://${HOST}:${PORT} (Remotion ${remotionVersion})`);
  console.log(`Katalog wyników: ${config.outDir}`);
  let lastStep = -1;
  void prewarm((percent) => {
    const step = Math.floor(percent / 25);
    if (step !== lastStep) {
      lastStep = step;
      console.log(`Bundlowanie projektu: ${Math.round(percent)}%`);
    }
  }).then((ready) => {
    bundleReady = ready;
    console.log(ready ? "Bundle gotowy do renderu" : "Bundle nie jest gotowy - pierwszy render spróbuje ponownie");
  });
});

const shutdown = (signal) => {
  console.log(`Otrzymano ${signal} - zamykam serwer`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
