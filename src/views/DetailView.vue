<template>
  <section>
    <p>{{ city }}</p>
    <p>{{ textDate }}</p>
    <img :src="iconUrl" alt="Weather Icon" />
    <p>{{ textTemperature }}º C</p>
    <p>{{ textWeather }}</p>
    <p>Last Update {{ textLastUpdate }}</p>
    <button @click="onClickRefresh">refresh</button>
    <br />
    <hr />
  </section>
  <section>
    <h1>Hourly Forecast</h1>
    <div style="display: flex">
      <div
        v-for="item in listHourly"
        :key="item.date"
        style="border: 1px solid blue; width: 100px; height: 200px; margin-bottom: 5px"
      >
        <img :src="item.icon" alt="Weather Icon" />
        <p>{{ item.date }}</p>
        <p>{{ item.temperature }}º C</p>
        <p>{{ item.weather }}</p>
      </div>
    </div>

    <br />
    <hr />
  </section>
  <section>
    <h1>Weekly Forecast</h1>
    <div
      v-for="item in listWeeklyForecast"
      :key="item.date"
      style="border: 1px solid red; width: 100px; height: 200px; margin-bottom: 5px"
    >
      <img :src="item.icon" alt="Weather Icon" />
      <p>{{ item.day }}</p>
      <p>{{ item.temperature }}º C</p>
      <p>{{ item.weather }}</p>
    </div>
    <br />
    <hr />
  </section>
</template>
<script lang="ts" setup>
import type { DailyForecast, HourlyForecast } from '@/types/weather.types';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
// import mockCurrentWeather from '@/mocks/current-weather.mock.json';
// import mockWeeklyWeather from '@/mocks/weekly-weather.mock.json';

const route = useRoute();
const lat: number = Number(route.query.lat);
const lon: number = Number(route.query.lon);
const city = route.query.city;
const textDate = ref<string>('');
const textLastUpdate = ref<string>('');
const textWeather = ref<string>('');
const iconUrl = ref<string>('');
const textTemperature = ref<number | null>(null);
const listWeeklyForecast = ref<DailyForecast[]>([]);
const listHourly = ref<HourlyForecast[]>([]);

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

// TODO: refactor to separate API file services
// TODO: refactor proper types

// get hourly and weekly forecast
const getWeeklyForecast = async (lat: number, lon: number) => {
  console.log('getWeeklyForecast...');

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    // Loop through the result to get the daily forecast
    // TODO: fix `any` types
    listWeeklyForecast.value = (result.list as any[])
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
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();

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

onMounted(() => {
  getCityWeather(lat, lon);
  getWeeklyForecast(lat, lon);
});
</script>
