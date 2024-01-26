import list from "./affirmations.json";
async function getAffirmations(currentAffirmation) {
  const affirmations = list.affirmations;
  let index = Math.ceil(Math.random() * 10) % affirmations.length;
  if (affirmations[index] === currentAffirmation) {
    if (index === affirmations.length) index = 0;
    else index += 1;
  }
  const affirmation = affirmations[index];

  return {
    long: affirmation.split(" ").length > 3 ? true : false,
    affirmation,
  };
}

export default getAffirmations;
