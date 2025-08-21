<template>
  <div class="container mx-auto p-4">
    <h1 class="text-xl font-medium">Weather</h1>
    <br />
    <div class="flex justify-between">
      <div>Weather</div>
      <div>IconProfile</div>
    </div>
    <VueMultiselect
      v-model="selected"
      track-by="id"
      label="name"
      :options="options"
      :internal-search="false"
      :custom-label="customLabel"
      :loading="isLoadingOptions"
      :placeholder="'Search for a city or airport'"
      @search-change="debounceAsyncFind"
      @select="onSelect"
    />
    <br />
    <div>
      <div v-if="cityRecords && cityRecords.length">
        <!-- TODO: convert to weather cards -->
        <div
          v-for="item in cityRecords"
          :key="item.id"
          class="border p-2 mb-2"
          @click="onSelect(item)"
        >
          <p>{{ item.city }}, {{ item.state }}, {{ item.country }}</p>
          <button @click="onSelect(item)">View Weather</button>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">No cities selected. Please search for a city or airport.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import VueMultiselect from 'vue-multiselect';
import type { GeoLocation } from '@/types/location.types';

const store = useStore();
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const selected = ref(null);
const options = ref([]);
const timeoutDebounce = ref<any | undefined>(null);
const isLoadingOptions = ref(false);
const router = useRouter();

const asyncFind = async (query: string) => {
  console.log('asyncFind', query);
  isLoadingOptions.value = true;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    // TODO refactor any types
    // TODO keep records in vuex store
    options.value = result.map((item: any) => ({
      city: item.name,
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      id: `${item.lat},${item.lon}`, // Unique track-by custom id key
    }));
  } catch (error: any) {
    console.error(error?.message);
  } finally {
    isLoadingOptions.value = false;
  }
};

const debounceAsyncFind = (query: string) => {
  if (!query) {
    return;
  }
  console.log('debounceAsyncFind', query);
  console.log('debounceAsyncFind');
  timeoutDebounce.value = clearTimeout(timeoutDebounce.value);
  timeoutDebounce.value = setTimeout(() => {
    asyncFind(query);
  }, 1700);
};

const customLabel = ({ city, country, state }) => {
  // Only return non-empty values
  return [city, state, country].filter(Boolean).join(', ');
};

// TODO refactor any types
const onSelect = (option: any) => {
  console.log('onSelect', option);
  router.push({
    name: 'DetailView',
    query: {
      lat: option.lat.toString(),
      lon: option.lon.toString(),
      city: option.city,
      state: option.state,
      country: option.country,
    },
  });
};

// Get and set city base on cities in vuex store
const cityRecords = computed<GeoLocation[]>(() => store.state.weather.cities);
</script>
