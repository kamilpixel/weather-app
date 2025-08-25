# Weather App

A lightweight Vue 3 app that shows real-time weather using the **OpenWeather API**.

## Online preview

https://kamilpixel-weather-app.netlify.app/

## 🚀 How It Works

- Enter a city name.
- The app fetches weather data from OpenWeather.
- Temperature, conditions, and other details are displayed instantly.

## 🔑 Setup

1. Get a free API key from [OpenWeather](https://openweathermap.org/api).
2. Create a `.env` file in the project root:
   ```bash
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   VITE_OPENWEATHER_API_URL=https://api.openweathermap.org
   ```

## 📂 Project Setup

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit tests
npm run test

# Lint and fix code
npm run lint

# Format source code
npm run format

# Type-check the codebase
npm run type-check

# Build for production
npm run build
```
