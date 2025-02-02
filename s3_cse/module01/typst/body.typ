= ПЕРЕДПРОЄКТНЕ ОБСТЕЖЕННЯ ПРЕДМЕТНОЇ ОБЛАСТІ

== Аналіз предметної області

== Аналіз наявних рішень

=== Аналіз відомих програмних продуктів

#let g(body) = table.cell(body, fill: green.lighten(90%))
#let r(body) = table.cell(body, fill: red.lighten(90%))
#let y(body) = table.cell(body, fill: yellow.lighten(90%))

#[
  #set page(flipped: true)
  #show figure: set block(breakable: true)
  #figure(table(
    align: horizon,
    columns: (1fr, 1.5fr, 1.5fr, 1.5fr, 3fr),
    inset: 0.75em,
    table.header([Функціонал], [Курсова робота], [Jellyfin @jellyfin], [Plex @plex], [Пояснення]),
    //
    [Апаратне прискорення],
    g[Є],
    g[Є],
    y[За підпискою],
    [Використання спеціального обладнання для більш ефективного виконання, ніж ЦП загального призначення],
    //
    [Віддалене управління],
    y[Автоматичне виявлення LAN-сервера],
    y[Автоматичне виявлення LAN-сервера],
    g[Доступ через обліковий запис],
    [Підключення до системи, коли користувач фізично знаходиться далеко],
    //
    [Ліцензія],
    g[MIT],
    g[GPL-2.0],
    r[Freemium],
    [Право використовувати, модифікувати та розповсюджувати ПЗ],
    //
    [Підтримка платформ],
    y[ЩНВ],
    g[Web, Linux, Windows, macOS, Android, iOS],
    g[Web, Linux, Windows, macOS, Android, iOS],
    [Нативний застосунок забезпечує кращу швидкодію, стабільність і задовільний користувацький досвід],
    //
    [Реклама],
    g[Немає],
    g[Немає],
    y[Безкоштовна версія],
    [Спосіб відшкодування витрат на розробку та отримання прибутку],
  ), caption: [Порівняння з аналогом])
]

=== Аналіз відомих алгоритмічних та технічних рішень

== Опис бізнес-процесів

== Постановка задачі

#heading(depth: 2, numbering: none)[Висновки до розділу]
