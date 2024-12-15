#set page(paper: "a4")
#set par(first-line-indent: 1.25cm)
#set text(font: "Times New Roman", size: 14pt)

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

#include "title.typ"

#pagebreak(weak: true)
#outline(title: "ЗМІСТ")

#include "abbrev.typ"
#include "intro.typ"

#[
  #set heading(numbering: "1.")
  #include "body.typ"
]

#bibliography("./hayagriva.yml", title: "СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ")
