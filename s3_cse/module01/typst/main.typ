// TODO: https://github.com/typst/typst/issues/4224
#let leading = 1.5em
#let leading = leading - 0.75em

#set page(margin: (bottom: 2cm, left: 2cm, right: 1cm, top: 2cm), paper: "a4")
#set par(first-line-indent: 1.25cm, leading: leading, spacing: leading)
#set text(font: "Times New Roman", lang: "ua", region: "ua", size: 14pt)

#set figure(numbering: i => numbering("1.1", counter(heading).get().first(), i))
#show figure.where(kind: table): it => {
  set figure.caption(position: top, separator: [ -- ])
  show figure.caption: set align(left)
  it
}
#show heading: it => {
  counter(figure.where(kind: image)).update(0)
  counter(figure.where(kind: table)).update(0)
  it
}

// @see: https://forum.typst.app/t/how-to-create-a-pagebreak-before-every-depth-1-heading-except-for-the-outline/904
#show outline: set heading(supplement: [Outline])
#show heading.where(depth: 1): it => {
  if it.supplement != [Outline] {
    pagebreak(weak: true)
  }
  it
}

#show heading: set text(weight: "regular")
#show heading.where(level: 1): set align(center)
#show heading.where(level: 1): set text(weight: "bold")

// TODO: https://github.com/typst/typst/issues/311
#show heading: it => {
  it
  ""
  v(-1em)
}

#include "title.typ"
#set page(number-align: top + right, numbering: "1")

#pagebreak(weak: true)
#outline(title: "ЗМІСТ")

#include "abbrev.typ"
#include "intro.typ"

#[
  #set heading(numbering: "1.1")
  #include "body.typ"
]

#bibliography(
  "./hayagriva.yml",
  // @see: https://zakon.rada.gov.ua/laws/show/z0155-17
  style: "institute-of-electrical-and-electronics-engineers",
  title: "СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ",
)
