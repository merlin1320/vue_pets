import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock localStorage globally before importing the component
const localStorageMock: {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  clear: () => void
  removeItem: (key: string) => void
} = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

import PetList from '../PetList.vue'

const createWrapper = (
  props = {},
  options = {},
): import('@vue/test-utils').VueWrapper<InstanceType<typeof PetList>> => {
  return mount(PetList, {
    props,
    ...options,
  })
}

describe('PetList.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    ;(localStorageMock.getItem as ReturnType<typeof vi.fn>)
      .mockReset()(localStorageMock.setItem as ReturnType<typeof vi.fn>)
      .mockReset()
    localStorageMock.clear()
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
    const removeBtn = wrapper
      .findAll('button')
      .find((btn: { text: () => string }) => btn.text() === 'Remove')
    if (removeBtn) {
      await removeBtn.trigger('click')
    } else {
      throw new Error('Remove button not found')
    }
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
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(anchor as unknown as HTMLAnchorElement)
    const appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => document.createElement('div'))
    await wrapper.find('.download-btn').trigger('click')
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(anchor.click).toHaveBeenCalled()
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
  })

  it('loads pets from localStorage on mount', async () => {
    ;(localStorageMock.getItem as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      JSON.stringify([
        {
          id: 99,
          name: 'Testy',
          ownerName: 'Tester',
          age: 1,
          favoriteFood: 'TestFood',
          isFed: true,
        },
      ]),
    )
    // Create wrapper AFTER setting mock return value
    const localWrapper = mount(PetList)
    await nextTick()
    expect(localWrapper.text()).toContain('Testy')
    expect(localWrapper.text()).toContain('Tester')
  })

  it('saves pets to localStorage when changed', async () => {
    await wrapper.find('.add-pet').trigger('click')
    const inputs = wrapper.findAll('.modal-content input')
    await inputs[0].setValue('Rex')
    await inputs[1].setValue('Sam')
    await inputs[2].setValue(2)
    await inputs[3].setValue('Chicken')
    await wrapper.find('.modal-actions button[type="submit"]').trigger('submit')
    expect(localStorageMock.setItem).toHaveBeenCalled()
    const lastCall = localStorageMock.setItem.mock.calls.pop()
    expect(lastCall[0]).toBe('pets')
    expect(JSON.parse(lastCall[1])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Rex', ownerName: 'Sam', age: 2, favoriteFood: 'Chicken' }),
      ]),
    )
  })
})
