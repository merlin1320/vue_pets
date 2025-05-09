import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PetList from '../PetList.vue'

const createWrapper = (props = {}, options = {}) => {
  return mount(PetList, {
    ...options,
  })
}

describe('PetList.vue', () => {
  let wrapper: any
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('renders the pet list table', () => {
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.text()).toContain('Fluffy')
    expect(wrapper.text()).toContain('Buddy')
  })

  it('can filter by owner', async () => {
    await wrapper.find('select').setValue('Frank')
    expect(wrapper.text()).toContain('Fluffy')
    expect(wrapper.text()).not.toContain('Buddy')
  })

  it('can filter by fed status', async () => {
    const fedSelect = wrapper.findAll('select')[1]
    await fedSelect.setValue('Fed')
    expect(wrapper.text()).toContain('Buddy')
    expect(wrapper.text()).not.toContain('Fluffy')
    await fedSelect.setValue('Hungry')
    expect(wrapper.text()).toContain('Fluffy')
    expect(wrapper.text()).not.toContain('Buddy')
  })

  it('can toggle fed status', async () => {
    const fedCheckbox = wrapper.findAll('input[type="checkbox"]')[0]
    expect(wrapper.text()).toContain('Hungry')
    await fedCheckbox.setValue(true)
    expect(wrapper.text()).toContain('Fed')
  })

  it('can remove a pet', async () => {
    const removeBtn = wrapper.findAll('button').find((btn) => btn.text() === 'Remove')
    await removeBtn.trigger('click')
    expect(wrapper.text()).not.toContain('Fluffy')
  })

  it('opens and closes the add pet modal', async () => {
    const addBtn = wrapper.find('.add-pet')
    await addBtn.trigger('click')
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    await wrapper.find('.modal-actions button[type="button"]').trigger('click')
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('can add a new pet', async () => {
    await wrapper.find('.add-pet').trigger('click')
    const inputs = wrapper.findAll('.modal-content input')
    await inputs[0].setValue('Rex') // name
    await inputs[1].setValue('Sam') // ownerName
    await inputs[2].setValue(2) // age
    await inputs[3].setValue('Chicken') // favoriteFood
    // Optionally check the fed checkbox: await inputs[4].setValue(true)
    await wrapper.find('.modal-actions button[type="submit"]').trigger('submit')
    expect(wrapper.text()).toContain('Rex')
    expect(wrapper.text()).toContain('Sam')
  })

  it('downloads pets as JSON (mocked)', async () => {
    const anchor = { setAttribute: vi.fn(), click: vi.fn(), remove: vi.fn(), style: {} }
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor as any)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    await wrapper.find('.download-btn').trigger('click')
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(anchor.click).toHaveBeenCalled()
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
  })
})
