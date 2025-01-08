#let variant = ""
#let student = ""
#let teacher = ""

#align(center + top)[
  Міністерство освіти і науки України\
  Національний технічний університет України\
  «Київський політехнічний інститут імені Ігоря Сікорського»\
  Факультет інформатики та обчислювальної техніки\
  Кафедра інформатики та програмної інженерії\
]

#align(center + horizon)[
  *Лабораторна робота №3* \
  з дисципліни "Бази даних" \
  на тему: "Побудова простих запитів" \
  Варіант #variant \
]

#let hfill(body, width: 1fr) = [
  #box(width: width)[#repeat(sym.space)]
  #body
  #box(width: width)[#repeat(sym.space)]
]

#v(3em)

#align(center + horizon)[
  Виконав
  #underline[#hfill[#student]] \
  #super[(шифр, прізвище, ім'я, по батькові)]\
  Перевірив
  #underline[#hfill[#teacher]] \
  #super[(прізвище, ім'я, по батькові)] \
]

#align(center + bottom)[
  Київ - #datetime.today().year()
]
