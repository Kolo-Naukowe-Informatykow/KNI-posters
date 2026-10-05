# AGENTS.md - zasady pracy agentow AI w repozytorium KNI-posters

Ten dokument definiuje standard tworzenia nowych materialow na Instagram dla Kola Naukowego Informatykow.

## 1. Cel repozytorium

- Tworzymy materialy pionowe 9:16 w Remotion (React + TypeScript).
- Docelowy format publikacji: Instagram Story/Reels.
- Folder `typst/` i pliki Typst traktuj jako legacy; nie rozwijaj ich i nie tworz nowych materialow w Typst.

## 2. Parametry techniczne (domyslne)

- Rozdzielczosc: `1080x1920`.
- FPS: `30`.
- Czas trwania: `180-360` klatek (6-12 s), chyba ze brief wymaga inaczej.
- Render testowy klatki: `npm run remotion:still`.
- Render finalny: `npm run remotion:render`.

## 3. Gdzie i jak dodawac nowe materialy

- Kazdy nowy format to zestaw plikow w `src/posts/<temat>/`:
  - `<typ>-<temat>-<rrrr-mm-dd>.component.tsx`
  - `<typ>-<temat>-<rrrr-mm-dd>.story.ts` lub `.post.ts`
- Rejestruj nowa definicje w `src/posts/registry.ts` (osobne tablice `storyRegistry` i `postRegistry`).
- `src/Root.tsx` mapuje `compositionRegistry` na `<Composition ... />`; nie dodawaj recznie osobnych `<Composition>` poza ta architektura.
- Nie usuwaj istniejacych kompozycji bez wyraznego polecenia.
- Dane tekstowe i warianty przekazuj przez `defaultProps` i silnie typowane propsy.
- `id` kompozycji musi byc unikalny i zgodny z nazwa pliku (np. `StoryMeeting-2026-10-06`).

### 3b. Opis (caption) materialu

- Opis publikowany razem z postem trzymaj w polu `caption` definicji (`src/core/posts/InstagramPostDefinition.ts` udostepnia opcjonalne `caption`).
- Obok komponentu dodaj plik `<typ>-<temat>-<rrrr-mm-dd>.opis.md` z tym samym tekstem gotowym do wklejenia.
- Opis ma zachęcac do przyjscia: podaj kiedy, gdzie, co sie dzieje i czy trzeba sie zapisywac.
- Bez emotek; dopuszczalne krotkie hashtagi na koncu.

### 3c. Zdjecia (opcjonalne)

- Nie kazdy material musi miec zdjecia — prosty post/story tekstowy jest OK.
- Jesli material korzysta ze zdjec, trzymaj je w `assets/meetings/<rrrr-mm-dd>/`.
- W komponentach ze zdjeciami pole `slides[].imageSrc` moze byc opcjonalne: brak wartosci renderuje placeholder, wiec material kompiluje sie i renderuje przed dodaniem zdjec.
- Po dodaniu zdjec zaimportuj je w pliku `.post.ts` i przypisz do `slides[].imageSrc`; nie zostawiaj placeholderow w finalnym materiale bez powodu.
- W folderze ze zdjeciami dodaj krotki `README.md` z wytycznymi (orientacja, minimalny rozmiar, prawa do wizerunku).
- Post `PostSpotkanieOrganizacyjne-2026-10-06` jest celowo bez zdjec, w stylistyce story.


## 3a. Nazewnictwo plikow i postow

- Kazdy nowy plik postu musi zawierac date w formacie `rrrr-mm-dd`.
- Dla stories uzywaj prefiksu `story-`, np. `story-meeting-2026-03-31.component.tsx`.
- Dla postow uzywaj prefiksu `post-`, np. `post-copernicana-2026-04-10.component.tsx`, `post-meeting-2026-04-17.post.ts`.
- Trzymaj schemat: `<typ>-<temat>-<rrrr-mm-dd>.<rola>.ts(x)`, gdzie rola to np. `component`, `post`, `data`, `opis`.
- Dla stories preferuj role `component` + `story`; dla postow `component` + `post` (+ `opis` dla opisu).
- Identyfikator kompozycji Remotion powinien odzwierciedlac nazwe i date, np. `StoryMeeting-2026-03-31` albo `PostCopernicana-2026-04-10`.

## 4. Konwencje wizualne KNI

- Kierunek: minimalistyczny, czytelny na telefonie, duza hierarchia informacji.
- Kolory bazowe:
  - tlo: ciemne (`#0f0f0f` lub bardzo ciemny granat),
  - tekst: jasny (`#ffffff` / zblizony),
  - akcent: `#6c63ff` stosowany oszczednie.
- Dopuszczalny jest subtelny gradient, ale unikaj "efektow wow" kosztem czytelnosci.
- Duze marginesy wewnetrzne i mocny kontrast sa obowiazkowe.
- Unikaj emotek i zbyt formalnego tonu.

## 5. Konwencje tresci

- Najpierw najwazniejsza informacja (kiedy/co), potem miejsce i szczegoly.
- Krotkie frazy, malo tekstu, wysoka czytelnosc na malym ekranie.
- Jezyk: polski, styl bezposredni.

## 6. Animacje i ruch

- Stosuj proste, celowe animacje (wejscie, fade, lekka skala, slide).
- Preferuj API Remotion: `spring`, `interpolate`, `useCurrentFrame`, `useVideoConfig`.
- Nie przesadzaj z liczba jednoczesnych animacji.

## 7. Assety i branding

- Korzystaj z logo z `assets/`:
  - `logoKNI-text-accent.svg`
  - `logoKNI-text-white.svg`
  - `logoKNI-white.svg`
- Zachowuj proporcje logo; nie rozciagaj i nie deformuj.
- Zdjecia ze spotkan na chwile obecna trzymaj w `assets/meetings/<rrrr-mm-dd>/`.

## 8. Definicja "done"

Zadanie uznaj za zakonczone, gdy:

1. Definicja kompozycji jest dodana do `src/posts/registry.ts`, a przez `src/Root.tsx` pojawia sie w Remotion Studio.
2. Kod kompiluje sie bez bledow TypeScript (`npx tsc --noEmit`).
3. Material jest czytelny na ekranie telefonu (hierarchia + kontrast).
4. Polecenia renderu (`still` lub `render`) dzialaja dla nowej kompozycji, np. `npx remotion still src/index.ts <ID> out/<nazwa>.png --frame=90`.

## 8a. Szybkie polecenia

```bash
npm run remotion:studio            # podglad w Remotion Studio
npm run remotion:compositions      # lista kompozycji
npx remotion still src/index.ts <ID> out/<nazwa>.png --frame=90
npx remotion render src/index.ts <ID> out/<nazwa>.mp4
```


## 9. Czego nie robic

- Nie wracaj do workflow Typst przy nowych materialach.
- Nie zmieniaj globalnie stylu calego repo bez potrzeby.
- Nie usuwaj istniejacych plikow legacy bez wyraznej prozby.
