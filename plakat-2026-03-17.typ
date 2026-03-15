// Plakat KNI – Instagram Story (1080×1920)
#let fract(x) = x - calc.floor(x)
#let rand(seed, x) = fract(calc.sin((x + 1.0) * seed * 12.9898 + seed * 78.233) * 43758.5453)
#let time = float(sys.inputs.at("t", default: "0"))

#let cosmic-bg = {
  let elements = ()
  let num-stars = 400
  
  for i in range(num-stars) {
    // Generate pseudo-random 3D coordinates for each star (-1 to 1 for x, y; 0 to 1 for z)
    let rx = rand(1.1, i) * 2.0 - 1.0
    let ry = rand(2.2, i) * 2.0 - 1.0
    let rz = rand(3.3, i)
    
    // Move the star towards the camera based on the animation time
    let speed = 0.8
    let current-z = calc.rem(rz - time * speed + 10.0, 1.0)
    
    // Prevent division by zero and clipping issues
    if current-z > 0.001 {
      // 3D to 2D projection (standard perspective divide)
      // 540pt and 960pt represent the center of your 1080x1920 canvas
      let px = (rx / current-z) * 500pt + 540pt
      let py = (ry / current-z) * 500pt + 960pt
      
      // Calculate opacity and size fading in as they get closer (z -> 0)
      let scale = 1.0 - current-z
      let size = scale * 8pt + 1pt
      let alpha = scale * 100%
      
      // Give some variation in star color
      let color-mix = rand(4.4, i)
      let star-color = if color-mix < 0.3 {
        rgb("#ffdbed") // Accent color
      } else if color-mix < 0.6 {
        rgb("#a8c5ff") // Blueish
      } else {
        rgb("#ffffff") // White
      }
      
      // Only draw if within bounds
      if px > 0pt and px < 1080pt and py > 0pt and py < 1920pt {
        elements.push(
          place(
            dx: px,
            dy: py, 
            circle(
              radius: size / 2, 
              fill: star-color.transparentize(100% - alpha)
            )
          )
        )
      }
    }
  }
  
  block(width: 100%, height: 100%, clip: true, elements.join())
}

#set page(
  width: 1080pt,
  height: 1920pt,
  margin: 16pt,
  fill: gradient.linear(
    rgb("#03050d"),
    rgb("#07112a"),
    rgb("#130c2d"),
    angle: 26deg,
  ),
  background: cosmic-bg,
)

#set text(
  font: "Segoe UI",
  fill: rgb("#ffffff"),
  lang: "pl",
)

#let accent = rgb("#ffdbed")
#let muted = rgb("#ffffff").transparentize(40%)

#pad(x: 90pt, top: 0pt, bottom: 80pt)[

  #v(1fr)

  // Logo duże + godzina — wycentrowane
  #align(center)[
    #v(-100pt)
    
    #image("logo-white.svg", width: 600pt)

    #v(-120pt)

    #text(size: 164pt, weight: 700, fill: accent)[18:00]
    
  ]

  #v(1fr)

  // Info
  
  #align(center)[
  #text(size: 64pt, weight: 600)[spotkanie koła pojutrze! #linebreak() 17 marca 2026]
  ]

  #v(60pt)

  #box(width: 660pt, height: 4pt, fill: accent)

  #v(60pt)

 #grid(
    columns: (1fr, 3fr),
    row-gutter: 128pt,
    align: (left + horizon, right + horizon),
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
