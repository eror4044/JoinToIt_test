<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import type { CalendarEvent } from '../../types/event'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit' | null
  eventData: CalendarEvent | null
  validationMessage?: string
  referenceEl?: HTMLElement | null
  teleportTarget?: string | Element
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: Omit<CalendarEvent, 'id'> & { id?: string }): void
  (e: 'delete', id: string): void
}>()

const form = reactive({
  title: '',
  date: '',
  time: '',
  notes: '',
  color: '#3e7bff',
})

const error = ref('')
const isEdit = computed(() => props.mode === 'edit')
const defaultDurationMs = 60 * 60 * 1000
const durationMs = ref(defaultDurationMs)

const toDateString = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  // Normalize to local date so we do not get
  // off‑by‑one errors from UTC conversion.
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  const local = new Date(date.getTime() - offsetMs)

  return local.toISOString().split('T')[0]
}

const toTimeString = (value: Date | string) => new Date(value).toTimeString().slice(0, 5)

watch(
  () => props.eventData,
  event => {
    if (!event) {
      form.title = ''
      form.date = ''
      form.time = ''
      form.notes = ''
      form.color = '#3e7bff'
      durationMs.value = defaultDurationMs
      error.value = ''
      return
    }

    form.title = event.title
    form.date = toDateString(event.start) || ""
    form.time = toTimeString(event.start)
    form.color = event.color
    form.notes = ''

    // Existing events keep their actual duration; newly created ones
    // fall back to the default 1-hour duration so month view bars
    // do not span multiple days.
    if (event.id) {
      const start = new Date(event.start).getTime()
      const end = new Date(event.end).getTime()
      durationMs.value = end > start ? end - start : defaultDurationMs
    } else {
      durationMs.value = defaultDurationMs
    }

    error.value = ''
  },
  { immediate: true }
)

watch(
  () => props.validationMessage,
  value => {
    if (value) error.value = value
  }
)

const reference = ref<HTMLElement | null>(null)
const floating = ref<HTMLElement | null>(null)

watch(
  () => props.referenceEl,
  el => {
    reference.value = el ?? null
  },
  { immediate: true }
)

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'bottom',
  middleware: [offset(8), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
})

const buildDateTime = (date: string, time: string) => new Date(`${date}T${time}:00`)

const handleSave = () => {
  error.value = ''

  if (!form.title.trim()) {
    error.value = 'event name is required'
    return
  }

  if (!form.date || !form.time) {
    error.value = 'event date and time are required'
    return
  }

  const start = buildDateTime(form.date, form.time)
  if (Number.isNaN(start.getTime())) {
    error.value = 'invalid date or time'
    return
  }

  const end = new Date(start.getTime() + durationMs.value)

  emit('save', {
    id: props.eventData?.id,
    title: form.title.trim(),
    start,
    end,
    color: form.color,
    allDay: props.eventData?.allDay,
  })
}

const handleDelete = () => {
  if (props.eventData?.id) emit('delete', props.eventData.id)
}
</script>

<template>
  <teleport :to="teleportTarget || 'body'">
    <div v-if="open" class="overlay" @click.self="emit('close')">
      <div ref="floating" class="modal card" :style="floatingStyles">
        <div class="arrow" />

        <header class="modal-head">
          <div class="title">Calendar View</div>
          <button class="close-btn" type="button" @click="emit('close')">×</button>
        </header>

        <div class="form-grid">
          <label class="field">
            <span class="label">event name</span>
            <input v-model="form.title" type="text" placeholder="event name" />
          </label>

          <label class="field">
            <span class="label">event date</span>
            <div class="input-wrapper">
              <input v-model="form.date" type="date" />
              <IconMdiCalendarOutline class="input-icon" aria-hidden="true" />
            </div>
          </label>

          <label class="field">
            <span class="label">event time</span>
            <div class="input-wrapper">
              <input v-model="form.time" type="time" />
              <IconMdiClockTimeFourOutline class="input-icon" aria-hidden="true" />
            </div>
          </label>

          <label class="field">
            <span class="label">notes</span>
            <textarea v-model="form.notes" placeholder="notes" />
          </label>

          <p v-if="error" class="error">{{ error }}</p>
        </div>

        <footer class="actions">
          <button
            v-if="isEdit"
            type="button"
            class="ghost danger"
            @click="handleDelete"
          >
            Discard
          </button>
          <button
            v-else
            type="button"
            class="ghost"
            @click="emit('close')"
          >
            Cancel
          </button>

          <div class="spacer" />

          <button type="button" class="primary" @click="handleSave">
            {{ isEdit ? 'Edit' : 'Save' }}
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.02);
  z-index: 2000;
}

.modal {
  position: absolute;
  width: 320px;
  padding: 18px 18px 16px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(42, 47, 80, 0.16);
}

.arrow {
  position: absolute;
  top: -7px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-left: 1px solid #e6e8ef;
  border-top: 1px solid #e6e8ef;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.title {
  font-size: 15px;
  font-weight: 700;
  color: #44475b;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #9aa0b5;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #6a6f82;
}

.label {
  text-transform: lowercase;
}

.input-wrapper {
  position: relative;
}

input,
textarea {
  width: 100%;
  padding: 8px 32px 8px 0;
  border: none;
  border-bottom: 1px solid #e4e7f0;
  font-size: 14px;
  outline: none;
  background: transparent;
}

textarea {
  resize: none;
  min-height: 40px;
}

input::placeholder,
textarea::placeholder {
  color: #c2c6d4;
}

.input-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #c2c6d4;
}

.error {
  color: #d1434b;
  font-size: 13px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
}

.spacer {
  flex: 1;
}

.ghost {
  border: none;
  background: transparent;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #8c91a5;
}

.ghost.danger {
  color: #e55152;
}

.primary {
  border: none;
  background: #4c6fff;
  color: #ffffff;
  padding: 8px 22px;
  border-radius: 18px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 480px) {
  .modal {
    width: 92vw;
  }
}
</style>
