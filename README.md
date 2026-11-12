# KNI posters

Repo generuje statyczne posty na Instagram (1080x1350) w Remotion (React + TypeScript).
Nie robimy tu juz filmow ani animacji — materialy to pojedyncze klatki PNG.
Folder `typst/` to legacy i nie rozwijamy go.

![Cztery szablony postow](docs/screenshots/posty.png)

Szablony spotkan sekcji: spotkanie ogolne, sekcja robotyki, gamedev i Redflag.

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

Render domyslnego szablonu postu (`PostSpotkanieBase`) do PNG:

```bash
npm run remotion:still
```

### Render dowolnej kompozycji

Kazda pozycja z `src/posts/registry.ts` jest kompozycja Remotion. Renderuj ja, podajac jej `id`:

```bash
npx remotion still src/index.ts <ID> out/<nazwa>.png --frame=0
```

Przyklad gotowego skryptu:

```bash
npm run remotion:still
```

Kompozycje postow maja `durationInFrames: 1`, wiec kazda klatka wyglada tak samo — `--frame` nie ma znaczenia.

## Struktura materialu

Kazdy material to trzy czesci:

- komponent postu (wspolny `PostSpotkanieBaseTemplate`) i jego propsy,
- `src/posts/<temat>/<typ>-<temat>-<rrrr-mm-dd>.post.ts` — definicja kompozycji (`id`, `spec`, `defaultProps`, opcjonalnie `caption`),
- wpis w `src/posts/registry.ts` (`postRegistry`).

`src/Root.tsx` automatycznie mapuje `compositionRegistry` na `<Composition />` — nie dodawaj tam rekordow recznie.

Nowe posty rob na szablonie `PostSpotkanieBase`
(`src/posts/post-spotkanie-base/post-spotkanie-base-template.component.tsx`):
wystarczy nowa definicja z innym `id`, tekstami, `dateISO`, `shapeIndex` i `seed`. Daty nie wpisujemy
recznie — pole `dateISO` (`RRRR-MM-DD`) jest formatowane na tekst, np. `2026-10-03` -> `3 października 2026`.
`shapeIndex` (0-8) wybiera kafelek układu, a `seed` — które tło (ten sam seed = ten sam układ słoneczny).

## Opis (caption) do posta

Opis publikowany razem z postem trzymamy w polu `caption` w pliku `.post.ts`.
Dodatkowo zrzut do wklejenia umieszczamy w pliku `<...>.opis.md` obok komponentu.
Dzieki temu kod i tresc nie rozjezdzaja sie.

## Zdjecia (opcjonalne)

Nie kazdy material musi miec zdjecia — prosty post tekstowy jest OK
(np. `PostSpotkanieBase`).

Materialy ze zdjeciami:

- zdjecia wrzucamy do `assets/meetings/<rrrr-mm-dd>/` i importujemy w pliku `.post.ts`,
- `slides[].imageSrc` moze byc opcjonalne — brak wartosci = czytelny placeholder, wiec material renderuje sie przed dodaniem zdjec.

## Wspolna stylistyka postow

Kazdy post o spotkaniu ma ten sam uklad tekstu (logo, duza godzina, naglowek, data,
temat, miejsce, stopka) i to samo, ciagle tlo rozpisane na mozaike 3x3:

- `src/components/backgrounds/SolarSystemBackground.tsx` rysuje **jeden globalny obraz**:
  ciemny gradient, gwiazdy i proceduralny układ słoneczny (słońce + orbity + planety + pas
  planetoid). Post przesuwa tylko `viewBox`, więc na styku kafelków nie ma szwu ani przyciemnionych
  brzegów — wszystko liczone jest w jednych współrzędnych mozaiki.
- `src/core/mosaic/solarSystem.ts` buduje układ z `seed` (deterministyczny generator), a
  `src/core/mosaic/mosaic.ts` mapuje `shapeIndex` 0-8 na kolumnę i wiersz siatki.
- Geometria mozaiki odpowiada temu, co naprawdę widać na profilu: Instagram pokazuje posty 4:5
  w siatce 3:4 (przycina boki) i zostawia odstęp między kafelkami. Stałe `MOSAIC_GRID_ASPECT`,
  `MOSAIC_CROP_X`, `MOSAIC_GAP` oraz `MOSAIC_PITCH_X/Y` w `mosaic.ts` uwzględniają oba efekty,
  więc sąsiednie posty schodzą się w siatce co do piksela.
- Orbity są cienkie i przygaszone, a słońce nie ma jasnego rdzenia (na środku kafelka leży tekst),
  żeby wzór nie psuł czytelności.

### Ikona, kolorystyka i nagłówek sekcji

- `icon` — jednokolorowa ikona w lewym górnym rogu. Domyślny jest własny zestaw KNI
  (`src/core/icons/kni-icons.json`): `kni-robot` (robotyka), `kni-gamepad` (gamedev),
  `kni-chat` (spotkania ogólne), `kni-shield` (Redflag), `kni-shapes` (matematyka).
  Znaki sekcji w wersji wypełnianej siedzą w paczce `brand` (`src/core/icons/kni-brand-icons.json`) —
  `kni-gamedev` to słoik z dżemu z przyciskiem play (logo `assets/logoGamedev*.svg`).
  Do wyboru jest też cała paczka Phosphor w wariancie bold (`src/core/icons/phosphor-icons.json`,
  `npm run icons:build`). Rysuje je `src/components/icons/TopicIcon.tsx`.
- `theme` — paleta z `src/core/posts/post-themes.json` (czytana przez `postThemes.ts`):
  `default` (tematy), `general` (spotkania ogólne), `robotics` (bursztyn), `cyber` (Redflag, czerwień),
  `gamedev` (zieleń). Paleta zmienia też tło mozaiki. Ustawiasz ją w definicji kompozycji —
  w formularzu nie ma osobnego wyboru, bo kolor wynika z wybranego szablonu spotkania.
- `sectionLabel` — nagłówek sekcji pod logo (`Sekcja robotyki`, `Redflag`); puste pole ukrywa nagłówek.

Szablony spotkań sekcji:

- `PostSekcjaOgolna` — wtorki, 18:00, sala L9 (`src/posts/post-sekcja-ogolna/`),
- `PostSekcjaRobotyka` — poniedziałki, 18:00, sala L15 (`src/posts/post-sekcja-robotyka/`),
- `PostSekcjaGamedev` — środy, 18:00, sala L9 (`src/posts/post-sekcja-gamedev/`); godzina i sala do potwierdzenia,
- `PostRedflag` — czwartki, 18:00, sala L9 (`src/posts/post-redflag/`); godzina i sala do potwierdzenia.

W generatorze kompozycję wybierasz kafelkami (podgląd ikony, nazwa sekcji, godzina i sala),
`icon` to picker z wyszukiwarką (zestaw KNI + cała paczka Phosphor), a `sectionLabel` zwykłe pole
tekstowe. `PostSpotkanieBase` jest ukryty w generatorze — zostaje jako szablon techniczny.

## Czcionki

Czcionki sa czescia repo (`public/fonts/`) i wczytuje je `src/core/fonts/kniFonts.ts`.
Dzieki temu render wyglada identycznie lokalnie i w kontenerze — minimalny obraz
Linux nie ma czcionek Segoe UI ani Trebuchet MS.

- `public/fonts/selawik-*.woff2` — Selawik (SIL OFL 1.1, licencja w `public/fonts/LICENSE.txt`),
  metrycznie zgodny z Segoe UI, wiec uklad i zawijanie tekstu nie zmieniaja sie.
- Komponenty ustawiaja `fontFamily: KNI_FONT_FAMILY`; nazw czcionek systemowych nie wpisujemy.
- `delayRender` w `kniFonts.ts` wstrzymuje render, az pliki sie wczytaja (brak cichego
  zejscia na czcionke zapasowa).
- Nowy katalog `public/` jest kopiowany do obrazu w `Dockerfile` (`COPY public ./public`).

## Glowne pliki Remotion

- `src/index.ts`
- `src/Root.tsx`
- `src/core/posts/InstagramPostDefinition.ts`
- `src/core/dates/plDate.ts`
- `src/core/fonts/kniFonts.ts`
- `src/core/posts/postThemes.ts`
- `src/core/posts/post-themes.json`
- `src/core/icons/icon-packs.json`
- `src/core/icons/kni-icons.json`
- `src/core/icons/kni-brand-icons.json`
- `src/core/icons/phosphor-icons.json`
- `src/components/icons/TopicIcon.tsx`
- `src/core/mosaic/mosaic.ts`
- `src/core/mosaic/solarSystem.ts`
- `src/components/backgrounds/SolarSystemBackground.tsx`
- `src/posts/post-spotkanie-base/post-spotkanie-base-template.component.tsx`
- `src/posts/post-spotkanie-base/post-spotkanie-base.post.ts`
- `src/posts/registry.ts`
- `remotion.config.ts`

## Web UI (generator postow)

`server/` to mini-aplikacja (Node, bez zaleznosci poza Remotion) wystawiajaca formularz:
wybierasz szablon postu, nadpisujesz teksty i renderujesz podglad (PNG 0,4x) albo PNG
w pelnej rozdzielczosci. Zadania leca pojedynczo w kolejce, wyniki laduja w `out/`
(w kontenerze na wolumenie), historia w `out/jobs.json`, a ostatni kafelek ukladu i historia
seedow leza w `out/ui-state.json`.

![Generator postow](docs/screenshots/generator.png)

Pola formularza:

- **Kafelek układu** — siatka 3x3. 9 postów tworzy jeden obraz w siatce Instagrama; generator
  pamięta ostatnio wygenerowany kafelek (`out/ui-state.json`) i domyślnie podpowiada następny.
  Numer przesuwa się dopiero po **Renderuj PNG** — podgląd nie zużywa kafelka. Wybór i podpowiedź
  przechodzą też między kompozycjami bazowymi.
  Numeracja idzie od 9 do 1: najstarszy post to 9 i trafia w prawy dolny róg siatki, a kolejne
  posty (8, 7, ... 1) dokładają się przed nim — dlatego generator schodzi z kafelka 8 do 0.
- **Ziarno tła** — liczba, z której generator buduje układ słoneczny. Przycisk **Nowe tło**
  losuje nowy seed (po 9 kafelkach masz świeże tło), a **Wstecz** wraca do poprzedniego.
  Historia seedów jest zapisana w `out/ui-state.json`, więc działa też po restarcie.
- **Data spotkania** — kalendarz (`input[type=date]`). Domyslnie ustawia sie najblizszy
  wtorek (dzisiaj, jesli dzisiaj jest wtorek), a przyciski **Najblizszy wtorek**
  i **Najblizszy poniedzialek** ustawiaja date ponownie. Pod polem widac tekst,
  ktory pojawi sie na plakacie, np. `10 listopada 2026`.
- reszta to teksty postu; puste pole usuwa dany tekst.

Formularz pokazuje tylko kompozycje postow; stories zostaja w repo jako archiwum.

Uruchomienie lokalne:

```bash
npm install
npm run browser:ensure   # pobiera Chrome Headless Shell do node_modules/.remotion
npm run serve            # http://127.0.0.1:8083
```

Zmienne srodowiskowe: `PORT` (domyslnie 8083), `HOST` (0.0.0.0), `OUT_DIR`
(domyslnie `./out`), `REMOTION_CONCURRENCY` (domyslnie auto = liczba rdzeni).

API: `GET /api/health`, `GET /api/compositions` (zwraca tez `shapeIndexSuggestion` i stan seedow),
`GET|POST /api/seeds` (`roll` / `back` / `select`), `GET|POST /api/jobs`, `GET /api/jobs/<id>`,
`GET /api/jobs/<id>/log`, `GET /api/jobs/<id>/file`, `DELETE /api/jobs/<id>` (anuluj/usun).

### Docker (opcjonalnie)

Repo ma `Dockerfile` (Node 22 + Chrome Headless Shell), wiec generator uruchomisz tez poza Windows:

```bash
docker build -t kni-posters .
docker run --rm -p 8083:8083 -v "$PWD/out:/app/out" kni-posters
```

Kontener nasluchuje na porcie `8083` i nie potrzebuje zewnetrznych uslug — wystaw go tak,
jak pasuje do Twojej infrastruktury (reverse proxy, VPN, siec lokalna). Wzorcowy
`docker-compose.yml` jest w `deploy/docker-compose.example.yml`.

### Automatyczny deploy (GitHub Actions)

`.github/workflows/deploy.yml` po pushu na `main` uruchamia na serwerze skrypt wdrozeniowy
(`git fetch` + `docker build` + `docker compose up`). Wymagane sekrety w repo
(Settings -> Secrets and variables -> Actions):

- `DEPLOY_HOST` — adres serwera,
- `DEPLOY_USER` — uzytkownik, ktory wykonuje deploy,
- `DEPLOY_SSH_KEY` — klucz prywatny SSH tego uzytkownika,
- `TS_OAUTH_CLIENT_ID` / `TS_OAUTH_SECRET` — klient OAuth Tailscale z tagiem `tag:ci`
  (runner wchodzi do tailnetu, jesli serwer nie jest osiagalny publicznie).

Skrypt `/srv/kni-posters/deploy.sh` lezy na serwerze i nie jest czescia repo.
Brak sekretow = czerwony run, wiec zielony run zawsze znaczy "wdrozono".

## Licencja

Kod (Remotion, serwer, skrypty) jest na licencji MIT — patrz [LICENSE](LICENSE).
Mozesz go kopiowac, rozwijac i uzywac we wlasnych materialach.

Znaki i assety KNI nie sa objete MIT: logo (`assets/logoKNI*.svg`, `assets/logoGamedev*.svg`),
ikony z `src/core/icons/`, zdjecia (`assets/meetings/`, `assets/TFNiS2026/`) i gotowe
materialy zostaja wlasnoscia Kola Naukowego Informatykow i mozna ich uzywac tylko
w materialach KNI. Czcionka Selawik ma wlasna licencje (SIL OFL 1.1) w `public/fonts/LICENSE.txt`,
a paczka Phosphor jest na MIT (licencja w pakiecie `@phosphor-icons/core`).




