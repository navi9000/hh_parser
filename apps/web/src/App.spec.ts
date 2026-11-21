import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from './App.vue';

describe('App', () => {
  it('increments the click count', async () => {
    const wrapper = mount(App);

    await wrapper.get('button').trigger('click');

    expect(wrapper.get('button').text()).toBe('Clicked 1 time');
  });
});
