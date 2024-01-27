"use strict";

import "./app.css";
import getCurrentTime from "./clock";
import getDay from "./day";
import getDate from "./date";
import greet from "./greet";
import getQuote from "./quote";
import {
  fetchAttribution,
  fetchName,
  saveAttribution,
  saveName,
} from "./storage";
import getAffirmations from "./affirmations";
import defaultWallpapers from "./default-wallpapers.json";

const WALLPAPER_REFRESH_TIME = 3 * 60 * 1000; // 3 minutes
const WEATHER_REFRESH_TIME = 60 * 60 * 1000; // 1 hour
const AFFIRMATION_REFRESH_TIME = 30 * 1000; // 30 seconds

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

  async function setAffirmation(name, currentAffirmation) {
    const greetElement = document.getElementById("greet");

    greetElement.classList.remove("greeting");
    greetElement.classList.add("greeting-fade-out");

    let message = "";
    const affirmation = await getAffirmations(currentAffirmation);

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

    return affirmation.affirmation;
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

  async function updateAttribution(location, existing) {
    const attributes = document.getElementById("attribute");
    const photoLocation = document.createElement("p");
    if (!existing) {
      photoLocation.style.opacity = 0;
      photoLocation.style.animation = "fade-in 1.2s ease forwards";
    }
    photoLocation.id = "photo-location";
    photoLocation.innerHTML = location;
    photoLocation.style.marginBottom = "0.2rem";

    attributes.insertBefore(photoLocation, attributes.firstChild);
  }

  function createGuessLocationElement() {
    const existingGuessLocation = document.getElementById("guess-location");

    if (existingGuessLocation) existingGuessLocation.remove();

    const guessLocationDiv = document.createElement("div");
    guessLocationDiv.className = "guess-location";
    guessLocationDiv.id = "guess-location";

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "guess-location-input";
    inputElement.id = "guess-location-input";

    const guessParagraph = document.createElement("p");
    guessParagraph.id = "guess";
    guessParagraph.textContent = "Guess this location?";

    guessLocationDiv.appendChild(inputElement);
    guessLocationDiv.appendChild(guessParagraph);

    document.body.appendChild(guessLocationDiv);
  }

  function createAttributesElement(attributes) {
    const existingGuessLocation = document.getElementById("guess-location");
    if (existingGuessLocation) existingGuessLocation.remove();

    const existingAttributesDiv = document.getElementById("attribute");
    if (existingAttributesDiv) existingAttributesDiv.remove();

    const attributesDiv = document.createElement("div");
    attributesDiv.className = "attribute";
    attributesDiv.id = "attribute";

    const imageAttribute = document.createElement("a");
    imageAttribute.href = attributes.image;
    imageAttribute.textContent = "Unsplash";

    const userAttribute = document.createElement("a");
    userAttribute.href = attributes.user.link;
    userAttribute.textContent = attributes.user.name;

    attributesDiv.innerHTML =
      userAttribute.outerHTML + " | " + imageAttribute.outerHTML;

    document.body.appendChild(attributesDiv);
  }

  function celebrate() {
    let canvas = document.createElement("canvas");
    canvas.height = innerHeight * 2;
    canvas.width = innerWidth * 2;
    let container = document.getElementById("celebrate");

    container.appendChild(canvas);

    let celebration = confetti.create(canvas);
    celebration({
      angle: 55,
    }).then(() => container.removeChild(canvas));
  }

  async function setBackgroundImage(external, background) {
    let id, url, location, attributes;

    if (external) {
      ({ id, url, location, attributes } = background);
    } else {
      const hours = new Date().getHours();
      let background = {};
      if (hours > 4 && hours < 12) {
        background = defaultWallpapers.morning;
      } else if (hours >= 12 && hours <= 16) {
        background = defaultWallpapers.afternoon;
      } else {
        background = defaultWallpapers.night;
      }
      ({ id, url, location, attributes } = background);
    }

    const image = new Image();
    image.src = url;
    image.onload = async () => {
      document.body.style.transition = `background 5s ease-in-out`;
      document.body.style.backgroundImage = `url('${image.src}')`;

      createAttributesElement(attributes);

      const alreadyAttributed = await fetchAttribution(id);
      if (alreadyAttributed) {
        updateAttribution(location.name, true);
        return;
      }

      createGuessLocationElement();

      // Events when user guesses a location
      const input = document.getElementById("guess-location-input");
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const guess = e.target.value;
          const searchSpace = [
            location.city?.toLowerCase(),
            location.country?.toLowerCase(),
            ...location.name
              ?.split(",")
              .map((part) => part.trim().toLowerCase()),
          ];
          console.log(searchSpace);

          if (searchSpace.includes(guess.toLowerCase())) {
            updateAttribution(location.name, false);
            document.getElementById("guess-location").remove();
            celebrate();
            saveAttribution(id);
          } else {
            const guessMessage = document.getElementById("guess");
            guessMessage.innerHTML = "Try again!";
            input.select();

            setTimeout(() => {
              guessMessage.innerHTML = "Guess the location?";
            }, 5000);
          }
        }
      });
    };
  }

  async function setupDashboard() {
    let currentAffirmation = null;
    let name = await fetchName();
    if (!name) name = prompt("Enter your name");

    setDay();
    setDate();
    setTime();
    setBackgroundImage(false, []);
    setGreetings(name);
    setQuote();

    setInterval(setTime, 1000);
    setInterval(() => {
      currentAffirmation = setAffirmation(name, currentAffirmation);
    }, AFFIRMATION_REFRESH_TIME);
  }

  setupDashboard();

  (async () => {
    setInterval(async () => {
      const response = await chrome.runtime.sendMessage({
        type: "WALLPAPER",
      });
      setBackgroundImage(true, response);
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
