import { mount } from '@vue/test-utils'
import Explore from '@/views/Explore.vue'

describe('Explore.vue', () => {
  it('renders tab 1 view', () => {
    const wrapper = mount(Explore)
    expect(wrapper.text()).toMatch('Explore page')
  })
})
