<template>
  <div class="w-full h-full border rounded-xl bg-red-100">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: true,
});
</script>
