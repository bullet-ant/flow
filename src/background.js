"use strict";

import getWeather from "./weather";
import { getUnsplashCollection, getViewLocation } from "./wallpaper";

// With background scripts you can communicate extension files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "WALLPAPER") {
    (async () => {
      const collections = await getUnsplashCollection();

      const index = Math.ceil(Math.random() * 10) % collections.length;
      const url = collections[index].url;
      const id = collections[index].id;
      const attributes = collections[index].attributes;

      const locationInfo = await getViewLocation(id);

      sendResponse({ id, location: locationInfo.location, url, attributes });
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
