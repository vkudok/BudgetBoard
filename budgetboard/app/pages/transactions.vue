<script setup lang="ts">
import TransactionDialog from "~/components/app/TransactionDialog.vue";
import PageNumber from "~/components/app/PageNumber.vue";
</script>
<template>
  <div class="flex justify-between">
    <PageNumber :number="2" name="Transaction List"/>
    <TransactionDialog/>
  </div>
</template>
