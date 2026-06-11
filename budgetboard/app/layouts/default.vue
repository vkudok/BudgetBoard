<template>
  <div class="flex min-h-screen">
    <AppSidebar />
    <!--    <div v-if="isOpen">-->
    <!--      <AppSidebar/>-->
    <!--    </div>-->
    <main class="min-w-0 flex-1 p-6">
      <!--      <AppBurgerButton class="ml-7 m-5.5 mr-0" :isOpen="isOpen" @click="isOpen = !isOpen"/>-->
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  //TODO вернуть бургер
  // import AppBurgerButton from '../components/app/AppBurgerButton.vue';
  import AppSidebar from "../components/app/AppSidebar.vue";

  // const isOpen = ref(false)
</script>
