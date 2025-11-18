<template>
  <label class="flex items-center gap-1">
    <span v-if="label" class="text-gray-700 text-sm font-medium">{{ label }}</span>
    <input
      :type="type"
      v-model="localValue"
      :placeholder="placeholder"
      class="w-[60px] border border-gray-300 rounded-md px-1.5 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
      :class="sizeClass"
    />
    <span v-if="suffix" class="text-gray-500 text-xs">{{ suffix }}</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  suffix: {
    type: String,
    default: '' // например "%"
  },
  size: {
    type: String,
    default: 'sm', // sm | md | lg
  },
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'md':
      return 'w-[80px] px-2 py-1 text-base'
    case 'lg':
      return 'w-[120px] px-3 py-1.5 text-base'
    default:
      return 'w-[50px] px-1 py-0.5 text-sm'
  }
})
</script>
