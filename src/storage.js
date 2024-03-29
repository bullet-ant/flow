export async function saveName(name) {
  chrome.storage.local.set({ name: name });
}

export async function fetchName() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["name"], (result) => {
      const name = result.name || null;
      resolve(name);
    });
  });
}

export async function saveWeather(weather) {
  weather["timestamp"] = new Date().getTime();
  chrome.storage.local.set({ weather: weather });
}

export async function fetchWeather() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["weather"], (result) => {
      const weather = result.weather || null;
      resolve(weather);
    });
  });
}

export async function saveAttribution(id) {
  const attribution = {};
  attribution[id] = true;
  chrome.storage.local.set(attribution);
}

export async function fetchAttribution(id) {
  return new Promise((resolve) => {
    chrome.storage.local.get([id], (result) => {
      resolve(result[id]);
    });
  });
}
