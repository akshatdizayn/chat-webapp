// To handle all three types of timestamps
// ("11 April 2024 at 11:43:48 UTC+5:30", "2024-04-11T06:31:55.884Z", and "1712817120983"),
//  you can modify the function as follows:
export const timestampConverter = (timestamp) => {
  let date;

  if (typeof timestamp === "object" && "seconds" in timestamp) {
    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else if (typeof timestamp === "string") {
    if (timestamp.includes("T")) {
      date = new Date(timestamp);
    } else if (!isNaN(timestamp)) {
      date = new Date(Number(timestamp));
    } else {
      date = new Date(timestamp.replace(" at ", " "));
    }
  } else {
    date = new Date(timestamp);
  }

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
