<template>
  <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900">
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped></style>
