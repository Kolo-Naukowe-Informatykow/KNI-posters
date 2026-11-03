# AGENTS.md - zasady pracy agentow AI w repozytorium KNI-posters

Ten dokument definiuje standard tworzenia nowych materialow na Instagram dla Kola Naukowego Informatykow.

## 1. Cel repozytorium

- Tworzymy statyczne posty na Instagram w Remotion (React + TypeScript), `1080x1350`.
- Docelowy format publikacji: post 4:5 (w siatce Instagrama przycinany do kwadratu).
- Stories, animacje i filmy to legacy — nie dodawaj nowych materialow w tym formacie.
- Folder `typst/` i pliki Typst traktuj jako legacy; nie rozwijaj ich i nie tworz nowych materialow w Typst.

## 2. Parametry techniczne (domyslne)

- Rozdzielczosc: `1080x1350`.
- FPS: `30` (dla statycznego postu bez znaczenia, zostaje w specyfikacji Remotion).
- Czas trwania: `durationInFrames: 1` — post jest jedna klatka.
- Render: `npm run remotion:still` (PNG). Nie renderujemy MP4.

## 3. Gdzie i jak dodawac nowe materialy

- Nowe posty rob na szablonie `PostSpotkanieBaseTemplate`
  (`src/posts/post-spotkanie-base/post-spotkanie-base-template.component.tsx`)
  i domyslnej kompozycji `PostSpotkanieBase`.
- Nowy material to definicja w `src/posts/<temat>/<typ>-<temat>-<rrrr-mm-dd>.post.ts` z wlasnym `id`,
  tekstami, `dateISO`, `shapeIndex` i `seed`; komponent bierz z szablonu zamiast go duplikowac.
- Date trzymaj jako `dateISO` (`RRRR-MM-DD`) — komponent zamienia ja na tekst
  (`2026-10-03` -> `3 pazdziernika 2026`). Nie wpisuj daty jako gotowego tekstu.
- Tlo ustawiaj przez `seed` (liczba) — ten sam seed zawsze daje ten sam uklad sloneczny.
- Rejestruj nowa definicje w `src/posts/registry.ts` (`postRegistry`).
- `src/Root.tsx` mapuje `compositionRegistry` na `<Composition ... />`; nie dodawaj recznie osobnych `<Composition>` poza ta architektura.
- Nie usuwaj istniejacych kompozycji bez wyraznego polecenia.
- Dane tekstowe i warianty przekazuj przez `defaultProps` i silnie typowane propsy.
- Kazdy post ma `shapeIndex` (0-8) — numer kafelka ukladu 3x3 z `src/core/mosaic/mosaic.ts`.
  9 postow tworzy jeden obraz, wiec w jednej serii nie zmieniaj `seed` ani geometrii ukladu.
- `id` kompozycji musi byc unikalny i zgodny z nazwa pliku (np. `PostSpotkanieBase`).

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
- Posty o spotkaniach sa celowo bez zdjec, w stylistyce statycznego postu.


## 3a. Nazewnictwo plikow i postow

- Kazdy nowy plik materialu zawiera date publikacji w formacie `rrrr-mm-dd`.
  Wyjatkiem jest wspolny szablon (`post-spotkanie-base-template.component.tsx`).
- Dla postow uzywaj prefiksu `post-`, np. `post-copernicana-2026-04-10.component.tsx`, `post-meeting-2026-04-17.post.ts`.
- Trzymaj schemat: `<typ>-<temat>-<rrrr-mm-dd>.<rola>.ts(x)`, gdzie rola to np. `component`, `post`, `data`, `opis`.
- Dla postow preferuj role `component` + `post` (+ `opis` dla opisu); komponent bierz z `PostSpotkanieBaseTemplate`.
- Stories (`story-*`, `*.story.ts`) sa legacy — nie dodawaj nowych; zostaje tylko szablon `src/posts/story-base/`.
- Identyfikator kompozycji Remotion powinien odzwierciedlac nazwe i date, np. `PostCopernicana-2026-04-10`;
  domyslny szablon to `PostSpotkanieBase`.

## 4. Konwencje wizualne KNI

- Kierunek: minimalistyczny, czytelny na telefonie, duza hierarchia informacji.
- Kolory bazowe:
  - tlo: ciemne (`#0f0f0f` lub bardzo ciemny granat),
  - tekst: jasny (`#ffffff` / zblizony),
  - akcent: `#6c63ff` stosowany oszczednie.
- Dopuszczalny jest subtelny gradient, ale unikaj "efektow wow" kosztem czytelnosci.
- Duze marginesy wewnetrzne i mocny kontrast sa obowiazkowe.
- Tlo postow generuje `src/components/backgrounds/SolarSystemBackground.tsx`, a sam uklad
  `src/core/mosaic/solarSystem.ts`: jeden globalny obraz (gradient + gwiazdy + slonce, orbity,
  planety, pas planetoid) rozpisany na siatke 3x3. Post przesuwa tylko `viewBox`, wiec tlo jest
  ciagle — bez szwow i przyciemnionych brzegow na styku kafelkow.
- Orbity sa cienkie i przygaszone, slonce nie ma jasnego rdzenia (na srodku kafelka lezy tekst),
  zeby uklad nie psul czytelnosci.
- Unikaj emotek i zbyt formalnego tonu.

## 5. Konwencje tresci

- Najpierw najwazniejsza informacja (kiedy/co), potem miejsce i szczegoly.
- Krotkie frazy, malo tekstu, wysoka czytelnosc na malym ekranie.
- Jezyk: polski, styl bezposredni.

## 6. Animacje i ruch (legacy)

- Nowych materialow nie animujemy — post to jedna klatka PNG.
- Jedyny pozostawiony material story to szablon bazowy `src/posts/story-base/story-base.component.tsx`
  (niezarejestrowany w `postRegistry`); trzymamy go jako punkt wyjscia, gdyby kiedys bylo potrzebne story.

## 7. Assety i branding

- Korzystaj z logo z `assets/`:
  - `logoKNI-text-accent.svg`
  - `logoKNI-text-white.svg`
  - `logoKNI-white.svg`
- Zachowuj proporcje logo; nie rozciagaj i nie deformuj.
- Zdjecia ze spotkan na chwile obecna trzymaj w `assets/meetings/<rrrr-mm-dd>/`.
- Czcionki trzymaj w `public/fonts/` i ustawiaj przez `KNI_FONT_FAMILY`
  z `src/core/fonts/kniFonts.ts` (Selawik, metrycznie zgodny z Segoe UI).
  Nazw czcionek systemowych (`Segoe UI`, `Trebuchet MS`) nie wpisuj w komponentach —
  kontener na serwerze ich nie ma i render wychodzi inny niz lokalnie.

## 8. Definicja "done"

Zadanie uznaj za zakonczone, gdy:

1. Definicja kompozycji jest dodana do `src/posts/registry.ts`, a przez `src/Root.tsx` pojawia sie w Remotion Studio.
2. Kod kompiluje sie bez bledow TypeScript (`npx tsc --noEmit`).
3. Material jest czytelny na ekranie telefonu (hierarchia + kontrast).
4. Render dziala dla nowej kompozycji: `npm run remotion:still` albo `npx remotion still src/index.ts <ID> out/<nazwa>.png --frame=0`.

## 8a. Szybkie polecenia

```bash
npm run remotion:studio            # podglad w Remotion Studio
npm run remotion:compositions      # lista kompozycji
npm run remotion:still             # PNG domyslnego szablonu postu
npx remotion still src/index.ts <ID> out/<nazwa>.png --frame=0
npm run serve                      # generator w przegladarce
```


## 9. Czego nie robic

- Nie wracaj do workflow Typst przy nowych materialach.
- Nie dodawaj animacji, MP4 ani nowych stories — repo robi statyczne posty.
- Nie zmieniaj globalnie stylu calego repo bez potrzeby.
- Nie usuwaj istniejacych plikow legacy bez wyraznej prozby.
- Nie wpisuj nazw czcionek systemowych w komponentach — uzywaj `KNI_FONT_FAMILY`.


