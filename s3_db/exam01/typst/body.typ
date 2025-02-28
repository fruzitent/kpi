#show raw: set text(size: 0.5em)

= ER-модель

// #image("../assets/images/foo.svg")

= SQL-таблиці

#figure(caption: [member - гравець кіберспортивної команди], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([date_of_birth], [timestamptz], [Дата народження]),
  ..([first_name], [text], [Ім'я]),
  ..([last_name], [text], [Фамілія]),
  ..([member_id], [primary key], [Ідентифікатор]),
  ..([user_name], [text], [Псевдонім]),
))

#figure(caption: [team - кіберспортивна команда], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([description], [text], [Короткий опис]),
  ..([team_id], [primary key], [Ідентифікатор]),
  ..([team_name], [text], [Назва]),
))

#figure(caption: [member_team - співставлення гравців до команд], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([member_id], [foreign key], [Сутність гравця]),
  ..([team_id], [foreign key], [Сутність команди]),
))

#figure(caption: [game - гра, з якої проводять кіберспортивний турнір], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([game_id], [primary key], [Ідентифікатор]),
  ..([game_name], [text], [Назва]),
  ..([max_players], [bigint], [Максимальна кількість гравців]),
  ..([min_players], [bigint], [Мінімальна кількість гравців]),
))

#figure(caption: [event - сутність турніру], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([event_id], [primary key], [Ідентифікатор]),
  ..([event_name], [text], [Назва]),
  ..([game_id], [foreign key], [Гра з якої проводиться змагання]),
  ..([location], [text], [Розташування]),
  ..([scheduled_at], [timestamptz], [Запланований час початку]),
))

#figure(caption: [match - турнірний матч], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([bracket], [bracket], [Дужка]),
  ..([event_id], [foreign key], [Сутність турніру]),
  ..([match_id], [primary key], [Ідентифікатор]),
))

#figure(caption: [schedule - планувальник матчів], table(
  align: horizon,
  columns: 3,
  inset: 0.75em,
  ..([Атрибут], [Тип], [Опис]),
  ..([schedule_id], [primary key], [Ідентифікатор]),
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
