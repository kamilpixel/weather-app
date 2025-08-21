<template>
  <div class="w-full h-[200px] text-left">
    <CardBase :class="getClass">
      <div class="flex justify-between h-full p-2 text-white">
        <div class="relative h-full">
          <div class="w-full">
            <div class="font-bold text-2xl">{{ item.city }}</div>
            <div>{{ item.lastUpdate }}</div>
          </div>
          <div class="absolute bottom-0">{{ item.weather }}</div>
        </div>
        <div class="relative h-full w-[200px]">
          <div class="text-4xl text-right">{{ item.temprature }}º C</div>
          <div class="absolute bottom-0 right-0">
            <div class="flex text-small font-medium">
              <div class="pr-2">H:{{ item.tempHigh }}º C</div>
              <div>L:{{ item.tempLow }}º C</div>
            </div>
          </div>
        </div>
      </div>
    </CardBase>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import CardBase from '@/components/WeatherCards/atoms/CardBase.vue';

const props = defineProps<{
  item?: object;
}>();

const getClass = computed(() => {
  // TODO change background based on weather
  return `bg-[url('/assets/cloud-blue.png')] bg-cover bg-center bg-no-repeat`;
});
</script>
