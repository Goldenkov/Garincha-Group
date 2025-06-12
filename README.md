# Garincha-Group

**GarinchaGroup.ru** — интернет-магазин техники и аксессуаров, который мы разворачиваем как полноценную e-commerce-платформу **+ мобильное приложение** для iOS / Android.
Проект ставит цель объединить веб-витрину, складской учёт, платёжный шлюз и push-маркетинг в одном репозитории.

## Цели проекта

| Задача | Статус |
|--------|--------|
| 🛒 **Web-shop** (Next.js + Django API) | ⚙️ MVP |
| 📱 **Mobile app** (React Native / Flutter) | 🔜 |
| 💳 **Payments & 3-D Secure** | 🔜 |
| 🚚 Интеграция со службами доставки (СДЭК / Boxberry) | 🔜 |
| 🩺 CI/CD (GitHub Actions → Render / Fly.io) | 🔜 |

## Ключевые функции

- Каталог с фильтрами, отзывами и динамическими ценами.
- Авторизация через Google / Apple / VK.
- Поддержка Apple Pay, Google Pay, банковских карт (Stripe / YooKassa).
- Мобильное приложение с офлайн-корзиной и push-уведомлениями (React Native, планируется Flutter-порт).
- Админ-панель: управление товарами, заказами, скидками, push-кампаниями.

## Стек технологий

| Слой | Технологии |
|------|------------|
| **Frontend (web)** | Next.js 14, TypeScript, TailwindCSS |
| **Mobile** | React Native + Expo / EAS → iOS & Android |
| **Backend** | Django 4 + Django REST Framework |
| **DB** | PostgreSQL 15 |
| **DevOps** | Docker Compose, GitHub Actions, Fly.io (prod), Render (preview) |

> **Почему React Native?**
> 1. Единая кодовая база для iOS + Android.
> 2. Горячая перезагрузка, OTA-обновления через Expo.
> 3. Готовое окружение для подключения нативных SDK (оплата, камеры, push-уведомления).

---

*Далее в README уже идёт ранее добавленный раздел **Usage** (запуск через Docker / Compose). Если потребуется, Codex может переместить или переформатировать блоки под вашу структуру.*
> …
