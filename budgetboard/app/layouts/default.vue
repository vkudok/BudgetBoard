<template>
  <div class="flex min-h-screen">
    <div v-if="isOpen">
      <AppSidebar/>
    </div>
    <AppBurgerButton class="m-5.5 mr-0" :isOpen="isOpen" @click="isOpen = !isOpen"/>
    <main class="min-w-0 flex-1 p-6">
      <slot/>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppBurgerButton from "~/components/app/AppBurgerButton.vue";

const isOpen = ref(false)
</script>
