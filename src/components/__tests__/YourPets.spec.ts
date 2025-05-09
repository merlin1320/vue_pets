import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import YourPets from '../YourPets.vue'

describe('YourPets.vue', () => {
  const pet = {
    id: 1,
    name: 'Fluffy',
    ownerName: 'Frank',
    age: 3,
    favoriteFood: 'Fish',
    isFed: false,
  }

  it('renders pet details', () => {
    const wrapper = mount(YourPets, { props: { pet } })
    expect(wrapper.text()).toContain('Fluffy')
    expect(wrapper.text()).toContain('Frank')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('Fish')
  })

  it('emits toggle event when checkbox is changed', async () => {
    const wrapper = mount(YourPets, { props: { pet } })
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect((wrapper.emitted('toggle') ?? [])[0]).toEqual([1])
  })
})
