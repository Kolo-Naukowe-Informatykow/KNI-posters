/**
 * UI generatora: formularz -> zadanie renderu -> plik.
 * Bez frameworkow; stan trzymamy w pamieci, liste zadan odswiezamy pollinguem.
 */

const KIND_LABELS = {preview: "Podgląd", still: "PNG", video: "MP4"};
const STATUS_LABELS = {
  queued: "W kolejce",
  rendering: "Renderuję",
  done: "Gotowe",
  error: "Błąd",
  cancelled: "Anulowane"
};
const POLL_ACTIVE_MS = 1500;
const POLL_IDLE_MS = 8000;

const state = {
  composition: null,
  jobs: [],
  logs: new Map(),
  openLogs: new Set(),
  cards: new Map(),
  timer: null
};

const element = (id) => document.getElementById(id);

const api = async (path, options) => {
  const response = await fetch(path, options);
  const type = response.headers.get("content-type") ?? "";
  const payload = type.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === "object" ? payload?.error ?? JSON.stringify(payload) : payload;
    throw new Error(message || `HTTP ${response.status}`);
  }
  return payload;
};

const setStatus = (text, className = "") => {
  const node = element("status");
  node.textContent = text;
  node.className = `status ${className}`.trim();
};

const formatTime = (iso) => (iso ? new Date(iso).toLocaleString("pl-PL") : "");

const formatSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const buildField = (field, container, advanced) => {
  const wrapper = document.createElement("div");
  wrapper.className = field.multiline ? "field wide" : "field";

  const label = document.createElement("label");
  label.textContent = field.label ?? field.name;
  label.htmlFor = `field-${field.name}`;
  wrapper.append(label);

  let input;
  if (field.type === "string" && field.multiline) {
    input = document.createElement("textarea");
    input.rows = 3;
  } else if (field.type === "boolean") {
    input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(field.value);
    input.className = "checkbox-input";
  } else {
    input = document.createElement("input");
    input.type = field.type === "number" ? "number" : "text";
    if (field.type === "number") {
      if (typeof field.min === "number") input.min = String(field.min);
      if (typeof field.max === "number") input.max = String(field.max);
      input.step = String(field.step ?? 1);
    }
  }

  input.id = `field-${field.name}`;
  input.dataset.name = field.name;

  if (field.type === "string") {
    input.value = field.value ?? "";
    if (field.hint) input.placeholder = field.hint;
  } else if (field.type === "number") {
    input.value = field.value === null || field.value === undefined ? "" : String(field.value);
    if (field.hint) input.placeholder = field.hint;
  }

  if (advanced) {
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = field.name;
    wrapper.append(name);
  }

  wrapper.append(input);

  if (field.hint && field.type !== "string") {
    const hint = document.createElement("span");
    hint.className = "hint";
    hint.textContent = field.hint;
    wrapper.append(hint);
  }

  container.append(wrapper);
};

const renderForm = () => {
  const form = element("form");
  const advanced = element("advanced");
  form.innerHTML = "";
  advanced.innerHTML = "";

  for (const field of state.composition.fields) {
    buildField(field, field.advanced ? advanced : form, Boolean(field.advanced));
  }

  const frameWrapper = document.createElement("div");
  frameWrapper.className = "field";
  const frameLabel = document.createElement("label");
  frameLabel.textContent = "Klatka podglądu/PNG";
  frameLabel.htmlFor = "frame";
  const frameInput = document.createElement("input");
  frameInput.type = "number";
  frameInput.id = "frame";
  frameInput.min = "0";
  frameInput.max = String(Math.max(state.composition.durationInFrames - 1, 0));
  frameInput.value = "45";
  const frameHint = document.createElement("span");
  frameHint.className = "hint";
  frameHint.textContent = `0-${state.composition.durationInFrames - 1}`;
  frameWrapper.append(frameLabel, frameInput, frameHint);
  advanced.append(frameWrapper);

  element("advanced-wrapper").open = false;

  const meta = element("composition-meta");
  meta.innerHTML = "";
  const pills = [
    `${state.composition.width}x${state.composition.height}`,
    `${state.composition.fps} fps`,
    `${state.composition.durationSeconds} s`,
    `${state.composition.durationInFrames} klatek`,
    state.composition.format === "story" ? "story 9:16" : "post"
  ];
  for (const text of pills) {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = text;
    meta.append(pill);
  }
};

const selectComposition = (id) => {
  const composition = state.compositionsById.get(id);
  if (!composition) return;
  state.composition = composition;
  renderForm();
};

const fillCompositions = (compositions) => {
  state.compositionsById = new Map(compositions.map((composition) => [composition.id, composition]));
  const select = element("composition");
  select.innerHTML = "";

  const groups = new Map();
  for (const composition of compositions) {
    const key = composition.format;
    if (!groups.has(key)) {
      const group = document.createElement("optgroup");
      group.label = key === "story" ? "Story 9:16" : "Posty";
      groups.set(key, group);
      select.append(group);
    }
    const option = document.createElement("option");
    option.value = composition.id;
    option.textContent = composition.id;
    groups.get(key).append(option);
  }

  selectComposition(compositions[0]?.id);
};

const collectProps = () => {
  const props = {};
  for (const field of state.composition.fields) {
    const input = document.getElementById(`field-${field.name}`);
    if (!input) continue;
    if (field.type === "string") {
      props[field.name] = input.value;
    } else if (field.type === "number") {
      if (input.value !== "") props[field.name] = Number(input.value);
    } else if (field.type === "boolean") {
      props[field.name] = input.checked;
    }
  }
  const frame = Number.parseInt(element("frame")?.value ?? "45", 10);
  return {props, frame: Number.isFinite(frame) ? frame : 45};
};

const setBusy = (busy) => {
  for (const id of ["preview", "still", "video"]) {
    element(id).disabled = busy || !state.composition;
  }
};

const submitJob = async (kind) => {
  if (!state.composition) return;
  const {props, frame} = collectProps();
  setBusy(true);
  try {
    await api("/api/jobs", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({compositionId: state.composition.id, kind, props, frame})
    });
    await refresh();
  } catch (error) {
    setStatus(`Nie udało się zlecić renderu: ${error.message}`, "error");
  } finally {
    setBusy(false);
  }
};

const jobActions = (job) => {
  const actions = document.createElement("div");
  actions.className = "job-actions";

  if (job.status === "done") {
    const link = document.createElement("a");
    link.href = `/api/jobs/${job.id}/file`;
    link.download = job.outputName ?? "material";
    link.textContent = `Pobierz ${KIND_LABELS[job.kind] ?? ""}`.trim();
    actions.append(link);
  }

  const logButton = document.createElement("button");
  logButton.type = "button";
  const logNode = document.createElement("pre");
  logNode.className = "log";
  logNode.textContent = state.logs.get(job.id) ?? "";
  logNode.hidden = !state.openLogs.has(job.id);
  logButton.textContent = logNode.hidden ? "Log" : "Ukryj log";

  logButton.addEventListener("click", async () => {
    if (!logNode.hidden) {
      logNode.hidden = true;
      state.openLogs.delete(job.id);
      logButton.textContent = "Log";
      return;
    }
    if (!state.logs.has(job.id)) {
      try {
        state.logs.set(job.id, await api(`/api/jobs/${job.id}/log`));
      } catch (error) {
        state.logs.set(job.id, `Nie udało się pobrać logu: ${error.message}`);
      }
      logNode.textContent = state.logs.get(job.id) ?? "";
    }
    logNode.hidden = false;
    state.openLogs.add(job.id);
    logButton.textContent = "Ukryj log";
  });

  actions.append(logButton);

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = job.status === "queued" || job.status === "rendering" ? "danger" : "";
  cancelButton.textContent = job.status === "queued" || job.status === "rendering" ? "Anuluj" : "Usuń";
  cancelButton.addEventListener("click", async () => {
    try {
      await api(`/api/jobs/${job.id}`, {method: "DELETE"});
      state.logs.delete(job.id);
      await refresh();
    } catch (error) {
      setStatus(`Nie udało się usunąć zadania: ${error.message}`, "error");
    }
  });
  actions.append(cancelButton);

  return {actions, logNode};
};

const renderJob = (job) => {
  const card = document.createElement("article");
  card.className = "job";

  const header = document.createElement("div");
  header.className = "job-header";

  const title = document.createElement("span");
  title.className = "job-title";
  title.textContent = job.compositionId;

  const kindBadge = document.createElement("span");
  kindBadge.className = "badge";
  kindBadge.textContent = KIND_LABELS[job.kind] ?? job.kind;

  const statusBadge = document.createElement("span");
  statusBadge.className = `badge ${job.status}`;
  statusBadge.textContent = STATUS_LABELS[job.status] ?? job.status;

  const time = document.createElement("span");
  time.className = "job-time";
  time.textContent = formatTime(job.createdAt);

  header.append(title, kindBadge, statusBadge, time);
  card.append(header);

  if (job.status === "queued" || job.status === "rendering") {
    const progress = document.createElement("div");
    progress.className = `progress${job.status === "queued" ? " indeterminate" : ""}`;
    const bar = document.createElement("span");
    const percent = Math.round((job.progress ?? 0) * 100);
    bar.style.width = `${job.status === "queued" ? 30 : Math.max(percent, 2)}%`;
    progress.append(bar);
    card.append(progress);

    const note = document.createElement("span");
    note.className = "muted small";
    note.textContent =
      job.status === "queued"
        ? "Czeka w kolejce…"
        : job.totalFrames
          ? `${percent}% (${job.renderedFrames}/${job.totalFrames} klatek)${job.stitchStage === "encoding" ? " — kodowanie" : ""}`
          : `${percent}%`;
    card.append(note);
  }

  if (job.status === "done") {
    const media =
      job.kind === "video"
        ? Object.assign(document.createElement("video"), {
            className: "preview-media",
            controls: true,
            preload: "metadata",
            src: `/api/jobs/${job.id}/file`
          })
        : Object.assign(document.createElement("img"), {
            className: "preview-media",
            src: `/api/jobs/${job.id}/file`,
            alt: job.outputName ?? "render"
          });
    card.append(media);

    const details = document.createElement("span");
    details.className = "muted small";
    details.textContent = [job.outputName, formatSize(job.outputSize)].filter(Boolean).join(" · ");
    card.append(details);
  }

  if (job.error && job.status !== "done") {
    const error = document.createElement("p");
    error.className = "error-text";
    error.textContent = job.error;
    card.append(error);
  }

  const {actions, logNode} = jobActions(job);
  card.append(actions, logNode);

  return card;
};

/** Klucz opisuje to, co widać w karcie — pozwala zachować odtwarzacz wideo między odświeżeniami. */
const cardKey = (job) => {
  const buckets = job.status === "queued" || job.status === "rendering" ? Math.round((job.progress ?? 0) * 50) : "";
  return [job.status, job.outputName ?? "", buckets, job.error ?? "", state.openLogs.has(job.id) ? "log" : ""].join("|");
};

const renderJobs = () => {
  const container = element("jobs");
  container.innerHTML = "";

  if (state.jobs.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Brak zadań.";
    container.append(empty);
    state.cards.clear();
    return;
  }

  const alive = new Set();
  for (const job of state.jobs) {
    alive.add(job.id);
    const key = cardKey(job);
    const cached = state.cards.get(job.id);
    if (cached && cached.key === key) {
      container.append(cached.node);
      continue;
    }
    const node = renderJob(job);
    state.cards.set(job.id, {key, node});
    container.append(node);
  }

  for (const id of [...state.cards.keys()]) {
    if (!alive.has(id)) state.cards.delete(id);
  }
};

const scheduleNextPoll = () => {
  const active = state.jobs.some((job) => job.status === "queued" || job.status === "rendering");
  clearTimeout(state.timer);
  state.timer = setTimeout(() => void refresh(), active ? POLL_ACTIVE_MS : POLL_IDLE_MS);
};

const refresh = async () => {
  try {
    const [health, jobs] = await Promise.all([api("/api/health"), api("/api/jobs")]);
    state.jobs = jobs.jobs;
    renderJobs();
    const queue = health.queue;
    const busy = queue.queued + queue.rendering;
    setStatus(
      `Remotion ${health.remotion} · ${health.bundleReady ? "bundle gotowy" : "bundle w przygotowaniu"} · kolejka: ${busy}`,
      busy > 0 ? "busy" : "ok"
    );
  } catch (error) {
    setStatus(`Brak połączenia z serwerem: ${error.message}`, "error");
  } finally {
    scheduleNextPoll();
  }
};

const init = async () => {
  element("composition").addEventListener("change", (event) => selectComposition(event.target.value));
  element("preview").addEventListener("click", () => void submitJob("preview"));
  element("still").addEventListener("click", () => void submitJob("still"));
  element("video").addEventListener("click", () => void submitJob("video"));

  setBusy(true);
  setStatus("Wczytuję kompozycje (pierwsze uruchomienie bundluje projekt)…", "busy");
  try {
    const payload = await api("/api/compositions");
    fillCompositions(payload.compositions);
    setStatus(`Wczytano ${payload.compositions.length} kompozycji`, "ok");
  } catch (error) {
    setStatus(`Nie udało się wczytać kompozycji: ${error.message}`, "error");
  } finally {
    setBusy(false);
  }

  await refresh();
};

void init();
