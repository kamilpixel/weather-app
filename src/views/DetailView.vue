<template>
  <div>
    <div class="background--detail-page">
      <div class="flex justify-between items-center mb-4 p-2">
        <ButtonIcon icon-name="chevron-left" @click="goHome" />
        <p class="text-white font-semibold">{{ city }}</p>
        <!-- If already exists in record show delete button -->
        <ButtonIcon v-if="!isCityInRecords" icon-name="plus" @click="onClickPlus" />
        <ButtonIcon v-else icon-name="bin" @click="onClickDelete" />
      </div>

      <section class="mx-auto w-[300px] pb-5 text-white text-center">
        <p>{{ textDate }}</p>
        <img :src="iconUrl" alt="Weather Icon" class="mx-auto" />
        <p class="text-3xl">{{ textTemperature }}º C</p>
        <p class="text-lg font-medium pb-2">{{ textWeather }}</p>
        <div class="mx-auto w-[200px]">
          <div class="flex items-center">
            <p>Last Update {{ textLastUpdate }}</p>
            <ButtonIcon icon-name="refresh" @click="onClickRefresh" class="pl-2" />
          </div>
        </div>
      </section>
    </div>

    <div class="container mx-auto p-4">
      <section class="pb-4">
        <p class="font-semibold text-lg pb-2">Hourly Forecast</p>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="item in listHourly" :key="item.date">
            <CardBase class="p-2 text-center !bg-gray-50">
              <img :src="item.icon" :alt="item.weather" class="mx-auto" />
              <p class="font-semibold">{{ item.temperature }}º C</p>
              <p class="font-light">{{ item.date }}</p>
            </CardBase>
          </div>
        </div>
      </section>

      <section>
        <p class="font-semibold text-lg pb-2">Weekly Forecast</p>
        <div class="grid grid-cols-1 gap-4">
          <div v-for="item in listWeeklyForecast" :key="item.date">
            <CardBase class="p-2 text-center background--mid-weather-card">
              <div class="flex justify-between">
                <div class="flex">
                  <img :src="item.icon" :alt="item.weather" class="mx-auto pr-2" />
                  <div class="text-left">
                    <p class="font-semibold">{{ item.day }}</p>
                    <p class="font-light">{{ item.weather }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <p class="font-semibold">{{ item.temperature }}º C</p>
                </div>
              </div>
            </CardBase>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import ButtonIcon from '@/components/shared/atoms/ButtonIcon.vue';
import type { DailyForecast, HourlyForecast } from '@/types/weather.types';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
// import mockCurrentWeather from '@/mocks/current-weather.mock.json';
// import mockWeeklyWeather from '@/mocks/weekly-weather.mock.json';
import type { GeoLocation } from '@/types/location.types';
import { useNavigation } from '@/composables/useNavigation';
import CardBase from '@/components/WeatherCards/atoms/CardBase.vue';

const route = useRoute();
const store = useStore();
const lat: number = Number(route.query.lat);
const lon: number = Number(route.query.lon);
const { state, city, country } = route.query;
const textDate = ref<string>('');
const textLastUpdate = ref<string>('');
const textWeather = ref<string>('');
const iconUrl = ref<string>('');
const textTemperature = ref<number | null>(null);
const listWeeklyForecast = ref<DailyForecast[]>([]);
const listHourly = ref<HourlyForecast[]>([]);
const { goHome } = useNavigation();

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const apiUrl = import.meta.env.VITE_OPENWEATHER_API_URL;

// TODO: refactor to separate API file services
// TODO: refactor proper types

// get hourly and weekly forecast
const getWeeklyForecast = async (lat: number, lon: number) => {
  console.log('getWeeklyForecast...');

  const url = `${apiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    // Loop through the result to get the daily forecast
    // TODO: fix `any` types
    listWeeklyForecast.value = (result.list as any[])
      // listWeeklyForecast.value = mockWeeklyWeather
      .filter((item: any) => item.dt_txt.includes('12:00:00'))
      .map((item: any): DailyForecast => {
        const day = dayjs.unix(item.dt).format('dddd');
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const weather = item.weather[0].description;
        const temperature = item.main.temp;

        return { day, icon, weather, temperature };
      });

    // Due to API limitation, get 3 hourly forecast for hourly section
    const today = dayjs().format('YYYY-MM-DD');
    // TODO: fix `any` types
    listHourly.value = (result.list as any[])
      // listHourly.value = mockWeeklyWeather
      .filter((item: any) => item.dt_txt.startsWith(today))
      .map((item: any) => {
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        const weather = item.weather[0].description;
        const temperature = item.main.temp;
        const date = dayjs(item.dt_txt).format('h:mm A');
        return { icon, weather, temperature, date };
      })
      .slice(0, 4); // return only four records based on mockup
  } catch (error: any) {
    console.error(error?.message);
  }
};

const getCityWeather = async (lat: number, lon: number) => {
  console.log('getCityWeather...');
  const url = `${apiUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`; // TODO: remove when using real API
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    // const result = mockCurrentWeather;

    textDate.value = dayjs().format('dddd, D MMMM YYYY');
    textLastUpdate.value = dayjs().format('h:mm A');
    textWeather.value = result.weather[0].description;
    iconUrl.value = `https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
    textTemperature.value = result.main.temp;
  } catch (error: any) {
    console.error(error?.message);
  }
};

const onClickRefresh = () => {
  getCityWeather(lat, lon);
  getWeeklyForecast(lat, lon);
};

const onClickPlus = () => {
  store.commit('weather/SET_CITY', {
    lat: lat as number,
    lon: lon as number,
    city: city as string,
    state: state as string,
    country: country as string,
    id: `${lat},${lon}`, // Unique track-by custom id key
    temprature: textTemperature.value,
    weather: textWeather.value,
    lastUpdate: textLastUpdate.value,
  });
};

const onClickDelete = () => {
  store.commit('weather/REMOVE_CITY', `${lat},${lon}`);
};

const isCityInRecords = computed(() => {
  // Check if city already exists in records
  const tmpId = `${lat},${lon}`;
  return store.state.weather.cities.some((c: GeoLocation) => c.id === tmpId);
});

onMounted(() => {
  getCityWeather(lat, lon);
  getWeeklyForecast(lat, lon);
});
</script>
<style lang="scss" scoped>
.background--detail-page {
  background: linear-gradient(118.25deg, #4f80fa 1.2%, #3764d7 59.26%, #335fd1 79.2%);
}
.background--mid-weather-card {
  background: #d2dfff;
}
</style>
