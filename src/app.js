"use strict";

import "./app.css";
import getCurrentTime from "./clock";
import getDay from "./day";
import getDate from "./date";
import greet from "./greet";
import getQuote from "./quote";
import getWallpaperIndex from "./wallpaper";
import { getName, saveName } from "./storage";

(function () {
  function setTime() {
    const time = getCurrentTime();

    document.getElementById("clock").innerHTML = time;
  }

  function setDay() {
    const day = getDay();

    document.getElementById("day").innerHTML = day;
  }

  function setDate() {
    const date = getDate();

    document.getElementById("date").innerHTML = date;
  }

  function setGreetings(name) {
    const message = greet(name.charAt(0).toUpperCase() + name.slice(1));

    document.getElementById("greet").innerHTML = message;

    saveName(name);
  }

  async function setQuote() {
    const res = await getQuote();

    document.getElementById("quote").innerHTML = `"${res.quote}"`;
  }

  async function setWeather(data) {
    document.getElementById("temperature").innerHTML = `${data.temp}&deg;C`;
    document.getElementById(
      "location"
    ).innerHTML = `${data.city}, ${data.country}`;
  }

  function setBackgroundImage(urls = []) {
    const background = getWallpaperIndex(urls);

    document.body.style.backgroundColor = "#333";

    const image = new Image();
    image.src = background.external
      ? urls[background.index]
      : `images/${background.index === 0 ? "morning.jpeg" : "night.jpeg"}`;

    image.onload = () => {
      document.body.style.backgroundImage = `url('${image.src}')`;
      document.body.style.transition = `background 0.5s ease-in`;
      document.body.style.backgroundColor = `transparent`;
    };
  }

  async function setupDashboard() {
    let name = await getName();
    if (!name) name = prompt("Enter your name");
    setDay();
    setDate();
    setTime();
    setBackgroundImage();
    setGreetings(name);
    setQuote();

    setInterval(setTime, 1000);
    setInterval(setGreetings, 60 * 60 * 1000);
    setInterval(setQuote, 12 * 60 * 60 * 1000);
  }

  setupDashboard();

  chrome.runtime.sendMessage(
    {
      type: "GREETINGS",
      payload: {
        message: "Hello, my name is Ove. I am from Override app.",
      },
    },
    (response) => {
      console.log(response.message);
    }
  );

  // Get background images from worker
  (async () => {
    let response = await chrome.runtime.sendMessage({
      type: "BACKGROUND",
      payload: {
        collection_id: "Ql7C2dPpjkw",
      },
    });

    setInterval(async () => {
      response = await chrome.runtime.sendMessage({
        type: "BACKGROUND",
        payload: {
          collection_id: "Ql7C2dPpjkw",
        },
      });
    }, 3 * 60 * 1000);

    setInterval(async () => {
      setBackgroundImage(response);
    }, 6 * 60 * 1000);
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
    }, 60 * 60 * 1000);
  })();
})();
