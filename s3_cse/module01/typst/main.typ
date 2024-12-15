#set page(paper: "a4")
#set par(first-line-indent: 1.25cm)
#set text(font: "Times New Roman", size: 14pt)

#show outline: set heading(supplement: [Outline])
#show heading.where(depth: 1): it => {
  if it.supplement != [Outline] [
    #pagebreak(weak: true)
  ]
  it
}

#include "title.typ"

#pagebreak(weak: true)
#include "outline.typ"

#include "abbrev.typ"
#include "intro.typ"

#set heading(numbering: "1.")
#show heading: it => {
  if it.level == 1 {
    text(weight: "bold", it)
  } else {
    text(weight: "regular", it)
  }
}

#include "body.typ"
#include "refs.typ"
