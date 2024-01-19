"use strict";

import getWeather from "./weather";
import { getUnsplashCollection } from "./wallpaper";

// With background scripts you can communicate extension files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GREETINGS") {
    const message = `Hi Ove, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }

  if (request.type === "BACKGROUND") {
    (async () => {
      const result = await getUnsplashCollection(request.payload.collection_id);
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
