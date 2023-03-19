# Опис проекту

Цей проект є результатом завдання "Front-End School 2.0". Метою завдання було створити веб-додаток для навчання з двома сторінками: сторінкою з курсами та сторінкою перегляду курсу. Додаток використовує API, який було надано учасникам завдання.

## Функціонал

Додаток показує на першій сторінці список останніх 10 курсів з фото курсу, заголовком, кількістю уроків, навичками та рейтингом. При наведенні на картинку курсу відтворюється превью курсу.

На сторінці курсу користувач може відкрити будь-який урок (якщо він не заблокований) та переглянути його відео. Крім того, додаток зберігає прогрес перегляду відео та уроку курсу локально, щоб користувачі могли продовжити перегляд з місця, де вони зупинилися.

Також, додаток містить функціонал picture-in-picture, що дозволяє відкрити відео у правому нижньому куті сторінки та ходити по інших сторінках. Крім того, користувачі можуть змінювати швидкість програвання відео через клавіатуру без використання сторонніх бібліотек.

## Технології

Додаток було створено з використанням таких технологій:

- vue-cli
- vue 3
- typescript
- tailwind
- hls.js
- @heroicons/vue

## Як користуватись

Для початку користування додатком потрібно склонувати репозиторій та встановити всі необхідні залежності за допомогою наступної команди:

```
npm install or yarn install
```

Для запуску додатку потрібно ввести наступну команду:

```
npm run serve or yarn install
```

Після запуску додатку він буде доступний за адресою `http://localhost:8080/

## Майбутні покращення:

- Додати тестування.
- Покращити пагінацію.
- Додати можливість пошуку курсів та фільтрації за різними параметрами (наприклад, за рівнем складності, категорією тощо).
- Додати можливість додавання коментарів до курсів та уроків.
- Додати можливість імпорту та експорту даних про користувача та їх прогресу у навчанні.
- Покращити дизайн сторінки та додати більше анімацій та ефектів.
- Додати прогрес курсу та уроків
