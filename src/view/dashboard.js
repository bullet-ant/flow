import { fetchName } from "../storage";
import { selectRandomWallpaper } from "../helpers/wallpaper";
import {
  setDay,
  setDate,
  setTime,
  setBackgroundImage,
  setGreetings,
  setQuote,
  setAffirmation,
} from "./render";

const AFFIRMATION_REFRESH_INTERVAL = 1000 * 30;
export async function setupDashboard() {
  let currentAffirmation = null;
  let name = await fetchName();
  if (!name) name = prompt("Enter your name");

  setDay();
  setDate();
  setTime();
  setBackgroundImage(selectRandomWallpaper());
  setGreetings(name);
  setQuote();

  setInterval(setTime, 1000);
  setInterval(() => {
    currentAffirmation = setAffirmation(name, currentAffirmation);
  }, AFFIRMATION_REFRESH_INTERVAL);
}
