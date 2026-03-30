---
applyTo: "src/**"
description: "Uzyj przy tworzeniu i edycji materialow Instagram KNI w Remotion (kompozycje, layout, animacje, propsy)."
---

# Instrukcja robocza: Remotion Instagram (KNI)

## Zakres

Ta instrukcja dotyczy tylko materialow tworzonych w Remotion.
Folder `typst/` jest legacy i nie powinien byc rozwijany.

## Checklist implementacyjny

1. Tworz nowy zestaw plikow w `src/posts/<temat>/`:
   - `<typ>-<temat>-<rrrr-mm-dd>.component.tsx`
   - `<typ>-<temat>-<rrrr-mm-dd>.story.ts` lub `.post.ts`
2. Rejestruj definicje w `src/posts/registry.ts`.
3. Pozostaw `src/Root.tsx` jako warstwe mapujaca `compositionRegistry` na `<Composition ... />`.
4. Utrzymuj standard: `1080x1920`, `30 fps`, `180-360` klatek.
5. Uzywaj prostych animacji (`spring`, `interpolate`) i dbaj o czytelnosc.
6. Preferuj logo z `assets/` zamiast dodawania nowych wariantow.

## Nazewnictwo plikow

- Kazdy nowy plik postu musi zawierac date w formacie `rrrr-mm-dd`.
- Stories: `story-<temat>-<rrrr-mm-dd>.<rola>.ts(x)`.
- Posty: `post-<temat>-<rrrr-mm-dd>.<rola>.ts(x)`.
- Dla stories preferuj role: `component`, `story`.
- Dla postow preferuj role: `component`, `post`.

## Zasady wizualne

- Ciemne tlo, jasny tekst, akcent `#6c63ff`.
- Minimalizm i hierarchia informacji sa wazniejsze niz ozdobniki.
- Malo tekstu, duze rozmiary, wysoki kontrast.
- Brak emotek i brak formalnego tonu.

## Jakosciowe warunki akceptacji

- Kompozycja dziala w Remotion Studio.
- Kod TypeScript przechodzi bez bledow.
- Material jest czytelny na urzadzeniu mobilnym.
- Render (`npm run remotion:still` lub `npm run remotion:render`) dziala.
