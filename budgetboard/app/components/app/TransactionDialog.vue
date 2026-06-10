<template>
  <UModal v-model:open="isOpen">
    <UButton color="info" size="xl" variant="solid">
      + Add transaction
    </UButton>

    <template #content>
      <UForm
        class="flex flex-col w-full gap-1 p-7"
        :validate="validate"
        :state="state"
        @submit="onSubmit"
      >
        <div class="flex items-center justify-between pb-7">
          <PageInfoHeader name="Add transaction" />
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            @click="closeModal"
          />
        </div>
        <UFormField label="Type" name="type" class="min-h-23">
          <div class="flex w-full gap-1">
            <UButton
              icon="i-lucide-arrow-down"
              class="h-12 flex-1 justify-center"
              color="primary"
              :variant="state.type === 'income' ? 'solid' : 'subtle'"
              @click="toggleType('income')"
            >
              Income
            </UButton>

            <UButton
              icon="i-lucide-arrow-up"
              class="h-12 flex-1 justify-center"
              color="error"
              :variant="state.type === 'expense' ? 'solid' : 'subtle'"
              @click="toggleType('expense')"
            >
              Expense
            </UButton>
          </div>
        </UFormField>
        <UFormField label="Amount" name="amount" class="min-h-23">
          <UInput
            v-model="state.amount"
            class="w-full"
            type="number"
            placeholder="0.00"
            min="0"
            :ui="{ base: 'h-12 text-base' }"
          >
            <template #leading> ₽ </template>
          </UInput>
        </UFormField>

        <div v-if="state.type === 'expense'">
          <UFormField label="Category" name="category" class="min-h-23">
            <USelect
              v-model="state.category"
              class="w-full"
              :items="categories"
              :ui="{ base: 'h-12 text-base' }"
            />
          </UFormField>
        </div>

        <UFormField label="Date" name="date" class="min-h-23">
          <UInput
            v-model="state.date"
            type="date"
            class="w-full"
            :ui="{ base: 'h-12 text-base' }"
          />
        </UFormField>

        <UFormField
          label="Comment (optional)"
          name="comment"
          class="min-h-23 pb-6"
        >
          <UTextarea
            v-model="state.comment"
            class="w-full"
            placeholder="Write comment..."
            :ui="{ base: 'h-20 text-base' }"
          />
        </UFormField>

        <div class="flex gap-2 justify-end">
          <UButton
            type="button"
            color="info"
            variant="outline"
            @click="closeModal"
          >
            Cancel
          </UButton>
          <UButton type="submit" color="info" variant="solid">
            Save transaction
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from "@nuxt/ui";
  import PageInfoHeader from "./PageInfoHeader.vue";
  import { useTransactionService } from "~/features/transactions/services/transactions.service";
  import type {
    TransactionCreate,
    TransactionType,
  } from "~/features/transactions/models/transactions.model";

  const state = reactive<TransactionCreate>({
    type: "income",
    amount: 0,
    category: "-",
    comment: "",
    date: "",
  });
  const isOpen = ref(false);
  const toast = useToast();
  const transactionService = useTransactionService();
  const categories = ref<string[]>([]);
  const emit = defineEmits<{
    created: [];
  }>();

  watch(isOpen, async (value) => {
    if (!value) {
      return;
    }

    categories.value = await transactionService.getTransactionsCategories();
  });

  function validate(state: Partial<TransactionCreate>): FormError[] {
    const errors = [];
    if (!state.type) errors.push({ name: "type", message: "Required" });
    if (!state.amount) errors.push({ name: "amount", message: "Required" });
    if (state.type === "expense" && !state.category)
      errors.push({ name: "category", message: "Required" });
    if (!state.date) errors.push({ name: "date", message: "Required" });
    return errors;
  }

  function resetForm() {
    state.type = "income";
    state.amount = 0;
    state.category = "-";
    state.comment = "";
    state.date = "";
  }

  function closeModal() {
    resetForm();
    isOpen.value = false;
  }

  function toggleType(type: TransactionType) {
    state.type = type;
    if (state.type === "income") {
      state.category = "-";
    }
  }

  async function onSubmit(event: FormSubmitEvent<TransactionCreate>) {
    try {
      await transactionService.postTransactions(event.data);
      closeModal();
      toast.add({
        title: "Success",
        description: "Saved successfully.",
        color: "success",
      });
      emit("created");
    } catch (error) {
      console.error(error);
      toast.add({
        title: "Error",
        description: "An error occurred while saving.",
        color: "error",
      });
    }
  }
</script>
