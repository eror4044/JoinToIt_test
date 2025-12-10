export interface CalendarEvent {
  id: string
  title: string
  start: string | Date
  end: string | Date
  color: string
  allDay?: boolean
}
