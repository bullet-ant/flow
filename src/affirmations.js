import list from "./affirmations.json";
async function getAffirmations() {
  const affirmations = list.affirmations;
  const index = Math.ceil(Math.random() * 10) % affirmations.length;
  const affirmation = affirmations[index];

  return {
    long: affirmation.split(" ").length > 3 ? true : false,
    affirmation,
  };
}

export default getAffirmations;
