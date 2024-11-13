import getDay from "../helpers/day";
import greet from "../helpers/greet";
import getDate from "../helpers/date";
import { saveName } from "../storage";
import getQuote from "../helpers/quote";
import getCurrentTime from "../helpers/clock";
import getAffirmations from "../helpers/affirmations";

export function setTime() {
  const time = getCurrentTime();

  document.getElementById("clock").innerHTML = time;
}

export function setDay() {
  const day = getDay();

  document.getElementById("day").innerHTML = day;
}

export function setDate() {
  const date = getDate();

  document.getElementById("date").innerHTML = date;
}

export function setGreetings(name) {
  const message = greet(name.charAt(0).toUpperCase() + name.slice(1));

  document.getElementById("greet").innerHTML = message;

  saveName(name);
}

export async function setAffirmation(name, currentAffirmation) {
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

export async function setQuote() {
  const res = await getQuote();

  document.getElementById("quote-text").innerHTML = `"${res.quote}"`;
  document.getElementById("quote-author").innerHTML = `${res.author}`;
}

export async function setWeather(data) {
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

export async function setBackgroundImage(background) {
  const { url } = background;

  const image = new Image();
  image.src = url;

  image.onload = () => {
    document.body.style.transition = `background 4s ease-in-out`;
    document.body.style.backgroundImage = `url('${image.src}')`;
  };
}
