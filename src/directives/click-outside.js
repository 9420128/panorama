// src/directives/click-outside.js
export default {
  beforeMount(el, binding) {
    // Функция, которая сработает при клике по документу
    el.__clickOutsideHandler__ = (event) => {
      // Если клик был ВНЕ элемента — вызываем переданную функцию
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }

    document.addEventListener('click', el.__clickOutsideHandler__)
  },

  unmounted(el) {
    document.removeEventListener('click', el.__clickOutsideHandler__)
    delete el.__clickOutsideHandler__
  },
}
