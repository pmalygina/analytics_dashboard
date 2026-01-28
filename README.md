# Analytics Dashboard

Панель аналитики на Nuxt 3 с использованием данных World Bank (например, GDP по странам и годам).

Ссылка на приложение - https://analytics-dashboard-b21p2mto4-polinas-projects-1485be12.vercel.app/

## Функциональность

- Загрузка данных из World Bank API
- Фильтрация по странам и диапазону лет
- Pivot-таблица (годы в строках, страны в столбцах)
- Графики (Line/Bar) для сравнения показателей по странам
- Сохранение выбранных фильтров между сессиями
- Экспорт данных в CSV для дальнейшего анализа

## Технологии

- Nuxt 3, Vue 3 (Composition API), TypeScript
- TanStack Query (Vue Query)
- Apache ECharts
- Vuetify 3
- Архитектура Feature-Sliced Design (FSD)
