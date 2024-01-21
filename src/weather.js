import proxy from "./proxy.json";
import { fetchWeather, saveWeather } from "./storage";

const CACHE_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

async function getWeather() {
  try {
    const cachedWeather = await fetchWeather();

    if (cachedWeather && isWeatherCacheValid(cachedWeather)) {
      return processWeatherData(cachedWeather);
    }

    const ip = await getIpAddress();
    const weatherData = await fetchLiveWeather(ip);

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

async function getIpAddress() {
  const ipResponse = await fetch("https://api64.ipify.org/?format=json");

  if (!ipResponse.ok) {
    throw new Error(`HTTP error! Status: ${ipResponse.status}`);
  }

  const ipData = await ipResponse.json();
  return ipData.ip;
}

async function fetchLiveWeather(ip) {
  const weatherResponse = await fetch(`${proxy.endpoint}/weather?ip=${ip}`);

  if (!weatherResponse.ok) {
    throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
  }

  return weatherResponse.json();
}

function processWeatherData(weatherData) {
  const city = weatherData.name;
  const country = weatherData.sys.country;
  const weather = weatherData.weather[0].main;
  const temp = Math.round(Number(weatherData.main.temp) - 273.15);

  return { city, country, weather, temp };
}

export default getWeather;
