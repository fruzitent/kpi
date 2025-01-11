= Мета

- Вивчити оператор, котрий використовується в реляційних СУБД, для вибірки даних з таблиць, групування та сортування даних
- Навчитись використовувати вбудовані функції в запитах
- Вивчити призначення представлень (view) баз даних, синтаксису та семантики команд SQL для їх створення, зміни та
  видалення, системних збережених процедур для отримання інформації про представлення

= Постановка задачі

#show raw: set text(size: 0.5em)

== Створити запити

+ запит з використанням функції COUNT

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1a-count.sql"))

+ запит з використанням функції SUM

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1b-sum.sql"))

+ запит з використанням групування по декільком стовпцям

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1c-group.sql"))

+ запит з використанням умови відбору груп HAVING

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1d-group-having.sql"))

+ запит з використанням HAVING без GROUP BY

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1e-having.sql"))

+ запит з використанням функцій row_number() over ....

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1f-over.sql"))

+ запит, в котрому значення одного зі стовпців таблиці будуть виведені в рядок через кому

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1g-concat.sql"))

+ запит з використанням сортування по декільком стовпцям в різному порядку

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/1h-sort.sql"))

== Робота з представленнями (view)

+ створити представлення з конкретним переліком атрибутів, котрі обираються, та котре містить дані з декількох таблиць

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/2a-view.sql"))

+ створити представлення, котре містить дані з декількох таблиць та використовує представлення, котре створене в п.a

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/2b-join.sql"))

+ модифікувати представлення з використанням команди ALTER VIEW

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/2c-alter.sql"))

== Запити за словесним описом

+ Визначить рієлтора, котрий за минулі 2 місяці мав найбільшу кількість договорів про оренду чи покупку, чия вартість
  менша за середньостатистичну

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/33-agent.sql"))

+ Визначить тип угоди, котра минулого місяця була найменш популярна серед клієнтів, котрі звертались в рієлторську
  компанію не перший раз

  #text(fill: green)[>] #text(fill: gray)[]

  #raw(lang: "sql", read("../sql/33-offer.sql"))
