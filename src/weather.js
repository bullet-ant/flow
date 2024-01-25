import proxy from "./proxy.json";
import { fetchWeather, saveWeather } from "./storage";

const CACHE_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

async function getWeather() {
  try {
    const cachedWeather = await fetchWeather();

    if (cachedWeather && isWeatherCacheValid(cachedWeather)) {
      return processWeatherData(cachedWeather);
    }

    const weatherData = await fetchLiveWeather();

    weatherData["timestamp"] = new Date().getTime();

    await saveWeather(weatherData);

    return processWeatherData(weatherData);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error.message;
  }
}

function isWeatherCacheValid(cachedWeather) {
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - cachedWeather.timestamp;
  return timeDifference < CACHE_EXPIRATION_TIME;
}

async function fetchLiveWeather() {
  const weatherResponse = await fetch(`${proxy.endpoint}/weather`);

  if (!weatherResponse.ok) {
    throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
  }

  return weatherResponse.json();
}

function processWeatherData(weatherData) {
  const city = weatherData.name;
  const country = weatherData.sys.country;
  const id = weatherData.weather[0].id;
  const weather = weatherData.weather[0].main;
  const description = weatherData.weather[0].description;
  const temp = Math.round(Number(weatherData.main.temp) - 273.15);
  const icon = `https://openweathermap.org/img/wn/${getIcon(id)}@2x.png`;
  return { city, country, weather, temp, icon, description };
}

function getIcon(id) {
  const hours = new Date().getHours();

  if (id > 200 && id < 300) {
    return "11d";
  }
  if (id > 300 && id < 500) return "09d";
  if (id > 500 && id < 600) {
    if (id === 511) return "13d";
    if (id < 511) return "10d";
    if (id > 511) return "09d";
  }
  if (id > 600 && id < 700) return "13d";
  if (id > 700 && id < 800) return "50d";
  if (id === 800) {
    if (hours < 17) return "01d";
    else return "01n";
  }
  if (id === 801) {
    if (hours < 17) return "02d";
    else return "02n";
  }
  if (id === 802) {
    if (hours < 17) return "03d";
    else return "03n";
  }
  if (id === 803 || id === 804) {
    if (hours < 17) return "04d";
    else return "04n";
  }
}

export default getWeather;
