= Мета

- Вивчити команди DML, котрі використовуються в реляційних СУБД, для вибірки даних з таблиць
- Вивчити команди SQL для створення запитів з використанням підзапитів та з’єднань
- Навчитись створювати запити згідно їх словесного опису

= Постановка задачі

#show raw: set text(size: 0.5em)

== Запити для вибірки даних

+ Найпростіших умов та операторів порівняння

  #text(fill: green)[>] #text(fill: gray)[Знайти одноповерхові будинки]

  #raw(lang: "sql", read("../sql/1a-simple.sql"))

+ Умов з використанням логічних операторів AND, OR та NOT та їх комбінацій.

  #text(fill: green)[>] #text(fill: gray)[Знайти майбутні бронювання що ще не були закриті]

  #raw(lang: "sql", read("../sql/1b-logical-not.sql"))

  #text(fill: green)[>] #text(fill: gray)[Знайти квартири у хорошому стані]

  #raw(lang: "sql", read("../sql/1b-logical-or.sql"))

+ Використанням виразів над стовпцями, як в якості новостворених стовпців, так і умовах

  #text(fill: green)[>] #text(fill: gray)[Вивести повне ім'я всіх користувачів]

  #raw(lang: "sql", read("../sql/1c-expression-concat.sql"))

  #text(fill: green)[>] #text(fill: gray)[Обрахувати площу нерухомості]

  #raw(lang: "sql", read("../sql/1c-expression-eval.sql"))

+ Використання операторів:
  1. Приналежності множині

    #text(fill: green)[>] #text(fill: gray)[Знайти недійсні пропозиції]

    #raw(lang: "sql", read("../sql/1d-set.sql"))

  2. Приналежності діапазону

    #text(fill: green)[>] #text(fill: gray)[Знайти бронювання що були створені у проміжок між датами]

    #raw(lang: "sql", read("../sql/1d-between.sql"))

  3. Відповідності шаблону

    #text(fill: green)[>] #text(fill: gray)[Знайти файли у форматі zip]

    #raw(lang: "sql", read("../sql/1d-pattern.sql"))

= Запити з використанням підзапитів та з’єднань

+ Використання підзапитів в рядку вибірки полів (у секції select) та вибірки з таблиць (у секції from)

  #text(fill: green)[>] #text(fill: gray)[Вивести місто у якому знаходиться нерухомість]

  #raw(lang: "sql", read("../sql/2a-field.sql"))

+ Використання підзапитів в умовах з конструкціями EXISTS, IN

  #text(fill: green)[>] #text(fill: gray)[Знайти агентів, які мали дорожчі за 1000\$ пропозиції]

  #raw(lang: "sql", read("../sql/2b-condition-exists.sql"))

  #text(fill: green)[>] #text(fill: gray)[Знайти ще неперевірені модераторами пропозиції]

  #raw(lang: "sql", read("../sql/2b-condition-in.sql"))

+ Декартовий добуток

  #text(fill: green)[>] #text(fill: gray)[Вивести всі варіації співпраці агентів з кліентами]

  #raw(lang: "sql", read("../sql/2c-cartesian.sql"))

+ З'єднання декількох таблиць за рівністю та умовою відбору

  #text(fill: green)[>] #text(fill: gray)[Знайти квартири за розташуванням]

  #raw(lang: "sql", read("../sql/2d-multiple-on.sql"))

  #text(fill: green)[>] #text(fill: gray)[Знайти статистику по пропозиції]

  #raw(lang: "sql", read("../sql/2d-multiple-using.sql"))

+ Внутрішнього з’єднання

  #text(fill: green)[>] #text(fill: gray)[Знайти існуючі пропозиції для нерухомості]

  #raw(lang: "sql", read("../sql/2e-inner.sql"))

+ Лівого зовнішнього з’єднання

  #text(fill: green)[>] #text(fill: gray)[Знайти можливі пропозиції для нерухомості]

  #raw(lang: "sql", read("../sql/2f-left-outer.sql"))

+ Правого зовнішнього з’єднання

  #text(fill: green)[>] #text(fill: gray)[Знайти клієнтів та пропозиції що вони зробили]

  #raw(lang: "sql", read("../sql/2g-right-outer.sql"))

+ Об’єднання та перетин запитів

  #text(fill: green)[>] #text(fill: gray)[Знайти файли з однаковим іменем та різним типом]

  #raw(lang: "sql", read("../sql/2h-intersect.sql"))

  #text(fill: green)[>] #text(fill: gray)[Вивести всі події типу 'створено']

  #raw(lang: "sql", read("../sql/2h-union.sql"))

= Запити за словесним описом

+ Сформувати звіт про надані рієлторські послуги по кожному типу нерухомості

  #raw(lang: "sql", read("../sql/33-report.sql"))

+ Вивести ПІБ рієлтерів, котрі в поточному місяці мали угоди тільки по оренді

  #raw(lang: "sql", read("../sql/33-tenancy.sql"))
