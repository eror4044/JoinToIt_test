import { ref, watch } from 'vue'
import type { CalendarEvent } from '../types/event'

const STORAGE_KEY = 'calendar-events'

const seedEvents: CalendarEvent[] = [
  
]

const loadEvents = (): CalendarEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedEvents
    const parsed = JSON.parse(raw) as CalendarEvent[]
    return Array.isArray(parsed) && parsed.length ? parsed : seedEvents
  } catch {
    return seedEvents
  }
}

const persist = (items: CalendarEvent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useEvents = () => {
  const events = ref<CalendarEvent[]>(loadEvents())

  watch(
    events,
    value => {
      persist(value)
    },
    { deep: true }
  )

  const generateId = () => crypto.randomUUID?.() ?? `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`

  const addEvent = (data: Omit<CalendarEvent, 'id'>) => {
    const next: CalendarEvent = { ...data, id: generateId() }
    events.value = [...events.value, next]
    return next
  }

  const updateEvent = (id: string, patch: Partial<CalendarEvent>) => {
    events.value = events.value.map(event => (event.id === id ? { ...event, ...patch } : event))
  }

  const deleteEvent = (id: string) => {
    events.value = events.value.filter(event => event.id !== id)
  }

  return { events, addEvent, updateEvent, deleteEvent }
}
