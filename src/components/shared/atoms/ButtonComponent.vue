<template>
  <button
    :type="type"
    class="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps } from 'vue';

type ButtonType = 'button' | 'submit' | 'reset';

withDefaults(
  defineProps<{
    type?: ButtonType;
  }>(),
  {
    type: 'button',
  },
);
</script>
