/**
 * Pobiera przeglądarkę Remotion (Chrome Headless Shell) do `node_modules/.remotion`.
 * Uruchamiane w Dockerfile — obraz jest gotowy do renderu bez pobierania w runtime
 * (rootfs kontenera jest `read_only`, więc pobieranie w locie by się nie udało).
 */
import {ensureBrowser} from "@remotion/renderer";

const {path: executablePath, type} = await ensureBrowser({
  onBrowserDownload: () => ({
    version: null,
    onProgress: ({percent, downloadedBytes, totalSizeInBytes}) => {
      const downloaded = (downloadedBytes / 1e6).toFixed(1);
      const total = (totalSizeInBytes / 1e6).toFixed(1);
      console.log(`Pobieram Chrome Headless Shell: ${percent.toFixed(0)}% (${downloaded}/${total} MB)`);
    }
  })
});

console.log(`Przeglądarka gotowa (${type}): ${executablePath}`);
