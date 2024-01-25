"use strict";

import getWeather from "./weather";
import { getUnsplashCollection } from "./wallpaper";

// With background scripts you can communicate extension files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "WALLPAPER") {
    (async () => {
      const result = await getUnsplashCollection();
      sendResponse(result);
    })();

    return true;
  }

  if (request.type === "WEATHER") {
    (async () => {
      const result = await getWeather();
      sendResponse(result);
    })();

    return true;
  }
});
