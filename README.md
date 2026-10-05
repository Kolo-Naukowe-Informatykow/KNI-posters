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

Lista dostepnych kompozycji:

```bash
npm run remotion:compositions
```

Render MP4 domyslnej kompozycji (`StoryMeeting-2026-03-31`):

```bash
npm run remotion:render
```

Render pojedynczej klatki (PNG):

```bash
npm run remotion:still
```

### Render dowolnej kompozycji

Kazda pozycja z `src/posts/registry.ts` jest kompozycja Remotion. Renderuj ja, podajac jej `id`:

```bash
npx remotion still src/index.ts <ID> out/<nazwa>.png --frame=90
npx remotion render src/index.ts <ID> out/<nazwa>.mp4
```

Przyklady gotowych skryptow:

```bash
npm run remotion:still:story-meeting-2026-10-06
npm run remotion:render:story-meeting-2026-10-06
npm run remotion:still:post-spotkanie-organizacyjne-2026-10-06
npm run remotion:render:post-spotkanie-organizacyjne-2026-10-06
```

## Struktura materialu

Kazdy material to trzy czesci:

- `src/posts/<temat>/<typ>-<temat>-<rrrr-mm-dd>.component.tsx` — komponent i jego propsy,
- `src/posts/<temat>/<typ>-<temat>-<rrrr-mm-dd>.story.ts` / `.post.ts` — definicja kompozycji (`id`, `spec`, `defaultProps`, opcjonalnie `caption`),
- wpis w `src/posts/registry.ts` (`storyRegistry` / `postRegistry`).

`src/Root.tsx` automatycznie mapuje `compositionRegistry` na `<Composition />` — nie dodawaj tam rekordow recznie.

## Opis (caption) do posta

Opis publikowany razem z postem trzymamy w polu `caption` w pliku `.post.ts`.
Dodatkowo zrzut do wklejenia umieszczamy w pliku `<...>.opis.md` obok komponentu.
Dzieki temu kod i tresc nie rozjezdzaja sie.

## Zdjecia (opcjonalne)

Nie kazdy material musi miec zdjecia — post/story tekstowy w stylistyce story jest OK
(np. `PostSpotkanieOrganizacyjne-2026-10-06`).

Materialy ze zdjeciami:

- zdjecia wrzucamy do `assets/meetings/<rrrr-mm-dd>/` i importujemy w pliku `.post.ts`,
- `slides[].imageSrc` moze byc opcjonalne — brak wartosci = czytelny placeholder, wiec material renderuje sie przed dodaniem zdjec.

## Wspolna stylistyka story i post

Materialy o spotkaniach trzymaja jeden klimat: ciemny gradient, gwiazdy
(`OrbitalStarsBackground`), logo `logoKNI-text-white.svg`, duza godzina.
Wspolne elementy pochodza z `src/posts/story-meeting/story-meeting-template.component.tsx`
(`StoryMeetingTemplateProps`, `meetingStars`).

## Glowne pliki Remotion

- `src/index.ts`
- `src/Root.tsx`
- `src/core/posts/InstagramPostDefinition.ts`
- `src/posts/registry.ts`
- `src/posts/story-meeting/story-meeting-template.component.tsx`
- `remotion.config.ts`


