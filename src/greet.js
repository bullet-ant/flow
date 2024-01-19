function greet(name) {
  const date = new Date();
  const hours = date.getHours();

  let message = "";

  if (hours < 12) {
    message = "morning";
  } else if (hours > 12 && hours < 17) {
    message = "afternoon";
  } else {
    message = "evening";
  }

  return `Good ${message}, ${name}!`;
}

export default greet;
