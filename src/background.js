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

      const index =
        Math.ceil(Math.random() * collections.length) % collections.length;
      let url = collections[index].url;
      url = url + "&w=2160"; // This brings down the image size to 2K
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
