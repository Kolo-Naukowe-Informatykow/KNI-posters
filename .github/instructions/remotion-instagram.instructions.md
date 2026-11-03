---
applyTo: "src/**"
description: "Uzyj przy tworzeniu i edycji statycznych postow Instagram KNI w Remotion (kompozycje, layout, tlo proceduralne, propsy)."
---

# Instrukcja robocza: Remotion Instagram (KNI)

## Zakres

Ta instrukcja dotyczy tylko statycznych postow (1080x1350) tworzonych w Remotion.
Stories, animacje i foldery `typst/` sa legacy — nie rozwijaj ich.

## Checklist implementacyjny

1. Nowy post to definicja `.post.ts` w `src/posts/<temat>/` z wlasnym `id`, tekstami, `dateISO`,
   `shapeIndex` i `seed`; komponent bierz z `src/posts/post-spotkanie-base/post-spotkanie-base-template.component.tsx`.
2. Rejestruj definicje w `src/posts/registry.ts` (`postRegistry`).
3. Pozostaw `src/Root.tsx` jako warstwe mapujaca `compositionRegistry` na `<Composition ... />`.
4. Utrzymuj standard: `1080x1350`, `durationInFrames: 1` (statyczny PNG).
5. Date podawaj jako `dateISO` (`RRRR-MM-DD`) — komponent formatuje ja na `3 pazdziernika 2026`.
   Nie wpisuj daty jako gotowego tekstu.
6. Tlo wybieraj przez `seed`; generator ukladu slonecznego trzymaj w `src/core/mosaic/solarSystem.ts`,
   a mape kafelkow w `src/core/mosaic/mosaic.ts`. Kazdy post ma `shapeIndex` 0-8 — 9 kafelkow tworzy
   jeden obraz w siatce Instagrama, wiec w jednej serii nie zmieniaj `seed`.
7. Uklad rysuj w jednych wspolnych wspolrzednych mozaiki i przesuwaj tylko `viewBox` —
   zadnych gradientow ani winiet liczonych per kafelek (na styku bylby szew).
7. Preferuj logo z `assets/` zamiast dodawania nowych wariantow.
8. Opis publikacyjny trzymaj w polu `caption` definicji oraz w pliku `.opis.md`.
9. Zdjecia sa opcjonalne — post tekstowy jest OK.
10. Czcionki ustawiaj przez `KNI_FONT_FAMILY` z `src/core/fonts/kniFonts.ts` (pliki w `public/fonts/`).
    Nie wpisuj nazw czcionek systemowych — na serwerze Linux ich nie ma i render wychodzi inny niz lokalnie.

## Wspolna stylistyka postow

- Ciemny gradient (granat/fiolet), gwiazdy, logo `logoKNI-text-white.svg`, duza godzina.
- Hierarchia: godzina → dzien/data → temat → miejsce → stopka.
- Jedno ciagle tlo na cala mozaike (bez szwow i winiet na brzegach kafelkow).

## Render dowolnej kompozycji

```bash
npm run remotion:compositions
npm run remotion:still
npx remotion still src/index.ts <ID> out/<nazwa>.png --frame=0
```

## Nazewnictwo plikow

- Kazdy nowy plik materialu zawiera date publikacji `rrrr-mm-dd` (wyjatek: wspolny szablon).
- Posty: `post-<temat>-<rrrr-mm-dd>.<rola>.ts(x)`, role `component`, `post`, `opis`.
- Stories (`story-*`) sa legacy; zostaje tylko szablon `src/posts/story-base/`.

## Zasady wizualne

- Ciemne tlo, jasny tekst, akcent `#ffdbed` i `#6c63ff` stosowane oszczednie.
- Minimalizm i hierarchia informacji sa wazniejsze niz ozdobniki.
- Malo tekstu, duze rozmiary, wysoki kontrast.
- Czcionka: `KNI_FONT_FAMILY` (Selawik z repo, metrycznie zgodny z Segoe UI).
- Brak emotek i brak formalnego tonu.

## Jakosciowe warunki akceptacji

- Kompozycja dziala w Remotion Studio.
- Kod TypeScript przechodzi bez bledow.
- Material jest czytelny na urzadzeniu mobilnym.
- `npm run remotion:still` renderuje PNG nowej kompozycji.


