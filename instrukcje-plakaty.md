# Instrukcje do tworzenia plakatów KNI

## Kontekst

Plakaty tworzone są w **Typst** na potrzeby Instagram Stories Koła Naukowego Informatyków.

## Format

- **Rozmiar**: 1080×1920 pt (proporcje 9:16, Instagram Story)
- **Margines strony**: 0pt (padding wewnętrzny ~80pt po bokach)
- **Wyjście**: PDF (kompilacja: `typst compile nazwa-pliku.typ`)

## Styl wizualny

- Ciemne tło: `rgb("#0f0f0f")` — bez gradientów, bez glow, bez kółek dekoracyjnych
- Główny kolor akcentu: `rgb("#6c63ff")` — używany oszczędnie (separatory, wyróżnienie kluczowej info)
- Tekst biały, szary pomocniczy: `white.transparentize(60%)`
- Czcionka: Segoe UI
- **Minimalizm** — dużo przestrzeni, mało elementów, zero emotek
- Separatory to cienkie kreski (2pt, 120pt szerokości) w kolorze akcentu

## Hierarchia informacji (od góry)

1. Logo KNI + nazwa koła (mała, subtilna)
2. **Najważniejsze**: kiedy — "JUTRO" / data + godzina (największy tekst)
3. Gdzie — budynek + sala
4. Temat prelekcji
5. Stopka — "wstep wolny", data

## Rozmiary tekstu (orientacyjne)

| Element | Rozmiar | Waga |
|---------|---------|------|
| Nazwa koła | 28pt | 300 |
| Podpisy (szare) | 30–36pt | 300 |
| Kluczowe info (JUTRO, godzina) | 88–110pt | 700–800 |
| Sala / temat | 56–62pt | 700 |
| Stopka | 24–26pt | 300 |

Tekst musi być czytelny na telefonie — minimum ~26pt dla najmniejszych elementów.

## Ton

- Luźny, bez formalizmów, bez emotek
- Małe litery tam gdzie to możliwe (z wyjątkiem kluczowych słów jak "JUTRO")
- Bez "Zapraszamy serdecznie" — raczej krótko i na temat

## Pliki w repozytorium

- `logo.svg` — logo KNI (czarne na przezroczystym tle — na ciemnym tle wymaga inwersji lub użycia białej wersji)
- `logo-text.svg` — logo z tekstem

## Nazewnictwo plików

Plakaty: `plakat-RRRR-MM-DD.typ` (data spotkania w nazwie)

## Przykładowy prompt do tworzenia nowego plakatu

> Stwórz plakat w Typst na story na Instagrama KNI. Spotkanie koła [DATA] o [GODZINA] w [BUDYNEK], sala [SALA]. Temat: [TEMAT]. Styl minimalistyczny, ciemne tło, bez emotek, hierarchia: kiedy > gdzie > temat. Plik: plakat-[DATA].typ

## Kompilacja

```sh
typst compile plakat-RRRR-MM-DD.typ
```
