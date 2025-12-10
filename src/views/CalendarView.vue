<script setup lang="ts">
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import type {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  DatesSetArg,
  EventContentArg
} from '@fullcalendar/core'

import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

import { useEvents } from '../composables/useEvents'
import EventModal from '../components/calendar/EventModal.vue'
import type { CalendarEvent } from '../types/event'


/* ----------------------------- TYPES ----------------------------- */

type ViewName = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'


/* ----------------------------- STATE ----------------------------- */

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
const calendarContainer = ref<HTMLElement | null>(null)
const referenceEl = ref<HTMLElement | null>(null)

const activeView = ref<ViewName>('timeGridWeek')
const rangeTitle = ref('')

const modalMode = ref<'create' | 'edit' | null>(null)
const draftEvent = ref<CalendarEvent | null>(null)
const modalError = ref('')

const { events, addEvent, updateEvent, deleteEvent } = useEvents()


/* ----------------------------- RANGE FORMAT ----------------------------- */

const formatRange = (info: DatesSetArg) => {
  const start = info.start
  const end = new Date(info.end.getTime() - 86400000)

  const fmtShort = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })
  const fmtMonth = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })
  const fmtDay = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' })

  if (info.view.type === 'dayGridMonth') return fmtMonth.format(start)
  if (info.view.type === 'timeGridDay') return fmtDay.format(start)

  return `${fmtShort.format(start)} – ${fmtShort.format(end)}`
}

const handleDatesSet = (info: DatesSetArg) => {
  activeView.value = info.view.type as ViewName
  rangeTitle.value = formatRange(info)
}


/* ----------------------------- NAVIGATION ----------------------------- */

const api = () => calendarRef.value?.getApi()

const goToday = () => api()?.today()
const goNext = () => api()?.next()
const goPrev = () => api()?.prev()

const changeView = (view: ViewName) => api()?.changeView(view)


/* ----------------------------- MODAL: CREATE ----------------------------- */

const openCreate = (info: DateSelectArg) => {
  const isTimeGridAllDay =
    info.allDay && (info.view.type === 'timeGridWeek' || info.view.type === 'timeGridDay')

  let start: Date = info.start
  let end: Date = info.end

  if (isTimeGridAllDay) {
    const dayStart = new Date(info.start)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

    start = dayStart
    end = dayEnd
  }

  draftEvent.value = {
    id: isTimeGridAllDay ? '__allDayDraft__' : '',
    title: '',
    start,
    end,
    color: '#3e7bff',
    allDay: isTimeGridAllDay
  }

  modalMode.value = 'create'
  modalError.value = ''

  anchorToSelection(info)
}


/* ----------------------------- MODAL: EDIT ----------------------------- */

const openEdit = (info: EventClickArg) => {
  draftEvent.value = {
    id: info.event.id,
    title: info.event.title,
    start: info.event.start!,
    end: info.event.end ?? info.event.start!,
    color: info.event.backgroundColor || '#3e7bff',
    allDay: info.event.allDay
  }

  modalMode.value = 'edit'
  modalError.value = ''

  if (info.el) referenceEl.value = info.el as HTMLElement
}


/* ----------------------------- DRAG / RESIZE ----------------------------- */

const handleDrop = (info: EventDropArg) => {
  updateEvent(info.event.id, {
    start: info.event.start!,
    end: info.event.end ?? info.event.start!
  })
}

const handleResize = (info: any) => {
  updateEvent(info.event.id, {
    start: info.event.start!,
    end: info.event.end ?? info.event.start!
  })
}


/* ----------------------------- MODAL ACTIONS ----------------------------- */

const closeModal = () => {
  modalMode.value = null
  draftEvent.value = null
  modalError.value = ''
  referenceEl.value = null
}

const handleSave = (payload: Omit<CalendarEvent, 'id'> & { id?: string }) => {
  if (modalMode.value === 'edit' && payload.id) updateEvent(payload.id, payload)
  else addEvent(payload)

  closeModal()
}

const handleDelete = (id: string) => {
  deleteEvent(id)
  closeModal()
}


/* ----------------------------- CALENDAR OPTIONS ----------------------------- */

const formatHeaderLabel = (date: Date) => {
  const weekday = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date)
  const day = `${date.getDate()}`.padStart(2, '0')
  const month = `${date.getMonth() + 1}`.padStart(2, '0')

  return `${weekday}`
}

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],

  initialView: 'timeGridWeek',
  selectable: true,
  editable: true,
  nowIndicator: true,
  headerToolbar: false,
  // fixed height so all views share the same card size,
  // will stretch inside the card body
  height: '100%',
  // show whole day for all time views, 2-hour slots
  slotMinTime: '00:00:00',
  slotMaxTime: '24:00:00',
  slotDuration: { hours: 2 },
  slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: true },

  dayHeaderFormat: { weekday: 'short', day: 'numeric' },
  eventTimeFormat: { hour: 'numeric', minute: '2-digit', hour12: true },

  views: {
    dayGridMonth: {
      eventDisplay: 'block',
      dayHeaderFormat: { weekday: 'short' },
    },
    timeGridWeek: {
      dayHeaderContent: arg => formatHeaderLabel(arg.date),
    },
    timeGridDay: {
      dayHeaderContent: arg => formatHeaderLabel(arg.date),
    },
  },

  eventContent: (arg: EventContentArg) => {
    const title = arg.event.title || ''
    return { html: `<div class="fc-event-title">${title}</div>` }
  },

  select: openCreate,
  eventClick: openEdit,
  eventDrop: handleDrop,
  eventResize: handleResize,
  datesSet: handleDatesSet,

  events: events.value.map(e => ({
    ...e,
    backgroundColor: e.color,
    borderColor: e.color,
    textColor: '#fff'
  }))
}))


/* ----------------------------- POSITION UPDATES ----------------------------- */

const anchorToSelection = (info?: DateSelectArg) => {
  const apiInstance = calendarRef.value?.getApi()
  const rootEl = apiInstance?.el as HTMLElement | undefined

  let el: HTMLElement | null = null

  // 1) Try to anchor to the actual slot / day cell that triggered the selection
  if (info?.jsEvent) {
    const target = info.jsEvent.target as Element | null
    el =
      (target?.closest('.fc-timegrid-slot') as HTMLElement | null) ||
      (target?.closest('.fc-daygrid-day') as HTMLElement | null) ||
      (target as HTMLElement | null)
  }

  // 2) Fallback: use the last highlight element rendered by FullCalendar
  if (!el && rootEl) {
    const highlights = rootEl.getElementsByClassName('fc-highlight')
    if (highlights.length) {
      el = highlights[highlights.length - 1] as HTMLElement
    }
  }

  referenceEl.value = el
}
</script>


<template>
  <section class="page">
    <h1 class="page-title">Calendar</h1>

    <div class="card calendar-card" ref="calendarContainer">
      <div class="controls">
        <div class="controls-top">
          <h2 class="card-title">Calendar View</h2>
          <div class="view-switch">
            <button
              v-for="view in [
                { id: 'dayGridMonth', label: 'Month' },
                { id: 'timeGridWeek', label: 'Week' },
                { id: 'timeGridDay', label: 'Day' },
                { id: 'listWeek', label: 'Agenda' },
              ]"
              :key="view.id"
              :class="['ghost', { active: activeView === view.id }]"
              @click="changeView(view.id as ViewName)"
            >
              {{ view.label }}
            </button>
          </div>
        </div>

        <div class="controls-bottom">
          <div class="nav-buttons nav-buttons-main">
            <button class="ghost" @click="goToday">Today</button>
            <button class="ghost" @click="goPrev">Back</button>
            <button class="ghost" @click="goNext">Next</button>
          </div>

          <div class="range">{{ rangeTitle }}</div>

          <div class="nav-buttons nav-buttons-clone" aria-hidden="true">
            <button class="ghost">Today</button>
            <button class="ghost">Back</button>
            <button class="ghost">Next</button>
          </div>
        </div>
      </div>

      <div class="calendar-body">
        <FullCalendar ref="calendarRef" :options="calendarOptions" class="fc-impekable" />
      </div>
    </div>

    <EventModal :open="!!modalMode" :mode="modalMode" :event-data="draftEvent" :validation-message="modalError"
      :reference-el="referenceEl" :teleport-target="calendarContainer || undefined" @close="closeModal"
      @save="handleSave" @delete="handleDelete" />
  </section>
</template>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1 1 auto;
  min-height: 0;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #3c3f50;
  padding-left: 6px;
}

.calendar-card {
  padding: 18px 18px 12px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 10px;
}

.controls-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #4a4d61;
}

.controls-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-buttons,
.view-switch {
  display: inline-flex;
  gap: 0;
  align-items: center;
}

.view-switch {
  justify-content: flex-end;
}

.ghost {
  border: 1px solid #dfe3ec;
  background: #fff;
  padding: 7px 18px;
  cursor: pointer;
  color: #5c6273;
  min-width: 61px;
  height: 32px;
  font-size: 13px;
  line-height: 1.2;
  border-radius: 0;
}

.ghost.active {
  color: #3b86ff;
  font-weight: 600;
}

.range {
  justify-self: center;
  font-weight: 600;
  color: #4a4d61;
  flex: 1;
  text-align: center;
}

.nav-buttons .ghost + .ghost,
.view-switch .ghost + .ghost {
  border-left: none;
}

.nav-buttons-clone {
  visibility: hidden;
}

.nav-buttons .ghost:first-child,
.view-switch .ghost:first-child {
  border-radius: 4px 0 0 4px;
}

.nav-buttons .ghost:last-child,
.view-switch .ghost:last-child {
  border-radius: 0 4px 4px 0;
}

.calendar-body {
  flex: 1 1 auto;
  min-height: 0;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .view-switch {
    justify-content: flex-start;
  }

  .range {
    justify-self: flex-start;
  }
}
</style>

<style>
.fc-impekable {
  --fc-border-color: #edf0f7;
  --fc-page-bg: #f9faff;
  --fc-neutral-bg-color: #f6f8fd;
  --fc-now-indicator-color: #3e7bff;
  --fc-today-bg-color: #f7f8fe;
  --fc-event-bg-color: #3e7bff;
  --fc-event-border-color: #3e7bff;
  --fc-list-event-hover-bg-color: rgba(62, 132, 255, 0.06);
  font-family: 'Open Sans', system-ui, sans-serif;
}

.fc-impekable .fc {
  background: #ffffff;
  border: none;
}

.fc-impekable .fc-toolbar {
  padding: 4px 10px;
}


.fc-impekable .fc-daygrid-day-number {
  color: #7a8196;
  font-weight: 600;
  font-size: 11px;
}

.fc-impekable .fc-daygrid-day.fc-day-today,
.fc-impekable .fc-timegrid-col.fc-day-today {
  background: #f7f8fe;
}

.fc-impekable .fc-col-header-cell {
  background: #f6f8fd;
  color: #7a8196;
  font-weight: 600;
  font-size: 12px;
  text-transform: none;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: #edf0f7;
}

.fc-impekable .fc-col-header-cell-cushion {
  padding: 8px 0;
}

.fc-impekable .fc-toolbar-title {
  font-size: 16px;
}


.fc-impekable .fc-timegrid-axis-frame {
  color: #8c91a5;
}

.fc-timegrid-divider {
  display: none;
}

.fc-impekable .fc-event {
  border: none;
  border-radius: 8px;
  padding: 2px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.fc-impekable .fc-event-main {
  color: #ffffff;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.fc-impekable .fc-h-event .fc-event-time {
  display: none;
}

.fc-impekable .fc-daygrid-day .fc-daygrid-event {
  background-color: #3B86FF;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2px 10px;
  width: 100%;
}

.fc-event-title {
  color: #f7f8fe;
  font-weight: 300;
}

.fc-impekable .fc-daygrid-day .fc-daygrid-event-dot,
.fc-impekable .fc-daygrid-day .fc-event-time {
  display: none;
}

.fc-impekable .fc-daygrid-block-event {
  margin-top: 4px;
  margin-bottom: 2px;
}

.fc-impekable .fc-daygrid-day-top {
  align-items: flex-start;
}

.fc-impekable .fc-timegrid-slot {
  height: 46px;
  border-color: #edf0f7;
}

.fc-impekable .fc-timegrid-axis-cushion {
  color: #8c91a5;
  font-size: 11px;
  font-weight: 600;
}

.fc-impekable .fc-timegrid-slot-label-cushion {
  color: #8c91a5;
  font-size: 11px;
  font-weight: 600;
}

.fc-impekable .fc-list {
  border: 1px solid #edf0f7;
  border-radius: 10px;
  overflow: hidden;
  font-size: 13px;
}

.fc-impekable .fc-list-day-cushion {
  background: #f6f8fd;
  color: #7a8196;
  font-weight: 600;
}

.fc-impekable .fc-list-event-time {
  color: #7a8196;
  font-weight: 600;
}

.fc-impekable .fc-list-event:hover td {
  background: rgba(62, 132, 255, 0.06);
}

.fc-impekable .fc-list-event-title {
  font-weight: 600;
  color: #2f2f3a;
}

.fc-impekable .fc-list-table tr td {
  border-color: #edf0f7;
  padding-top: 12px;
  padding-bottom: 12px;
}

.fc-impekable .fc-timegrid-now-indicator-line {
  border-color: var(--fc-now-indicator-color);
  border-width: 1.5px;
}

.fc-impekable .fc-timegrid-now-indicator-arrow {
  border-color: var(--fc-now-indicator-color);
}

.fc-impekable {
  scrollbar-width: none;
}

.fc-impekable *::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
