= Мета

Освоєння верстки поштової та мобільної версії веб-сторінки, виявлення особливостей функціонування веб-сторінок для
мобільних пристроїв та поштових програм.

= Завдання

1. У вас вже є обраний із 16 варіантів власний варіант виконання роботи відповідно до вашого порядкового номера у списку
  групи, подальші маніпуляції виконуйте, враховуючи підготовлену головну сторінку веб- сайта з л. р. №2.
2. Доступними вам засобами зверстайте новий екземпляр головної веб-сторінки веб-сайта згідно з вашим варіантом для поштової
  розсилки цієї веб-сторінки, зберігаючи контент веб-сторінки, з урахуванням позиціювання та візуалізації окремих
  елементів веб-сторінки.
3. Надішліть зверстану веб-сторінку електронною поштою, і переконайтесь в її коректному відображенні поштовою програмою
  Mozilla Thunderbird та поштовими веб-інтерфейсами gmail.com, mail.ukr.net, mail.i.ua. Вкажіть переваги та недоліки видів
  верстки для розробки поштової версії веб-сторінки.
4. Доступними вам засобами зверстайте новий екземпляр головної веб-сторінки веб-сайта згідно з вашим варіантом для
  комфортного використання веб-сторінки на смартфоні, зберігаючи контент веб-сторінки, при потребі на власний розсуд
  змінюючи позиціювання та візуалізацію окремих елементів веб-сторінки. Аргументуйте зміни.
5. Інтегруйте розроблену мобільну верстку головної веб-сторінки до верстки головної веб-сторінки із л.р. №2. Опублікуйте
  результат на GitHub Pages (або обраному вами хостінгу).
6. Продемонструйте коректне функціонування головної веб-сторінки в інтернеті на екрані ноутбука та на екрані смартфона.

= Демонстрація

#figure(caption: [E-mail], image("../assets/images/image_2025-01-21_09-05-17.png"))

За даними сайту #link("https://catiemail.com")[Can I email] #footnote[https://caniemail.com], сучасну flex та grid
розмітку підтримують менше 60% поштових клієнтів. З цієї причини було прийнято рішення використовувати табличну верстку.
Враховуючи, що поштовий клієнт не надсилає тег <head>, довелося вбудовувати CSS-стилі в HTML-теги за допомогою атрибута
style.

#figure(caption: [Mobile], image("../assets/images/Screenshot_20250121-090657_Chrome.png"))

= Код програми

#raw(lang: "html", read("../index.html"))
