= Мета

- Вивчити правила побудови ідентифікаторів, правила визначення змінних та типів. Визначити правила роботи з циклами та
  умовними конструкціями, роботу зі змінними типу Table.
- Вивчити синтаксис та семантику функцій та збережених процедур, способів їх ідентифікації, методів визначення та
  специфікації параметрів та значень, котрі повертаються, виклик функцій та збережених процедур.
- Застосування команд для створення, зміни та видалення як скалярних, так і табличних функцій, збережених процедур.
- Вивчити призначення та типи курсорів, синтаксис та семантику команд мови SQL для створення курсорів, вибірки даних з
  курсорів, зміни даних із застосуванням курсорів.
- Вивчити призначення та типи тригерів, умов їх активації, синтаксису та семантики для їх створення, модифікації,
  перейменування, програмування та видалення.

= Постановка задачі

#show raw: set text(size: 0.5em)

== Збережені процедури

+ створення процедури, в якій використовується тимчасова таблиця, котра створена через змінну типу TABLE

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1a-temporary.sql"))

+ створення процедури з використанням умовної конструкції IF

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1b-if.sql"))

+ створення процедури з використанням циклу WHILE

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1c-while.sql"))

+ створення процедури без параметрів

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1d-void.sql"))

+ створення процедури з вхідним параметром та RETURN

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1e-return.sql"))

+ створення процедури оновлення даних в деякій таблиці БД

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1f-update.sql"))

+ створення процедури, в котрій робиться вибірка даних

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1g-select.sql"))

== Функції

+ створити функцію, котра повертає деяке скалярне значення

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/2a-scalar.sql"))

+ створити функцію, котра повертає таблицю з динамічним набором стовпців

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/2b-dynamic.sql"))

+ створити функцію, котра повертає таблицю наперед заданої структури

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/2c-table.sql"))

== Робота з курсорами

+ створення курсору

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/3a-create.sql"))

+ відкриття курсору

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/3b-open.sql"))

+ вибірка даних

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/3c-select.sql"))

+ робота з курсорами

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/3d-work.sql"))

== Робота з тригерами

+ створити тригер, котрий буде спрацьовувати при видаленні даних

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/4a-delete.sql"))

+ створити тригер, котрий буде спрацьовувати при модифікації даних

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/4b-update.sql"))

+ створити тригер, котрий буде спрацьовувати при додаванні даних

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/4c-insert.sql"))
