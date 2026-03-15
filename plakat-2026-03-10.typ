// Plakat KNI – Instagram Story (1080×1920)
#set page(
  width: 1080pt,
  height: 1920pt,
  margin: 16pt,
  fill: rgb("#f5f5f0"),
)

#set text(
  font: "Segoe UI",
  fill: rgb("#111111"),
  lang: "pl",
)

#let accent = rgb("#0047af")
#let muted = rgb("#111111").transparentize(55%)

#pad(x: 90pt, top: 0pt, bottom: 80pt)[

  #v(1fr)

  // Logo duże + godzina — wycentrowane
  #align(center)[
    #v(-100pt)
    
    #image("logo.svg", width: 600pt)

    #v(-120pt)

    #text(size: 164pt, weight: 700, fill: accent)[18:00]
    
  ]

  #v(1fr)

  // Info
  
  #align(center)[
  #text(size: 64pt, weight: 600)[jutro! 10 marca 2026]
  ]

  #v(60pt)

  #box(width: 660pt, height: 4pt, fill: accent)

  #v(60pt)

 #grid(
    columns: (1fr, 3fr),
    row-gutter: 128pt,
    align: (left + horizon, right + horizon),
    text(size: 56pt, weight: 600)[temat:],
    text(size: 76pt, weight: 700, fill: accent)[AI w grach wideo],
    text(size: 56pt, weight: 600)[gdzie?],
    text(size: 56pt, weight: 700, fill: accent)[Wydział Matematyki#linebreak()i Informatyki, sala L9]
  )

  #v(60pt)

  // Stopka
  #align(center)[
  #text(size: 64pt, weight: 700)[zapraszamy!]
  ]
  
  #v(120pt)
]
