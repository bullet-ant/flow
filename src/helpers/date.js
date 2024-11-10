function getDate() {
  const today = new Date();
  const options = { day: "2-digit", month: "short" };
  const formattedDate = today.toLocaleString("en-US", options);

  return formattedDate;
}

export default getDate;
