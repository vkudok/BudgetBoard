<template>
  <UModal v-model:open="isOpen">
    <UButton
        color="info"
        size="xl"
        variant="solid">
      + Add transaction
    </UButton>

    <template #content>
      <UForm class="flex flex-col w-full gap-1 p-7" :validate="validate" :state="state" @submit="onSubmit">
        <div class="flex items-center justify-between pb-7">
          <PageNumber :number="3" name="Add transaction"/>
          <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              @click="closeModal"/>
        </div>
        <UFormField label="Type" name="type" class="min-h-23">
          <div class="flex w-full gap-1">
            <UButton
                icon="i-lucide-arrow-up"
                class="h-12 flex-1 justify-center"
                color="primary"
                :variant="state.type === 'income' ? 'solid' : 'subtle'"
                @click="toggleType('income')"
            >
              Income
            </UButton>

            <UButton
                icon="i-lucide-arrow-down"
                class="h-12 flex-1 justify-center"
                color="error"
                :variant="state.type === 'expense' ? 'solid' : 'subtle'"
                @click="toggleType('expense')"
            >
              Expense
            </UButton>
          </div>
        </UFormField>
        <UFormField label="Amount" name="amount"
                    class="min-h-23">
          <UInput
              class="w-full"
              v-model="state.amount"
              type="number"
              placeholder="0.00"
              min="0"
              :ui="{ base: 'h-12 text-base' }"
          >
            <template #leading>
              ₽
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Category" name="category"
                    class="min-h-23">
          <USelect class="w-full" v-model="state.category"
                   :ui="{ base: 'h-12 text-base' }"/>
        </UFormField>

        <UFormField label="Date" name="date" class="min-h-23">
          <UInput
              v-model="state.date"
              type="date"
              class="w-full"
              :ui="{ base: 'h-12 text-base' }"
          />
        </UFormField>

        <UFormField label="Comment (optional)" name="comment"
                    class="min-h-23 pb-6">
          <UTextarea
              class="w-full"
              v-model="state.comment"
              placeholder="Write comment..."
              :ui="{ base: 'h-20 text-base' }"
          />
        </UFormField>

        <div class="flex gap-2 justify-end">
          <UButton type="button" color="info" variant="outline" @click="closeModal">
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
import type {FormError, FormSubmitEvent} from '@nuxt/ui'
import PageNumber from "~/components/app/PageNumber.vue";

const state = reactive({
  type: null,
  amount: null,
  category: null,
  comment: null,
  date: null,
})
const isOpen = ref(false)
const toast = useToast()

type Schema = typeof state

function validate(state: Partial<Schema>): FormError[] {
  const errors = []

  if (!state.type) errors.push({ name: 'type', message: 'Required' })
  if (!state.amount) errors.push({ name: 'amount', message: 'Required' })
  // if (!state.category) errors.push({ name: 'category', message: 'Required' })
  if (!state.date) errors.push({ name: 'date', message: 'Required' })

  return errors
}

function resetForm() {
  state.type = null
  state.amount = null
  state.category = null
  state.comment = null
  state.date = null
}

function closeModal() {
  resetForm()
  isOpen.value = false
}

function toggleType(type: 'income' | 'expense') {
  if (state.type === type) {
    state.type = null
    return
  }

  state.type = type
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log(event.data)
  closeModal()
}
</script>

