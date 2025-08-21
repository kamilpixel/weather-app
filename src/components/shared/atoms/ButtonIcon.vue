<template>
  <button style="background-color: orange; padding: 1em" class="cursor-pointer">
    <!-- TODO: dynamic icon -->
    <IconPlus v-if="iconName == 'plus'" />
    <IconChevronLeft v-else-if="iconName == 'chevron-left'" />
    <IconBin v-else-if="iconName == 'bin'" />
  </button>
</template>
<script lang="ts" setup>
import IconChevronLeft from './IconChevronLeft.vue';
import IconPlus from './IconPlus.vue';
import IconBin from './IconBin.vue';

// iconName as props
defineProps<{
  iconName: string;
}>();
</script>
