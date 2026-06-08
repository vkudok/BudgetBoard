<template>
  <div class="flex gap-3">
<!--    <div class="flex size-9 items-center justify-center rounded-full bg-violet-600 text-white font-semibold">-->
<!--      {{ number }}-->
<!--    </div>-->
    <h2 class="text-2xl font-semibold">
      {{ name }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps(
    {
      number: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
)
</script>