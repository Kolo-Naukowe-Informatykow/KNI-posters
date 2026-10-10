/**
 * Warstwa dostępu do Remotion: bundle, lista kompozycji, render.
 *
 * Używamy API programowego (`@remotion/bundler` + `@remotion/renderer`) zamiast CLI,
 * dzięki temu mamy postęp renderu (onProgress) i statusy bez parsowania stdout.
 * Opcje są te same co w `remotion.config.ts`: nadpisywanie plików i klatki PNG.
 */
import fs from "node:fs";
import path from "node:path";
import {bundle} from "@remotion/bundler";
import {getCompositions, makeCancelSignal, renderMedia, renderStill, selectComposition} from "@remotion/renderer";

export const repoRoot = path.resolve(import.meta.dirname, "..", "..");

const entryPoint = path.join(repoRoot, "src", "index.ts");

const parseConcurrency = (raw) => {
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const config = {
  outDir: process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : path.join(repoRoot, "out"),
  concurrency: parseConcurrency(process.env.REMOTION_CONCURRENCY),
  imageFormat: "png",
  codec: "h264",
  crf: 18
};

const readRemotionVersion = () => {
  try {
    const manifest = fs.readFileSync(path.join(repoRoot, "node_modules", "remotion", "package.json"), "utf8");
    return JSON.parse(manifest).version;
  } catch {
    return "nieznana";
  }
};

export const remotionVersion = readRemotionVersion();

const bundleDir = path.join(config.outDir, ".bundle");

export const ensureOutDirs = () => {
  fs.mkdirSync(config.outDir, {recursive: true});
};

let bundlePromise = null;
let compositionsCache = null;

const bundleOnce = (onProgress) => {
  if (!bundlePromise) {
    bundlePromise = bundle({
      entryPoint,
      outDir: bundleDir,
      // Cache webpacka pisze do node_modules/.cache, a w kontenerze rootfs jest read_only.
      // Bundle trzymamy w pamięci procesu, więc dyskowy cache nic nie daje.
      enableCaching: false,
      onProgress: (progress) => onProgress?.(progress)
    }).catch((error) => {
      bundlePromise = null;
      throw error;
    });
  }
  return bundlePromise;
};

/**
 * Lista kompozycji wraz z `defaultProps` (stąd UI bierze wartości początkowe pól).
 * Pierwsze wywołanie bundluje projekt — dlatego serwer robi to na starcie (prewarm).
 */
export const listCompositions = async (onProgress) => {
  if (!compositionsCache) {
    const serveUrl = await bundleOnce(onProgress);
    compositionsCache = await getCompositions(serveUrl, {logLevel: "warn"});
  }
  return compositionsCache;
};

export const prewarm = async (onProgress) => {
  try {
    await listCompositions(onProgress);
    return true;
  } catch (error) {
    console.error(`Prewarm nie udał się: ${error.message}`);
    return false;
  }
};

/**
 * Renderuje jedną kompozycję.
 *
 * @param {object} options
 * @param {string} options.compositionId
 * @param {"video"|"still"|"preview"} options.kind
 * @param {Record<string, unknown>} options.props propsy nadpisujące `defaultProps`
 * @param {number} options.frame klatka dla PNG
 * @param {number} options.scale skala dla PNG (podgląd = 0.4)
 * @param {string} options.outputPath ścieżka wynikowa (`.mp4` / `.png`)
 * @param {{onProgress?: Function, onCancelReady?: Function}} hooks
 */
export const runRender = async ({compositionId, kind, props, frame, scale, outputPath}, hooks = {}) => {
  let lastBundleStep = -1;
  const serveUrl = await bundleOnce((percent) => {
    const step = Math.floor(percent / 10);
    if (step !== lastBundleStep) {
      lastBundleStep = step;
      hooks.onLog?.(`Budowanie bundla: ${Math.round(percent)}%`);
    }
  });
  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps: props,
    logLevel: "info"
  });

  const {cancelSignal, cancel} = makeCancelSignal();
  hooks.onCancelReady?.(cancel);

  if (kind === "video") {
    await renderMedia({
      composition,
      serveUrl,
      outputLocation: outputPath,
      codec: config.codec,
      crf: config.crf,
      imageFormat: config.imageFormat,
      inputProps: props,
      overwrite: true,
      concurrency: config.concurrency ?? null,
      logLevel: "info",
      cancelSignal,
      onProgress: ({progress, renderedFrames, stitchStage}) =>
        hooks.onProgress?.({
          progress,
          renderedFrames,
          totalFrames: composition.durationInFrames,
          stitchStage
        })
    });
    return {width: composition.width, height: composition.height, durationInFrames: composition.durationInFrames};
  }

  await renderStill({
    composition,
    serveUrl,
    output: outputPath,
    frame: Math.min(frame, composition.durationInFrames - 1),
    imageFormat: config.imageFormat,
    scale,
    inputProps: props,
    overwrite: true,
    logLevel: "info",
    cancelSignal
  });
  hooks.onProgress?.({progress: 1, renderedFrames: 1, totalFrames: 1, stitchStage: "done"});
  return {width: composition.width, height: composition.height, durationInFrames: composition.durationInFrames};
};
