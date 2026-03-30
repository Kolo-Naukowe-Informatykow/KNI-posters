#set document(title: "Gala Copernicana - Instagram Post")

#set page(
  width: 1080pt,
  height: 1080pt,
  margin: 60pt,
  fill: rgb("500104")
)

#let bg = rgb("500104")
#let text-color = rgb("f2eef2")
#let accent = rgb("e8cd79")

#set text(
  font: ("Playfair Display", "Times New Roman", "serif"),
  fill: text-color,
  size: 50pt,
  weight: "regular",
  lang: "pl"
)
#set align(center + horizon)

#let slide(body) = {
  place(
    center + horizon,
    rect(
      width: 1020pt,
      height: 1020pt,
      stroke: 6pt + accent.transparentize(50%),
      radius: 0pt
    )
  )
  block(width: 100%, body)
}

#slide[
  #v(80pt)
  #text(font: ("Playfair Display", "Times New Roman", "serif"), size: 128pt, fill: text-color, weight: "bold")[VII GALA] \
  #text(font: ("Playfair Display", "Times New Roman", "serif"), size: 128pt, fill: accent, weight: "bold")[COPERNICANA]
  
  #v(80pt)
  
  #text(size: 60pt, font: ("Montserrat", "Arial", "sans-serif"))[KNI znowu nominowane!]
  
  #v(80pt)
  
  #text(size: 60pt)[Oddaj głos do] \
  #text(size: 100pt, fill: accent, weight: "bold")[17 marca]
  
  #v(80pt)
  
  #text(size: 40pt, font: ("Montserrat", "Arial", "sans-serif"), fill: text-color.transparentize(30%))[
    (Link do głosowania w opisie)
  ]
]

#pagebreak()

#slide[
  #v(-100pt)
  #image("logoKNI-text-accent.svg", width: 650pt)
  
  #v(-100pt)
  
  #text(font: ("Montserrat", "Arial", "sans-serif"), size: 50pt)[Zostaliśmy nominowani \ w kategorii:]
  
  #v(-30pt)
  
  #text(size: 100pt, fill: accent, weight: "bold")[Zakręceni w nauce]
  
  #v(-70pt)
  
  #text(size: 60pt)[Najlepsze koło naukowe]
]

#pagebreak()

#slide[
  #box(
    inset: 40pt,
    width: 450pt,
    height: 450pt,
    align(center + horizon)[
      #image("DefiDronLogo.png", width: 100%)
    ]
  )
  
  #v(-100pt)

  #text(font: ("Montserrat", "Arial", "sans-serif"), size: 72pt, fill: accent, weight: "bold")[DefiDron]
  
  #v(-10pt)
  
  #text(font: ("Montserrat", "Arial", "sans-serif"), size: 50pt)[Projekt członków naszego koła otrzymał \ również nominację w kategorii:]
  
  #v(-40pt)
  
  #text(size: 100pt, fill: accent, weight: "bold")[Made by students]
  
  #v(-70pt)
  
  #text(size: 60pt)[Najlepszy studencki projekt]
]

