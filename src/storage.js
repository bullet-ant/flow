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

export async function saveImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  reader.onloadend = function () {
    const base64data = reader.result;
    chrome.storage.local.set({ image: base64data }, function () {});
  };

  reader.readAsDataURL(blob);
}

export async function fetchImage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["image"], (result) => {
      const base64data = result.image || null;
      resolve(base64data);
    });
  });
}
