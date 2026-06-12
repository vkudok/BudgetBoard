<template>
  <USidebar>
    <template #header>
      <UHeader title="Budget Board" />
    </template>

    <nav class="flex flex-col gap-1">
      <UButton
        v-for="link in sidebarLinks"
        :key="link.to"
        :to="link.to"
        :icon="link.icon"
        :variant="isActiveLink(link.to) ? 'solid' : 'ghost'"
        color="info"
        block
      >
        {{ link.label }}
      </UButton>
    </nav>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-2">
        <span>Color Mode</span>
        <UColorModeSwitch />
      </div>
    </template>
  </USidebar>
</template>

<script setup lang="ts">
  import { sidebarLinks } from "../../constants/navigation";

  const route = useRoute();

  const isActiveLink = (to: string) => route.path === to;
</script>
