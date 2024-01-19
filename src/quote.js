// quote.js
import quotes from "./quotes.json";

async function getQuote() {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const randomIndex = (date * month) % quotes.length;
  const { quote, author } = quotes[randomIndex];

  return { quote, author };
}

export default getQuote;
