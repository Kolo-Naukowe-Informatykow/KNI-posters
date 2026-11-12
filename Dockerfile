# Obraz produkcyjny: Remotion renderuje przez Chrome Headless Shell, a serwer UI
# wystawia formularz na porcie 8083 — wystaw go za reverse proxy albo w zaufanej sieci.
# Node 22 (bookworm) + pakiety Chromium z apt.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# devDependencies nie sa potrzebne w runtime (webpack/esbuild przychodzi z @remotion/bundler)
RUN npm ci --omit=dev

FROM node:22-bookworm-slim AS runtime

# Zaleznosci Chrome Headless Shell + fontconfig i czcionki systemowe jako fallback
# dla glifow spoza czcionek dolaczonych do repo (public/fonts).
RUN apt-get update && apt-get install -y --no-install-recommends \
      libnss3 \
      libdbus-1-3 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libatspi2.0-0 \
      libgbm1 \
      libasound2 \
      libxrandr2 \
      libxkbcommon0 \
      libxfixes3 \
      libxcomposite1 \
      libxdamage1 \
      libcups2 \
      libcairo2 \
      libpango-1.0-0 \
      libpangocairo-1.0-0 \
      fontconfig \
      fonts-dejavu-core \
      fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY tsconfig.json remotion.config.ts ./
COPY src ./src
COPY assets ./assets
COPY public ./public
COPY server ./server
COPY scripts ./scripts

# Przegladarka Remotion laduje w /app/node_modules/.remotion - pobieramy ja w buildzie,
# bo w runtime rootfs jest read_only (nie ma gdzie zapisac pobrania).
RUN npm run browser:ensure

ENV NODE_ENV=production \
    PORT=8083 \
    HOST=0.0.0.0 \
    OUT_DIR=/app/out \
    HOME=/tmp

RUN mkdir -p /app/out && chown -R node:node /app
USER node

EXPOSE 8083

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8083)+'/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/index.mjs"]
