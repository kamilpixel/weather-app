<template>
  <div class="w-full h-full border border-gray-100 rounded-xl bg-slate-100">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: true,
});
</script>
