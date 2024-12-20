// @see: https://forum.typst.app/t/how-to-create-a-pagebreak-before-every-depth-1-heading-except-for-the-outline/904
#show outline: set heading(supplement: [Outline])
#show heading.where(depth: 2): it => {
  if it.supplement != [Outline] {
    pagebreak(weak: true)
  }
  it
}

#include "title.typ"
#pagebreak()

#heading(outlined: false, [Варіант 24])

#outline()

#include "task1.typ"
#include "task2.typ"
#include "task3.typ"
#include "task4.typ"
#include "task5.typ"
#include "task6.typ"
#include "task7.typ"
