<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      colorClasses,
      sizeClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary | secondary | danger | success | warning
  size: { type: String, default: 'sm' }, // sm | md | lg
  disabled: { type: Boolean, default: false },
})

const colorClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300'
    case 'success':
      return 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500'
    default:
      return 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5'
    case 'md':
      return 'px-4 py-2'
    case 'lg':
      return 'px-5 py-2.5 text-base'
    default:
      return 'px-3 py-1.5'
  }
})
</script>
