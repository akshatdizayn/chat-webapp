export const formatTime = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const timestampConverter = (timestamp) => {
  const date = new Date(
    typeof timestamp === "object" && "seconds" in timestamp
      ? timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      : timestamp
  );

  // Get hours and minutes
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Return the formatted time
  return hours + ":" + minutes + " " + ampm;
};
