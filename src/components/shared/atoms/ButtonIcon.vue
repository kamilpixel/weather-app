<template>
  <button class="cursor-pointer p-2">
    <!-- TODO: dynamic icon -->
    <IconPlus v-if="iconName == 'plus'" />
    <IconChevronLeft v-else-if="iconName == 'chevron-left'" />
    <IconBin v-else-if="iconName == 'bin'" />
    <IconEditPicture v-else-if="iconName == 'edit'" />
    <IconRefresh v-else-if="iconName == 'refresh'" />
  </button>
</template>
<script lang="ts" setup>
import IconChevronLeft from './IconChevronLeft.vue';
import IconPlus from './IconPlus.vue';
import IconBin from './IconBin.vue';
import IconEditPicture from './IconEditPicture.vue';
import IconRefresh from './IconRefresh.vue';

// iconName as props
defineProps<{
  iconName: string;
}>();

defineOptions({
  inheritAttrs: true,
});
</script>
