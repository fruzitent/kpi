#set page(paper: "a4")
#set par(first-line-indent: 1.25cm)
#set text(font: "Times New Roman", size: 14pt)

#align(center + horizon, [
  #heading(outlined: false)[Пояснювальна записка до курсової роботи] \
  на тему: "Система для аналізу, фільтрації та структурування мультимедійного контенту" \
  КПІ.ІП-3501.045480.02.81
])

#align(center + bottom, [
  Київ - #datetime.today().year()
])

#pagebreak()

#show outline: it => {
  show heading: set align(center)
  it
}

#outline(title: "ЗМІСТ")

#pagebreak()

#align(center, [
  #heading(outlined: false)[ПЕРЕЛІК УМОВНИХ ПОЗНАЧЕНЬ]
])

/ short: full -- desc

#pagebreak()

#align(center, [
  = ВСТУП
])

#pagebreak()

#set heading(numbering: "1.")

#show heading: it => {
  if it.level == 1 {
    text(weight: "bold", it)
  } else {
    text(weight: "regular", it)
  }
}

= ПЕРЕДПРОЄКТНЕ ОБСТЕЖЕННЯ ПРЕДМЕТНОЇ ОБЛАСТІ

== Аналіз предметної області

== Аналіз наявних рішень

=== Аналіз відомих програмних продуктів

#pagebreak()
#set page(flipped: true)

#show figure: set block(breakable: true)
#figure(table(
  align: horizon,
  columns: (auto, auto, auto, auto, auto),
  inset: 10pt,
  table.header([Функціонал], [Курсова робота], [Jellyfin], [Plex], [Пояснення]),
), caption: [Порівняння з аналогом])

#pagebreak()
#set page(flipped: false)

=== Аналіз відомих алгоритмічних та технічних рішень

== Опис бізнес-процесів

== Постановка задачі

#heading(depth: 2, numbering: none)[Висновки до розділу]

#pagebreak()

#show bibliography: it => {
  show heading: set align(center)
  it
}

#bibliography("./hayagriva.yml", title: "СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ")
