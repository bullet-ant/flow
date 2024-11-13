"use strict";

import "./app.css";

import { setupDashboard } from "./view/dashboard";
import { setBackgroundImage, setWeather } from "./view/render";

// MS * S * M
const WEATHER_REFRESH_INTERVAL = 1000 * 60 * 60;
const WALLPAPER_REFRESH_INTERVAL = 1000 * 60 * 3;

(function () {
  setupDashboard();

  (async () => {
    setInterval(async () => {
      const response = await chrome.runtime.sendMessage({
        type: "WALLPAPER",
      });
      setBackgroundImage(response);
    }, WALLPAPER_REFRESH_INTERVAL);
  })();

  (async () => {
    const response = await chrome.runtime.sendMessage({
      type: "WEATHER",
    });
    setWeather(response);

    setInterval(async () => {
      const response = await chrome.runtime.sendMessage({
        type: "WEATHER",
      });
      setWeather(response);
    }, WEATHER_REFRESH_INTERVAL);
  })();
  (async () => {
    await chrome.runtime.sendMessage({ type: "UPDATE" });
  })();
})();
