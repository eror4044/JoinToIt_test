import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: CalendarView }],
})

describe('App', () => {
  it('renders layout with calendar page', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
      },
    })
    expect(wrapper.find('.app-shell').exists()).toBe(true)
  })
})
