#let student = ""
#let teacher = ""
#let variant = 24

#align(center + top, [
  #set text(weight: "bold")
  Міністерство освіти і науки України \
  Національний технічний університет України
  "Київський політехнічний інститут імені Ігоря Сікорського" \
  Факультет інформатики та обчислювальної техніки \
  Кафедра інформатики та програмної інженерії
])

#align(center + horizon, [
  = Модульна контрольна робота №2
  Варіант №#variant \
  з дисципліни "Проєктування алгоритмів"
])

#v(3em)

#align(center + horizon, [
  #stack(dir: ltr, spacing: 1em, align(left, [
    Виконав(ла)
  ]), align(center, [
    #underline(extent: 100pt, student) \
    #v(-1em)
    #text(0.75em, [(шифр, прізвище, ім'я, по батькові)])
    #v(-0.75em)
  ]), align(right, [
    #underline([#box(width: 5em, repeat(sym.space))])
  ]))
  #v(1em)
  #stack(dir: ltr, spacing: 1em, align(left, [
    Перевірив
  ]), align(center, [
    #underline(extent: 100pt, teacher)
    #v(-1em)
    #text(size: 0.75em, [(шифр, прізвище, ім'я, по батькові)])
    #v(-0.75em)
  ]), align(right, [
    #underline([#box(width: 5em, repeat(sym.space))])
  ]))
])

#align(center + bottom, [
  Київ - #datetime.today().year()
])
