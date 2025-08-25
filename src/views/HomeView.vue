<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between pb-4">
      <div class="text-weather">Weather</div>
      <IconUser class="cursor-pointer" @click="router.push({ name: 'ProfileView' })" />
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

    <div class="pt-5">
      <div v-if="cityRecords && cityRecords.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- TODO: convert to weather cards -->
        <Button type="button" v-for="item in cityRecords" :key="item.id" @click="onSelect(item)">
          <!-- <p>{{ item.city }}, {{ item.state }}, {{ item.country }}</p>
          <button @click="onSelect(item)">View Weather</button> -->
          <BigWeatherCards :item="item" />
        </Button>
      </div>
      <div v-else>
        <p class="text-gray-500">No cities selected. Please search for a city or airport.</p>
      </div>

      <!--  <BigWeatherCards>testing</BigWeatherCards>
      <MidWeatherCards>testing</MidWeatherCards>
      <SmallWeatherCards>testing</SmallWeatherCards> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import VueMultiselect from 'vue-multiselect';
import type { GeoLocation } from '@/types/location.types';
import IconUser from '@/components/shared/atoms/IconUser.vue';
import BigWeatherCards from '@/components/WeatherCards/molecules/BigWeatherCards.vue';
import MidWeatherCards from '@/components/WeatherCards/molecules/MidWeatherCards.vue';
import SmallWeatherCards from '@/components/WeatherCards/molecules/SmallWeatherCards.vue';

const store = useStore();
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const apiUrl = import.meta.env.VITE_OPENWEATHER_API_URL;
const selected = ref(null);
const options = ref([]);
const timeoutDebounce = ref<any | undefined>(null);
const isLoadingOptions = ref(false);
const router = useRouter();

const asyncFind = async (query: string) => {
  console.log('asyncFind', query);
  isLoadingOptions.value = true;
  const url = `${apiUrl}/geo/1.0/direct?q=${query}&limit=10&appid=${apiKey}`;
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

<style lang="scss" scoped>
.text-weather {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
