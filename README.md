# Impekable Calendar Clone

Pixel‑perfect clone of the **Impekable Calendar** UI built with **Vue 3** and **FullCalendar**.  
Supports creating, editing, deleting and dragging events in Month / Week / Day / Agenda views.

> 📷 Screenshot placeholder – paste image here  
> 🎞 GIF placeholder – paste interaction demo here

## Features

- **Views**: Month (`dayGridMonth`), Week (`timeGridWeek`), Day (`timeGridDay`), Agenda (`listWeek`).
- **Time grid**: 2‑hour slots, full 24‑hour range, single unified height across all views.
- **Events**:
  - Create via click on an empty slot/day.
  - Edit via click on existing event.
  - Delete from the edit popover (`Discard`).
  - Drag & drop and resize with automatic time update.
- **Popover editor**:
  - Anchored to the selected event/slot with Floating UI.
  - Fields: name, date, time, notes.
  - Two modes: `Cancel / Save` and `Discard / Edit`.
- **Styling**:
  - Pixel‑aligned to the Impekable Adobe XD design.
  - Synchronized colors, typography, and layout (sidebar, topbar, calendar card).
- **Persistence**: events stored in `localStorage` with a small set of seed events.

## Tech Stack

- **Framework**: Vue 3, `<script setup>` + TypeScript
- **Build tool**: Vite
- **Calendar**: FullCalendar 6 (`@fullcalendar/vue3`, `daygrid`, `timegrid`, `interaction`, `list`)
- **Positioning**: `@floating-ui/vue` for anchored popover
- **Icons**: `unplugin-icons` (Material Design Icons)
- **Styling**: CSS modules per component + global CSS variables

## Project Structure

- `src/App.vue` – main shell (sidebar + topbar + content).
- `src/views/CalendarView.vue` – calendar page, FullCalendar config and handlers.
- `src/components/calendar/EventModal.vue` – popover editor for events.
- `src/components/layout/Sidebar.vue` – left navigation, Impekable style.
- `src/components/layout/Topbar.vue` – top search and profile bar.
- `src/composables/useEvents.ts` – events state + localStorage persistence.
- `src/types/event.ts` – `CalendarEvent` type definition.
- `src/styles/global.css` – global theme (colors, typography, card styles).

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 (default Vite port).

## Production Build

```bash
npm run build
```

The built assets will be output to the `dist` directory and are ready to be deployed (for example, to GitHub Pages). 

## Notes

- All times are stored as native `Date` instances and normalized to avoid off‑by‑one issues with time zones.
- The calendar is intentionally kept in a single page (`CalendarView.vue`) so the layout and styling are easy to adjust against the original design.
