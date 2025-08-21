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
    <div>TODO: existing city weather cards</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueMultiselect from 'vue-multiselect';

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
      name: item.name,
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

const customLabel = ({ name, country, state }) => {
  // Only return non-empty values
  return [name, state, country].filter(Boolean).join(', ');
};

// TODO refactor any types
const onSelect = (option: any) => {
  console.log('onSelect', option);
  router.push({
    name: 'DetailView',
    query: {
      lat: option.lat.toString(),
      lon: option.lon.toString(),
      city: [option.name, option.state, option.country].filter(Boolean).join(', '),
    },
  });
};
</script>
