import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'

describe('App.vue', () => {
  it('renders PetList component', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent({ name: 'PetList' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('Pet List')
  })
})
