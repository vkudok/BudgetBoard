<template>
  <div class="flex justify-between">
    <PageInfoHeader :number="1" name="Dashboard"/>
    <TransactionDialog/>
  </div>
</template>

<script setup lang="ts">
import TransactionDialog from '../components/app/TransactionDialog.vue';
import PageInfoHeader from '../components/app/PageInfoHeader.vue';
</script>
