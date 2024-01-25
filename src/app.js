"use strict";

import "./app.css";
import getCurrentTime from "./clock";
import getDay from "./day";
import getDate from "./date";
import greet from "./greet";
import getQuote from "./quote";
import getWallpaperIndex from "./wallpaper";
import { fetchName, saveName } from "./storage";
import getAffirmations from "./affirmations";

const WALLPAPER_REFRESH_TIME = 30 * 60 * 1000; // 30 minutes
const WALLPAPER_LIST_REFRESH_TIME = 3 * 60 * 60 * 1000; // 3 hour
const WEATHER_REFRESH_TIME = 60 * 60 * 1000; // 1 hour
const GREETINGS_REFRESH_TIME = 60 * 60 * 1000; // 1 hour
const AFFIRMATION_REFRESH_TIME = 30 * 1000; // 30 seconds
const QUOTES_REFRESH_TIME = 10 * 1000; // 1 day

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

  async function setAffirmation(name) {
    const greetElement = document.getElementById("greet");

    greetElement.classList.remove("greeting");
    greetElement.classList.add("greeting-fade-out");

    let message = "";
    const affirmation = await getAffirmations();

    if (affirmation.long) message = `${affirmation.affirmation}.`;
    else
      message = `${affirmation.affirmation}, ${
        name.charAt(0).toUpperCase() + name.slice(1)
      }.`;

    setTimeout(() => {
      greetElement.innerHTML = message;
      greetElement.classList.remove("greeting-fade-out");
      greetElement.classList.add("greeting");
    }, 1000);
  }

  async function setQuote() {
    const res = await getQuote();

    document.getElementById("quote-text").innerHTML = `"${res.quote}"`;
    document.getElementById("quote-author").innerHTML = `${res.author}`;
  }

  async function setWeather(data) {
    const weatherIcon = document.createElement("img");
    weatherIcon.src = data.icon;
    weatherIcon.alt = "Weather Icon";
    weatherIcon.style.width = "2rem";
    weatherIcon.style.height = "2rem";
    const container = document.getElementById("weather-icon");

    container.innerHTML = "";
    container.appendChild(weatherIcon);

    document.getElementById("temperature").innerHTML = `${data.temp}&deg;C`;
    document.getElementById("weather-description").innerHTML = `${
      data.description[0].toUpperCase() + data.description.slice(1)
    }`;

    document.getElementById(
      "weather"
    ).style.transition = `opacity 0.4s cubic-bezier(0.4, 0, 1, 1)`;
    document.getElementById("weather").style.opacity = 1;
  }

  function setBackgroundImage(urls = []) {
    const background = getWallpaperIndex(urls);

    const image = new Image();
    image.src = background.external
      ? urls[background.index]
      : `images/${background.index === 0 ? "morning.jpg" : "night.jpg"}`;

    image.onload = () => {
      document.body.style.transition = `background 6s ease-in-out`;
      document.body.style.backgroundImage = `url('${image.src}')`;
    };
  }

  async function setupDashboard() {
    let name = await fetchName();
    if (!name) name = prompt("Enter your name");
    setDay();
    setDate();
    setTime();
    setBackgroundImage();
    setGreetings(name);
    setQuote();

    setInterval(setTime, 1000);
    setInterval(() => {
      setAffirmation(name);
    }, AFFIRMATION_REFRESH_TIME);
    setInterval(() => {
      setGreetings(name);
    }, GREETINGS_REFRESH_TIME);
    setInterval(setQuote, QUOTES_REFRESH_TIME);
  }

  setupDashboard();

  (async () => {
    let response = await chrome.runtime.sendMessage({
      type: "WALLPAPER",
      payload: {
        collection_id: "Ql7C2dPpjkw",
      },
    });

    setInterval(async () => {
      response = await chrome.runtime.sendMessage({
        type: "WALLPAPER",
      });
    }, WALLPAPER_LIST_REFRESH_TIME);

    setInterval(async () => {
      setBackgroundImage(response);
    }, WALLPAPER_REFRESH_TIME);
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
    }, WEATHER_REFRESH_TIME);
  })();
})();
