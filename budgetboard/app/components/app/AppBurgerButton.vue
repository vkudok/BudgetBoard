<template>
  <button
    type="button"
    class="inline-flex size-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white text-gray-900 transition-colors duration-150 hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
    :aria-label="buttonLabel"
    :aria-expanded="isOpen"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <span
      class="block h-0.5 w-4.5 rounded-full bg-current transition duration-180"
      :class="isOpen ? 'translate-y-2 rotate-45' : ''"
    />
    <span
      class="block h-0.5 w-4.5 rounded-full bg-current transition duration-180"
      :class="isOpen ? 'opacity-0' : ''"
    />
    <span
      class="block h-0.5 w-4.5 rounded-full bg-current transition duration-180"
      :class="isOpen ? '-translate-y-2 -rotate-45' : ''"
    />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isOpen?: boolean
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    isOpen: false,
    disabled: false,
    ariaLabel: undefined
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonLabel = computed(() => props.ariaLabel ?? (props.isOpen ? 'Close menu' : 'Open menu'))
</script>

