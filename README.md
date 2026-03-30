# KNI posters

Repo jest przygotowane do pracy z Remotion (aktualny workflow) oraz zawiera legacy materialy Typst.

## Wymagania

- Node.js LTS (npm)

## Instalacja

```bash
npm install
```

## Remotion

Uruchomienie podgladu (Studio):

```bash
npm run remotion:studio
```

Render MP4 domyslnej kompozycji (`StoryMeeting-2026-03-31`):

```bash
npm run remotion:render
```

Render pojedynczej klatki (PNG):

```bash
npm run remotion:still
```

Glowne pliki Remotion:

- `src/index.ts`
- `src/Root.tsx`
- `src/posts/registry.ts`
- `src/posts/story-meeting/story-meeting-2026-03-31.component.tsx`
- `src/posts/story-meeting/story-meeting-2026-03-31.story.ts`
- `remotion.config.ts`

