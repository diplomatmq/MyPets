# Duo Pet — полное ТЗ и правила разработки

## 1. Назначение

Этот документ — основной источник истины для AI-агента, который будет разрабатывать игру поэтапно.

Агент должен:
- сначала изучать существующий код;
- не переписывать рабочую архитектуру без необходимости;
- реализовывать функции небольшими законченными этапами;
- после каждого этапа запускать и проверять проект;
- использовать backend как источник истины для экономики, случайности, владения и платежей;
- сохранять расширяемость для новых питомцев, предметов, кейсов, событий и механик.

Рабочее название: **Duo Pet**.

---

# 2. Концепция

Duo Pet — социальная игра внутри Telegram Mini App.

Главная идея:

> Два человека объединяются, вместе открывают яйцо, получают общего питомца и совместно его выращивают.

Игра объединяет:
- виртуального питомца;
- совместное взаимодействие двух игроков;
- коллекционирование;
- редкости;
- яйца и кейсы;
- 3D-кастомизацию;
- одежду;
- аксессуары;
- покраску;
- комнату;
- мебель и декор;
- игровую валюту;
- Telegram Stars;
- в будущем TON/крипто;
- P2P-маркет;
- коллекции;
- достижения;
- квесты;
- рейтинги;
- сезонные события.

Ключевая продуктовая идея:

> Это не просто Tamagotchi. Это совместная виртуальная жизнь двух людей вокруг одного существа.

---

# 3. Основной игровой цикл

```text
Пригласить партнера
        ↓
Партнер принимает
        ↓
Совместное открытие яйца
        ↓
Получение питомца
        ↓
Уход
        ↓
XP / уровни
        ↓
Coins
        ↓
Одежда / комната / косметика
        ↓
Кейсы / яйца
        ↓
Коллекционирование
        ↓
Маркет
        ↓
Новые предметы / питомцы
        ↓
Продолжение развития
```

---

# 4. Telegram Mini App

Авторизация выполняется через Telegram Mini App `initData`.

Backend обязан самостоятельно валидировать Telegram init data.

Telegram ID является основным идентификатором пользователя.

Нельзя доверять Telegram ID, балансу, роли или другим критическим данным, пришедшим от клиента без серверной проверки.

---

# 5. Партнерская система

## 5.1 Приглашение

Игрок создает приглашение партнеру через Telegram deep link:

```text
https://t.me/YOUR_BOT?startapp=invite_<TOKEN>
```

`TOKEN` должен быть безопасным, а при необходимости одноразовым или ограниченным по времени.

## 5.2 Экран приглашения

```text
<Имя игрока> приглашает тебя
завести общего питомца

🥚

[ ПРИНЯТЬ ]
[ ОТКЛОНИТЬ ]
```

## 5.3 Partnership

После принятия создается:

```text
partnership
- user_a
- user_b
- status
- created_at
```

После создания пары она может открыть первое яйцо.

---

# 6. Совместное открытие яйца

Первое яйцо должно открываться двумя игроками.

Сценарий:

1. Игрок A нажимает открыть.
2. Показывается `1/2`.
3. Игрок B нажимает открыть.
4. Показывается `2/2`.
5. Начинается анимация.
6. Яйцо трясется.
7. Появляются трещины.
8. Яйцо открывается.
9. Появляется питомец.

Пример:

```text
🥚

DIPLOMAT ✓
PARTNER  ✓

2 / 2
```

Результат открытия определяет backend, а не frontend.

---

# 7. Виды питомцев

На старте можно сделать:

- кошку;
- собаку;
- обезьяну;
- крокодила;
- кролика;
- лису;
- панду;
- лягушку;
- медведя;
- пингвина.

Архитектура должна позволять добавлять новые виды без переписывания игровой логики.

Основная сущность:

```text
PetSpecies
```

Примеры:

```text
Cat
Dog
Monkey
Crocodile
Rabbit
Fox
Panda
Frog
Bear
Penguin
```

---

# 8. Редкости

Основная система:

```text
Common
Uncommon
Rare
Epic
Legendary
Mythic
Secret
```

Русские названия:

```text
Обычный
Необычный
Редкий
Эпический
Легендарный
Мифический
Секретный
```

Редкость не должна напрямую определять игровую силу.

Редкие предметы ценнее благодаря:
- внешнему виду;
- ограниченности;
- коллекционной ценности;
- уникальным эффектам;
- уникальным анимациям;
- спросу на маркете.

Игра не должна становиться pay-to-win.

---

# 9. Species и Rarity — разные параметры

Нельзя хранить питомца только как `Legendary Cat`.

Нужно разделять:

```text
species
rarity
variant
color
pattern
eyes
level
equipment
```

Пример:

```text
Species: Cat
Rarity: Epic
Variant: Galaxy
Color: Purple
Pattern: Stars
```

---

# 10. Варианты питомцев

Пример для кошки:

```text
Обычная кошка
Черная кошка
Рыжая кошка
Сиамская кошка
Кибер-кот
Галактический кот
Призрачный кот
```

Для обезьяны:

```text
Обычная обезьяна
Шимпанзе
Джунглевая обезьяна
Золотая обезьяна
Кибер-обезьяна
Космическая обезьяна
```

Для крокодила:

```text
Обычный зеленый крокодил
Золотой крокодил
Космический крокодил
```

---

# 11. Яйца

Яйцо является контейнером с loot pool.

Первое яйцо может быть бесплатным.

Пример Basic Egg:

```text
Common       65%
Uncommon     25%
Rare          8%
Epic          2%
```

Premium Egg:

```text
Uncommon     45%
Rare         35%
Epic         15%
Legendary     4%
Mythic        1%
```

Mythic Egg:

```text
Rare         45%
Epic         35%
Legendary    15%
Mythic        5%
```

Это примеры. Реальные значения должны балансироваться.

Drop rates должны храниться на сервере и быть конфигурируемыми.

---

# 12. Кейсы

Помимо яиц должна существовать система кейсов.

Кейс может содержать:
- питомца;
- одежду;
- шапку;
- аксессуар;
- мебель;
- скин;
- эффект;
- Coins;
- другие косметические предметы.

Пример:

```text
🎁 CASE

Possible drops:

🐾 Pet
👕 Clothes
🧢 Hat
👓 Accessory
🏠 Furniture
🎨 Skin
✨ Effect
🪙 Coins
```

---

# 13. Тематические кейсы

## Forest Case

```text
Forest Rabbit
Forest Fox
Forest Bear
Jungle Monkey
```

## Galaxy Case

```text
Galaxy Cat
Space Dog
Cosmic Crocodile
Astronaut Monkey
```

## Halloween Case

```text
Ghost Cat
Pumpkin Dog
Vampire Bat
Skeleton Crocodile
```

## Christmas Case

```text
Santa Dog
Reindeer
Snow Cat
Gift Monkey
```

Система должна позволять добавлять сезонные кейсы без изменения основной логики.

---

# 14. Редкость всех предметов

Единая система rarity применяется к:
- питомцам;
- одежде;
- мебели;
- аксессуарам;
- скинам;
- эффектам;
- декоративным предметам.

Примеры:

```text
Mythic Jacket
Legendary Sofa
Secret Aura
Epic Cat
```

---

# 15. 3D-питомцы

Питомцев рекомендуется делать 3D.

Стек:

```text
Three.js
GLB / glTF
```

Не делать каждого питомца одной готовой картинкой.

Питомец должен быть собран из:
- базовой модели;
- материалов;
- косметических элементов;
- одежды;
- аксессуаров;
- эффектов.

---

# 16. Система слоев питомца

```text
PET
├── body
├── eyes
├── mouth
├── ears
├── hair
├── face_accessory
├── shirt
├── pants
├── shoes
├── hat
├── back_accessory
├── neck_accessory
├── hand_accessory
└── effect
```

---

# 17. Слоты одежды

Минимальные категории:

```text
Head
Face
Hair
Top
Bottom
Shoes
Back
Neck
Hand
Effect
```

UI:

```text
👕 Верх
👖 Низ
👟 Обувь
🧢 Головной убор
👓 Лицо
🎒 Спина
💎 Аксессуар
✨ Эффект
```

---

# 18. Требования к 3D-одежде

Все части одежды должны использовать совместимый персонажный rig/skeleton.

Нужно обеспечить:
- единый skeleton;
- корректные bind weights;
- одинаковый масштаб;
- корректную UV-развертку;
- отсутствие сильного clipping;
- возможность замены одежды без изменения тела.

Pipeline:

```text
Concept
↓
3D Model
↓
Retopology
↓
UV
↓
Texture
↓
Rig
↓
Clothing fitting
↓
GLB
↓
Three.js
```

Инструменты:
- Blender;
- Substance 3D Painter;
- Three.js.

AI можно использовать для концептов, но финальные игровые модели нужно привести к единому стилю.

---

# 19. Стиль питомцев

Рекомендуемый стиль:

**cute stylized 3D**

Характеристики:
- большая голова;
- небольшое тело;
- выразительные глаза;
- мягкие формы;
- умеренное количество деталей;
- качественные материалы;
- мягкий свет;
- единый художественный стиль.

Не смешивать случайно реализм, low-poly и anime.

---

# 20. Покраска

Питомец должен поддерживать:
- цвет тела;
- pattern;
- markings;
- glow.

Редкие варианты:

```text
Lava
Ice
Galaxy
Rainbow
Ghost
Toxic
```

Предпочтительно использовать материалы и маски, а не отдельную модель под каждый цвет.

---

# 21. Статы

Основные характеристики:

```text
❤️ Health
⚡ Energy
🍖 Hunger
💧 Thirst
😊 Mood
🧼 Cleanliness
```

Не добавлять десятки шкал без необходимости.

---

# 22. Действия

## Feed

```text
Hunger +25
Mood +5
```

## Drink

```text
Thirst +30
```

## Play

```text
Mood +20
Energy -10
```

## Sleep

```text
Energy +40
```

## Bath

```text
Cleanliness +40
Mood +10
```

Значения являются примером и балансируются.

---

# 23. Stat decay

Статы постепенно изменяются со временем:

```text
Hunger ↓
Thirst ↓
Energy ↓
Cleanliness ↓
```

Расчет должен выполняться сервером.

Не обновлять каждую секунду отдельной записью в PostgreSQL.

Предпочтительно использовать time-based/lazy calculation:

```text
current_value =
previous_value + elapsed_time * rate
```

---

# 24. Эмоции

Состояния:

```text
Idle
Happy
Sad
Hungry
Tired
Excited
Dirty
Playing
Sleeping
Celebrating
```

Примеры:

При входе:

```text
🐶
*бежит навстречу*
```

После долгого отсутствия:

```text
🐶
*грустный*
```

После подарка:

```text
🐶
*крутится*
✨
```

Сложный AI не нужен. Достаточно state machine + анимаций.

---

# 25. Отношения с каждым владельцем

Питомец должен иметь отдельную статистику взаимодействия с каждым владельцем.

Например:

```text
Pet: Max

DIPLOMAT
Friendship: 87

PARTNER
Friendship: 72
```

---

# 26. История действий

Журнал:

```text
TODAY

09:21 DIPLOMAT 🍖 покормил
11:48 PARTNER  🎾 поиграл
14:10 DIPLOMAT 💧 напоил
19:32 PARTNER  🛁 искупал
```

---

# 27. Совместные задания

Пример:

```text
❤️ Позаботьтесь о питомце вместе

☑ Покормить — 2/2
☑ Поиграть — 1/2
☐ Искупать — 0/1
☐ Поспать — 0/1

Награда:
+250 Coins
+50 XP
```

Задания могут требовать действия обоих:

```text
Первый игрок: ✓
Второй игрок: ✓
```

---

# 28. XP и уровни

```text
PET LVL 17

████████████░░░

1240 / 1500 XP
```

XP получают за:
- уход;
- задания;
- совместные действия;
- события;
- достижения.

Пример наград:

```text
Lv. 5  новая эмоция
Lv. 10 новый слот комнаты
Lv. 15 новый цвет
Lv. 20 новая анимация
Lv. 30 особый предмет
```

---

# 29. Стадии развития

Можно использовать:

```text
🥚 Egg
↓
🐣 Baby
↓
Young
↓
Adult
↓
✨ Mature
```

Развитие может зависеть от:
- времени;
- XP;
- ухода;
- уровня.

---

# 30. Скрытая личность

Можно хранить:

```text
play_score
food_score
care_score
social_score
style_score
```

Примеры:

```text
много игр → Playful
много еды → Chubby
много тренировок → Athletic
много украшений → Stylish
много сна → Lazy
```

Две пары могут получить одинаковый вид питомца, но через месяц иметь разных по характеру питомцев.

---

# 31. Coins

Основная игровая валюта:

```text
🪙 Coins
```

Получение:
- уход;
- daily quests;
- mini-games;
- achievements;
- events;
- rewards.

Использование:
- одежда;
- мебель;
- цвета;
- игрушки;
- декор;
- эффекты;
- обычные кейсы/яйца;
- marketplace.

---

# 32. Telegram Stars

Premium currency:

```text
⭐ Stars
```

Использование:
- premium eggs;
- premium cases;
- второй слот питомца;
- дополнительные слоты;
- эксклюзивная косметика;
- сезонные предметы;
- специальные эффекты.

TON/крипту добавлять позже.

---

# 33. Комната

У пары есть общая комната.

```text
┌─────────────────────┐
│       🖼️     🪴     │
│                     │
│   🛋️       🐶       │
│                     │
│        🛏️           │
│                     │
│   🪑          🎮    │
└─────────────────────┘
```

---

# 34. Мебель и декор

Мебель:
- кровать;
- диван;
- стол;
- телевизор;
- компьютер;
- холодильник;
- ванна;
- шкаф.

Декор:
- картины;
- растения;
- ковры;
- лампы;
- игрушки;
- плакаты;
- статуи.

---

# 35. Темы комнат

```text
Basic Room
Halloween Room
Christmas Room
Tropical Room
Space Room
Fantasy Room
```

---

# 36. Несколько питомцев

У пары/пользователя может быть несколько питомцев:

```text
PET SLOTS

[ 🐶 Max ] ACTIVE
[ 🐱 Luna ]
[ + ADD PET ]
```

Первый слот бесплатный.

Дополнительные слоты можно продавать за Stars.

---

# 37. Замена питомца

Старого питомца не удалять.

Правильная модель:

```text
🐶 Max
Lv. 24
Archived

🐱 Luna
Lv. 1
ACTIVE
```

Питомец сохраняет:
- уровень;
- достижения;
- коллекцию;
- внешний вид;
- историю.

Если требуется отдельный баланс для каждого питомца, использовать `PetWallet`.

Пример:

```text
Pet A
Coins: 10000

Pet B
Coins: 0
```

При переключении активного питомца используется его PetWallet.

---

# 38. Дополнительные слоты

Пример:

```text
1-й слот: FREE
2-й слот: 500 Stars
3-й слот: 1000 Stars
```

Цены являются примером и должны балансироваться.

---

# 39. Коллекция

```text
COLLECTION

🐱 Cats
6 / 20

🐶 Dogs
3 / 18

🐵 Monkeys
8 / 15

🐊 Crocodiles
2 / 12

TOTAL
19 / 65
```

Показывать:
- полученных;
- недостающих;
- rarity;
- variants;
- progress.

---

# 40. Коллекционные сеты

Пример:

```text
🌌 SPACE COLLECTION

🐱 Space Cat       ✓
🐶 Space Dog       ✓
🐵 Space Monkey    ✓
🐊 Space Crocodile ✗
```

За полный сет:

```text
✨ COLLECTION COMPLETE

Reward:
🌌 Space Room
+5000 Coins
Exclusive badge
```

---

# 41. Marketplace

Игрок может продавать конкретный предмет другой паре/игроку.

Пример:

```text
🐊 MYTHIC CROCODILE

Lv. 1

Seller:
@username

💰 15 000 Coins

[ BUY ]
```

Flow:

```text
seller inventory
        ↓
market listing
        ↓
buyer
        ↓
buyer inventory
```

---

# 42. Комиссия

Пример:

```text
Цена: 10 000 Coins
Комиссия: 5%

Продавец получает:
9 500 Coins
```

Комиссия рассчитывается backend.

---

# 43. Уникальные Item Instances

Каждый предмет должен иметь:

```text
item_instance_id
```

Например:

```text
8f31e8b2-...
```

Нужно различать:

```text
Mythic Crocodile #1842
Mythic Crocodile #7281
```

Это дает:
- историю владельцев;
- историю продаж;
- серийные номера;
- редкие экземпляры;
- коллекционность.

---

# 44. История маркета

Для дорогих предметов:

```text
MYTHIC CROCODILE

Current: 15 400 Coins
Average: 14 850 Coins
Lowest: 12 000 Coins
Last sale: 15 000 Coins
```

В будущем можно добавить график цен.

---

# 45. Фильтры маркета

```text
MARKET

[ Питомцы ] [ Одежда ] [ Мебель ] [ Другое ]
```

Rarity:

```text
☐ Common
☐ Uncommon
☐ Rare
☐ Epic
☐ Legendary
☐ Mythic
☐ Secret
```

Species:

```text
☐ Cat
☐ Dog
☐ Monkey
☐ Crocodile
...
```

Sort:

```text
Цена ↑
Цена ↓
Редкость
Новизна
```

---

# 46. Premium Marketplace

В будущем:

```text
🌈 SECRET HAT

⭐ 750

[ BUY ]
```

Платежную систему реализовывать только согласно актуальным возможностям и правилам Telegram.

На первом этапе marketplace можно ограничить Coins.

---

# 47. Публичные профили

Профиль:

```text
🐶 Max

Lv. 27

❤️ 98%
⚡ 72%
🍖 83%

🏆 32 achievements

🏠 Room

[ Посмотреть комнату ]
```

Можно дать другим игрокам возможность смотреть профиль и комнату согласно privacy settings.

---

# 48. Лидерборды

Отдельные категории:

```text
🏆 Pet Level
🏆 Couple Level
🏆 Collection
🏆 Room
🏆 Care
🏆 Market
```

Также:

```text
DUO RATING

YOU + PARTNER

Level 42
14 820 XP
```

---

# 49. Достижения

Примеры:

```text
🏆 First Egg
Откройте первое яйцо

❤️ Perfect Care
7 дней без критических статов

🤝 Together
100 совместных действий

💎 Collector
50 предметов

🏠 Interior Designer
10 предметов комнаты

🐣 Parent
Вырасти питомца до Lv.20
```

---

# 50. Главный UI

Рекомендуемая нижняя навигация:

```text
┌─────────────────────────────┐
│          ⭐ 12 450           │
│                             │
│             🐶              │
│                             │
│         PET AREA            │
│                             │
│ ❤️ 94  ⚡ 72  🍖 81         │
│                             │
│ [ 🍖 ] [ 🎾 ] [ 🛁 ] [ 😴 ] │
│                             │
├─────────────────────────────┤
│ 🏠    🐶    🎒    🛍️    🏆 │
│ Дом   Питомец Инв. Магазин Рейтинг│
└─────────────────────────────┘
```

Главный экран не должен быть перегружен.

Питомец — центральный объект.

---

# 51. Экран питомца

```text
            🐶

        PET LVL 17

❤️ ████████████
⚡ ███████░░░░░
🍖 █████████░░
💧 ████████░░░
😊 ██████████░
```

Быстрые действия:

```text
🍖 Feed
💧 Drink
🎾 Play
🛁 Bath
😴 Sleep
```

---

# 52. Анимации

Нужны:

```text
Idle
Walk
Run
Happy
Sad
Hungry
Tired
Eat
Drink
Play
Sleep
Bath
Celebrate
OpenEgg
```

Для MVP достаточно:

```text
Idle
Happy
Eat
Play
Sleep
Sad
```

---

# 53. Технический стек

## Frontend

```text
React
TypeScript
Vite
```

## 3D

```text
Three.js
GLB / glTF
```

## Backend

```text
Node.js
TypeScript
NestJS
```

## API

```text
REST
```

## Realtime

```text
WebSocket
```

## Database

```text
PostgreSQL
```

## Cache / locks

```text
Redis
```

## Background jobs

```text
BullMQ
```

## Assets

```text
S3-compatible storage
```

## CDN

```text
Cloudflare
```

## Deployment

```text
Docker
```

## Reverse proxy

```text
Caddy / Nginx
```

## 3D production

```text
Blender
Substance 3D Painter
```

## Payments

```text
Telegram Stars
```

TON — позже.

---

# 54. Архитектура

```text
                         TELEGRAM
                             │
                             ▼
                     Telegram Mini App
                             │
                     React + TypeScript
                             │
              ┌──────────────┴──────────────┐
              │                             │
             REST                        WebSocket
              │                             │
              └──────────────┬──────────────┘
                             ▼
                     NestJS Backend
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
       PostgreSQL          Redis          Workers
            │                │                │
            │                │         ┌──────┼──────┐
            │                │         │      │      │
            │                │       stats quests leaderboard
            │
            ▼
         Game Data
```

Assets:

```text
Three.js
   ↓
CDN
   ↓
S3-compatible storage
```

---

# 55. Backend-модули

```text
src/
├── auth/
├── users/
├── partnerships/
├── pets/
├── pet-stats/
├── pet-species/
├── eggs/
├── cases/
├── items/
├── inventory/
├── equipment/
├── customization/
├── rooms/
├── room-items/
├── quests/
├── achievements/
├── leaderboards/
├── marketplace/
├── payments/
├── notifications/
├── websocket/
├── economy/
└── common/
```

---

# 56. Frontend

```text
frontend/
└── src/
    ├── app/
    ├── pages/
    │   ├── Home/
    │   ├── Pet/
    │   ├── Room/
    │   ├── Inventory/
    │   ├── Shop/
    │   ├── Market/
    │   ├── Rating/
    │   ├── Collection/
    │   └── Profile/
    │
    ├── components/
    ├── three/
    │   ├── PetRenderer.ts
    │   ├── Equipment.ts
    │   ├── RoomRenderer.ts
    │   └── AnimationController.ts
    │
    ├── api/
    ├── store/
    ├── hooks/
    ├── types/
    └── utils/
```

---

# 57. Database

Основные сущности:

```text
users
partnerships
pets
pet_stats
pet_species
pet_variants
pet_equipment
pet_customizations

items
item_instances
item_categories
item_rarities

inventory
inventory_items

eggs
egg_types
egg_drop_tables

cases
case_types
case_drop_tables

rooms
room_items
room_themes

quests
user_quests

achievements
user_achievements

market_listings
market_transactions

wallets
currency_transactions
payments

leaderboards
pet_actions
pet_action_history

notifications
```

---

# 58. Item Definition и Item Instance

## Item Definition

Описание типа предмета:

```text
id
name
category
rarity
asset_url
metadata
```

## Item Instance

Конкретный предмет:

```text
instance_id
item_definition_id
owner_id
created_at
acquired_from
```

---

# 59. Pet и PetStats

Pet:

```text
id
partnership_id
species_id
rarity
variant_id
level
xp
created_at
active
```

PetStats:

```text
pet_id
health
energy
hunger
thirst
mood
cleanliness
updated_at
```

PetCustomization:

```text
pet_id
body_color
pattern
eyes
hair
...
```

---

# 60. Сервер — источник истины

Backend определяет:
- баланс;
- XP;
- level;
- drop result;
- ownership;
- rarity;
- marketplace price;
- payment status;
- доступность действий;
- cooldowns.

Frontend только отправляет намерение.

Пример:

```text
/feed
/open-case
/buy-item
/sell-item
```

---

# 61. Идемпотентность

Критические операции должны поддерживать idempotency:

- покупки;
- открытия кейса;
- открытия яйца;
- marketplace;
- платежи;
- переводы предметов.

Пример:

```text
POST /cases/open
Idempotency-Key: UUID
```

Повторная отправка не должна выдавать второй reward.

---

# 62. Race conditions

Особенно важны при совместных действиях.

Если два игрока одновременно нажали Feed:

```text
feed
feed
```

backend должен корректно обработать обе операции.

Использовать:
- PostgreSQL transactions;
- row-level locks;
- Redis locks при необходимости.

---

# 63. WebSocket

Пример:

Игрок A:

```text
POST /pets/{id}/feed
```

Backend изменяет состояние.

Отправляет игроку B:

```text
PET_UPDATED
```

Игрок B сразу видит новое состояние.

---

# 64. Background workers

Workers:

```text
stat decay
daily quests
scheduled rewards
notifications
leaderboard updates
market cleanup
expired listings
season events
```

Не записывать каждую секунду состояние всех питомцев в БД.

---

# 65. Object Storage

Не хранить GLB и текстуры в PostgreSQL.

Пример:

```text
/assets
    /pets
    /clothes
    /hats
    /accessories
    /rooms
    /effects
    /icons
```

CDN:

```text
https://cdn.example.com/pets/cat/body.glb
```

---

# 66. Безопасность

Обязательно:
- валидировать Telegram init data;
- проверять ownership;
- не доверять client-side balance;
- не доверять client-side rarity;
- не доверять client-side loot;
- не доверять client-side payment status;
- rate limiting;
- WebSocket authorization;
- transactions;
- audit logs;
- idempotency.

---

# 67. Audit logs

Для экономических операций сохранять:

```text
user_id
type
amount
currency
reason
reference_id
created_at
```

Пример:

```text
+500 Coins
reason = daily_quest
```

или:

```text
-15000 Coins
reason = marketplace_purchase
reference_id = transaction_id
```

---

# 68. Marketplace flow

Продажа:

```text
POST /market/list
```

Backend:
1. проверяет ownership;
2. проверяет, что предмет не экипирован;
3. проверяет, что предмет не заблокирован;
4. создает listing;
5. резервирует item instance.

Покупка:

```text
POST /market/{listingId}/buy
```

Backend:
1. transaction;
2. блокировка listing;
3. проверка баланса;
4. списание Coins;
5. перевод item;
6. начисление продавцу минус комиссия;
7. закрытие listing;
8. commit.

---

# 69. Что нельзя делать

Не делать:
- экономику только на frontend;
- random drop на клиенте;
- баланс на клиенте как источник истины;
- SQLite для production economy;
- бесконтрольное удаление питомцев;
- hardcode всех питомцев в React;
- отдельную 3D-модель под каждый цвет;
- отдельную модель одежды без общего rig;
- микросервисы на старте;
- TON в MVP;
- десятки статов;
- pay-to-win progression.

---

# 70. MVP 0.1

```text
Telegram Auth
↓
Invite Partner
↓
Accept Partner
↓
Partnership
↓
Egg
↓
Joint Egg Opening
↓
Pet
↓
Pet Stats
↓
Feed
↓
Drink
↓
Play
↓
Sleep
↓
Coins
```

---

# 71. MVP 0.2

```text
Inventory
Clothes
Pet Customization
Colors
Accessories
```

Добавить:
- 2–3 вида питомцев;
- несколько редкостей;
- базовую 3D-модель;
- 5–10 предметов одежды.

---

# 72. MVP 0.3

```text
Room
Furniture
Decor
Room Themes
```

---

# 73. MVP 0.4

```text
Quests
Achievements
XP
Levels
Leaderboard
Collection
```

---

# 74. MVP 0.5

```text
Cases
Egg Types
Rare Pets
Telegram Stars
Additional Pet Slot
Premium Items
```

---

# 75. MVP 0.6

```text
Marketplace
P2P Trading
Market History
Market Fees
```

Сначала только Coins.

После проверки экономики можно расширять premium marketplace.

---

# 76. Version 1.0

```text
Events
Seasons
Social Profiles
Public Rooms
Collections
Advanced Customization
Multiple Pets
Market
Premium Eggs
Premium Cases
Notifications
```

---

# 77. Порядок разработки

## Phase 1 — Foundation
- repository;
- frontend;
- backend;
- PostgreSQL;
- Redis;
- Docker;
- environment configuration;
- Telegram authentication.

## Phase 2 — Users
- users;
- profiles;
- Telegram ID;
- sessions.

## Phase 3 — Partnership
- invitations;
- deep links;
- accept;
- reject;
- active partnership.

## Phase 4 — Pets
- species;
- rarity;
- pet;
- stats;
- XP;
- levels.

## Phase 5 — Actions
- feed;
- drink;
- play;
- bath;
- sleep;
- action history.

## Phase 6 — Realtime
- WebSocket;
- partner updates;
- live pet changes.

## Phase 7 — 3D
- Three.js;
- base model;
- GLB;
- animations;
- camera;
- renderer.

## Phase 8 — Customization
- clothing;
- accessories;
- colors;
- patterns;
- inventory.

## Phase 9 — Room
- room;
- furniture;
- decor;
- themes.

## Phase 10 — Economy
- Coins;
- transactions;
- rewards;
- quests.

## Phase 11 — Eggs/Cases
- drop tables;
- rarity;
- animations;
- rewards.

## Phase 12 — Collection
- collection;
- sets;
- achievements.

## Phase 13 — Leaderboards
- pet level;
- collection;
- care;
- room;
- duo.

## Phase 14 — Payments
- Telegram Stars;
- premium eggs;
- additional slots.

## Phase 15 — Marketplace
- listings;
- purchases;
- transfers;
- commission;
- history.

## Phase 16 — Events
- seasonal cases;
- seasonal items;
- temporary quests;
- limited collections.

---

# 78. UI/UX

Принципы:
- mobile-first;
- Telegram Mini App;
- плавные transitions;
- минимальный UI;
- питомец — главный объект;
- темные/мягкие цвета;
- понятная иерархия;
- большие touch targets;
- быстрые действия;
- не перегружать экран.

Главный экран:
1. питомец;
2. состояние;
3. быстрые действия;
4. валюта;
5. navigation.

---

# 79. Баланс

Главный принцип:

> Редкость = коллекционная ценность, а не сила.

Common должен оставаться полноценным питомцем.

Legendary/Mythic/Secret могут иметь:
- уникальный внешний вид;
- эффекты;
- анимации;
- престиж;
- коллекционную ценность.

Не давать огромного преимущества в уходе или заработке.

---

# 80. Account / Pet / Partnership разделение

## Account-level

```text
Telegram ID
Stars
Account achievements
Collection
Account inventory
Premium purchases
```

## Pet-level

```text
XP
Level
Stats
Coins
Equipment
Pet progression
```

## Partnership-level

```text
Shared room
Shared quests
Shared pet relationship
Duo progress
```

Это важное архитектурное разделение.

---

# 81. Основные сущности

Минимальный production-набор:

```text
User
Partnership
Pet
PetSpecies
PetStats
PetAction
ItemDefinition
ItemInstance
Inventory
EggType
EggDrop
Quest
UserQuest
Achievement
UserAchievement
Room
RoomItem
MarketListing
MarketTransaction
CurrencyTransaction
Payment
LeaderboardEntry
```

---

# 82. Контент должен быть data-driven

Питомцы, предметы, кейсы, quests и события должны быть данными, а не hardcoded frontend-логикой.

Например:

```text
PetSpecies
ItemDefinition
CaseDefinition
CaseDrop
RoomTheme
QuestDefinition
AchievementDefinition
```

Добавление нового питомца должно по возможности сводиться к:
1. добавить PetSpecies;
2. добавить assets;
3. добавить variants;
4. добавить drop table entries.

Не должно требоваться переписывать десятки `if`.

---

# 83. Admin Panel в будущем

Нужен будущий admin panel:

```text
Pets
Items
Cases
Eggs
Drop Tables
Quests
Achievements
Events
Users
Partnerships
Market
Transactions
Payments
Reports
```

Администратор сможет:
- добавлять питомцев;
- добавлять предметы;
- создавать кейсы;
- менять drop rates;
- создавать quests;
- запускать события;
- менять цены;
- отключать предметы;
- просматривать экономические транзакции.

---

# 84. Производительность

Не загружать все 3D assets сразу.

Использовать:
- lazy loading;
- compressed GLB;
- Draco/Meshopt при необходимости;
- texture compression;
- CDN;
- caching;
- selective preloading.

Сначала загрузить базового питомца, затем догружать дополнительные assets.

---

# 85. Масштабирование

На старте:

```text
1 NestJS instance
1 PostgreSQL
1 Redis
1 Worker
S3/CDN
```

Не делать микросервисы заранее.

При росте отдельно масштабировать:

```text
API
WebSocket
Workers
Marketplace
Notifications
Payments
```

---

# 86. Мониторинг

Production должен иметь:
- structured logs;
- error tracking;
- DB monitoring;
- Redis monitoring;
- API latency;
- WebSocket connections;
- failed payments;
- failed transactions;
- suspicious marketplace activity.

---

# 87. Антифрод

Отслеживать:
- слишком быстрые действия;
- повторные requests;
- повторную покупку listing;
- продажу чужого предмета;
- подделанные client payload;
- необычные начисления Coins.

---

# 88. Definition of Done

Функция считается готовой, если:
- backend реализован;
- frontend подключен;
- БД поддерживает функцию;
- validation реализована;
- authorization реализована;
- error handling есть;
- критические операции транзакционны;
- функция протестирована;
- нет очевидных console errors;
- нет очевидных server errors;
- старые функции продолжают работать.

---

# 89. Правило работы AI-агента

AI-агент не должен писать всю игру одним огромным коммитом.

Для каждого этапа:

```text
1. READ
2. UNDERSTAND
3. PLAN
4. CHANGE
5. MIGRATE
6. TEST
7. FIX
8. REPORT
```

Перед изменением существующей системы:

```text
READ
↓
UNDERSTAND
↓
PLAN
↓
CHANGE
↓
TEST
```

Нельзя:

```text
GUESS
↓
REWRITE EVERYTHING
```

После каждого этапа агент должен сообщить:
- что реализовано;
- какие файлы изменены;
- какие migrations добавлены;
- какие endpoints появились;
- какие тесты/проверки выполнены;
- какие проблемы остались.

---

# 90. Финальная продуктовая структура

```text
                         DUO PET
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
       PARTNERS            PET              ECONOMY
          │                 │                 │
       Invite            Species            Coins
       Accept            Rarity             Stars
       Duo               Variants           Cases
       Actions           Stats              Eggs
       Quests            Level              Shop
          │              XP                 Market
          │              Evolution
          │                 │
          │          ┌──────┼───────┐
          │          │      │       │
          │       Clothes Colors  Effects
          │
          └──────────────┐
                         │
                       ROOM
                         │
                Furniture / Decor
                         │
                         ▼
                    COLLECTION
                         │
                ┌────────┼────────┐
                ▼        ▼        ▼
             Sets    Achievements Rankings
```

---

# 91. Финальный первый релиз

Первый реально работающий релиз должен содержать:

```text
✓ Telegram authentication
✓ User
✓ Partner invite
✓ Partnership
✓ Shared pet
✓ 3 pet species
✓ 3–4 rarities
✓ Egg opening
✓ Pet stats
✓ Feed
✓ Drink
✓ Play
✓ Sleep
✓ XP
✓ Levels
✓ Coins
✓ Basic inventory
✓ Basic clothing
✓ Basic 3D customization
✓ Basic room
```

После проверки этого релиза добавлять:

```text
Cases
Collections
Marketplace
Stars
Additional pets
Events
Leaderboards
```

---

# 92. Краткое задание для агента

Разработай Telegram Mini App **Duo Pet** — социальную игру для двух партнеров.

Пользователь приглашает другого человека через Telegram deep link. После принятия они совместно открывают яйцо и получают общего 3D-питомца.

Есть виды:
- Cat;
- Dog;
- Monkey;
- Crocodile;
- Rabbit;
- Fox;
- Panda;
- Frog;
- Bear;
- Penguin;
- и будущие виды.

У каждого питомца:
- species;
- rarity;
- variant;
- color;
- pattern;
- stats;
- level;
- XP;
- equipment;
- customization;
- personality.

Редкости:

```text
Common
Uncommon
Rare
Epic
Legendary
Mythic
Secret
```

Пара вместе:
- кормит;
- поит;
- играет;
- купает;
- укладывает спать;
- выполняет quests;
- получает XP;
- получает Coins;
- украшает комнату;
- меняет одежду;
- собирает коллекцию.

3D:
- React + TypeScript + Vite;
- Three.js;
- GLB/glTF;
- общий rig;
- сменные clothes/accessories;
- colors/patterns/effects.

Есть:
- яйца;
- кейсы;
- loot tables;
- тематические коллекции;
- редкие питомцы;
- одежда;
- мебель;
- эффекты;
- achievements;
- leaderboards;
- marketplace.

Marketplace позволяет продавать конкретные item instances другим игрокам/парам.

Каждый item instance имеет уникальный ID.

Основной стек:

```text
Frontend: React + TypeScript + Vite
3D: Three.js
Backend: NestJS + TypeScript
DB: PostgreSQL
Cache/locks: Redis
Jobs: BullMQ
Realtime: WebSocket
Assets: S3-compatible storage
CDN: Cloudflare
Deploy: Docker
Payments: Telegram Stars
Future crypto: TON
```

Главный принцип:

> Два человека вместе растят одного питомца.

Не превращать проект просто в кейсы или маркет. Все системы должны усиливать совместную жизнь пары вокруг питомца.

Разрабатывать по этапам:

```text
Foundation
→ Auth
→ Users
→ Partnership
→ Pets
→ Stats
→ Actions
→ WebSocket
→ 3D
→ Customization
→ Room
→ Economy
→ Eggs/Cases
→ Collection
→ Leaderboards
→ Payments
→ Marketplace
→ Events
```

Никогда не доверять frontend критическим данным.

Критические операции должны быть серверными, транзакционными и идемпотентными.

Не удалять старых питомцев при создании новых. Использовать pet slots и PetWallet.

Не делать pay-to-win.

Не делать микросервисы на старте.

Не переписывать рабочий код без необходимости.

Разрабатывать, тестировать и проверять каждую фазу отдельно.
