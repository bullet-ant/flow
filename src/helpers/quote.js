import quotes from "../db/quotes.json";

async function getQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);

  const index = day % quotes.length;
  const { quote, author } = quotes[index];

  return { quote, author };
}

export default getQuote;
