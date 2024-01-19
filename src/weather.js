import proxy from "./proxy.json";

function getWeather() {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch IP address
      const ipResponse = await fetch("https://api64.ipify.org/?format=json");
      
      if (!ipResponse.ok) {
        throw new Error(`HTTP error! Status: ${ipResponse.status}`);
      }

      const ip = await ipResponse.json();

      // Fetch live weather information
      const weatherResponse = await fetch(`${proxy.endpoint}/weather?ip=${ip.ip}`);

      if (!weatherResponse.ok) {
        throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      const city = weatherData.name;
      const country = weatherData.sys.country;
      const weather = weatherData.weather[0].main;
      const temp = Math.round(Number(weatherData.main.temp) - 273.15);

      resolve({ city, country, weather, temp });
    } catch (error) {
      console.error("Error fetching data:", error);
      reject(error.message);
    }
  });
}

export default getWeather;
