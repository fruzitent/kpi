#show heading: set text(weight: "regular")
#show heading.where(level: 1): set align(center)
#show heading.where(level: 1): set text(weight: "bold")

// TODO: https://github.com/typst/typst/issues/311
#show figure: it => [ #it #v(-par.spacing) #{ "" } ]
#show heading: it => [ #it #v(-par.spacing) #{ "" } ]
#show list: it => [ #it #v(-par.spacing) #{ "" } ]
#show terms: it => [ #it #v(-par.spacing) #{ "" } ]

// Текст на сторінці розміщується з дотриманням наступних відступів: зверху, знизу, зліва – не менше 20 мм, справа – не
// менше 10 мм. При комп’ютерному наборі використовується шрифт Times New Roman, розмір шрифту – 14рр, міжрядковий інтервал
// – 1.5, вирівнювання абзаців – по ширині, перший рядок – відступ 1,25 см.
// TODO: https://github.com/typst/typst/issues/4224
#let leading = 1.5em
#let leading = leading - 0.75em
#set document(author: "", title: "БАЗА ДАНИХ ДЛЯ МОРСЬКОГО ВАНТАЖНОГО ТЕРМІНАЛУ")
#set page(margin: (bottom: 2cm, left: 2cm, right: 1cm, top: 2cm), paper: "a4")
#set par(first-line-indent: 1.25em, justify: true, leading: leading, spacing: leading)
#set text(font: "Times New Roman", lang: "ua", region: "ua", size: 14pt)

// Для нумерації сторінок, розділів, підрозділів, пунктів, підпунктів використовують арабські цифри. Першою сторінкою
// курсової роботи є титульний аркуш. На титульному аркуші номер сторінки не ставлять, на наступних сторінках номер
// проставляють зверху у правому куті. Кожен розділ повинен мати свій номер, який записується перед його назвою. Після
// номера розділу крапка не ставиться.
#set page(header: context{
  let current = counter(page).get().first()
  if current > 1 {
    align(right, numbering("1", current))
  }
})

// Кожен розділ необхідно розпочинати з нової сторінки. Розділ може складатися з підрозділів. Підрозділи нумерують у межах
// кожного розділу. Номер підрозділу складається з номера розділу і порядкового номера підрозділу, між якими ставлять
// крапку. У кінці номера підрозділу крапка так само не ставиться. Наступні розділи курсової роботи: ЗМІСТ, ВСТУП,
// ВИСНОВКИ, СПИСОК ВИКОРИСТАНОЇ ЛІТЕРАТУРИ не мають порядкового номера, але всі аркуші, на яких розміщені згадані
// структурні частини курсової, нумерують звичайним чином.
#show heading.where(level: 1): it => {
  if it.supplement != [outline] {
    pagebreak(weak: true)
  }
  it
}
#show outline: set heading(supplement: [outline])

// Рисунки (схеми, діаграми, скріншоти) і таблиці надаються безпосередньо після тексту, де вони згадані вперше. Рисунки
// позначають словом "Рисунок" і нумерують послідовно у межах розділу. Номер рисунку складається з номера розділу і
// порядкового номера рисунку в рамках розділу, між якими ставиться крапка. Після номеру рисунку крапка не ставиться.
// Підпис рисунків розміщують під самим рисунком по центру тексту.
#show figure.where(kind: image): set figure.caption(position: bottom, separator: [ ])
#show figure.where(kind: image): set figure(numbering: i => numbering("1.1", counter(heading).get().first(), i))
#show figure.where(kind: image): it => { show figure.caption: set align(center); it }
#show heading: it => { counter(figure.where(kind: image)).update(0); it }

// Таблиці, як і рисунки, нумерують послідовно у межах розділу. У лівому верхньому куті з абзацного відступу над таблицею
// розміщують напис "Таблиця" із зазначенням її номера. Номер таблиці складається з номера розділу і порядкового номера
// таблиці, між якими ставиться крапка. Після номеру таблиці крапка не ставиться. При переносі частини таблиці на наступну
// сторінку над частиною перенесеною таблиці з абзацного відступу вказують "Продовження таблиці" і номер таблиці.
#show figure.where(kind: table): set figure.caption(position: top, separator: [ ])
#show figure.where(kind: table): set figure(numbering: i => numbering("1.1", counter(heading).get().first(), i))
#show figure.where(kind: table): it => { show figure.caption: set align(left); it }
#show heading: it => { counter(figure.where(kind: table)).update(0); it }

// Додаток повинен починатися з нової сторінки та мати заголовок. Додатки позначаються великими літерами української
// абетки, за винятком літер Г, Є, І, Ї, Й, О, Ч, Ь.

#include "title.typ"
#include "contents.typ"
#include "intro.typ"
#include "body.typ"
#include "summary.typ"
#include "reference.typ"
#include "appendix.typ"
