#show raw: set text(size: 0.5em)

= ER-модель

// #image("../assets/images/foo.svg")

= SQL-таблиці

#figure(caption: [Назва], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([foo], [bar], [baz]),
))

#raw(lang: "sql", read("../sql/00-initdb.sql"))
#raw(lang: "sql", read("../sql/01-faker.sql"))

= Звіт

#raw(lang: "sql", read("../sql/03-report.sql"))

= Запити

1. foo

  #raw(lang: "sql", read("../sql/4a-foo.sql"))

2. foo

  #raw(lang: "sql", read("../sql/4b-foo.sql"))

3. foo

  #raw(lang: "sql", read("../sql/4c-foo.sql"))

4. foo

  #raw(lang: "sql", read("../sql/4d-foo.sql"))
