<template>
  <UModal v-if="props.open" :open="props.open">
    <template #content>
      <div class="flex flex-col gap-6 p-7">
        <div>
          <h2 class="text-xl font-semibold">{{ props.title }}</h2>
          <p class="text-sm text-gray-500">{{ props.description }}</p>
        </div>

        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="closeDeleteConfirm(false)"
          >
            {{ props.cancelText }}
          </UButton>

          <UButton
            color="error"
            variant="solid"
            @click="closeDeleteConfirm(true)"
          >
            {{ props.confirmText }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
  const props = defineProps<{
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  }>();

  const emit = defineEmits<{
    confirmDelete: [event: boolean];
  }>();

  function closeDeleteConfirm(state: boolean): void {
    emit("confirmDelete", state);
  }
</script>
