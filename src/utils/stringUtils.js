// Function to generate a random string
export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
export function generateMemorablePIN(limit) {
  // Step 1: Generate two random digits
  const randomDigits = Array.from({ length: 2 }, () => Math.floor(Math.random() * 10));

  // Step 2: Memorable pattern
  const thirdDigit = randomDigits[Math.floor(Math.random() * randomDigits.length)] * 2;
  const fourthDigit = (thirdDigit + 1) % 10;

  // Step 3: Combine
  const pin = [...randomDigits, thirdDigit, fourthDigit];

  // Shuffle the PIN to add more randomness
  for (let i = pin.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pin[i], pin[j]] = [pin[j], pin[i]];
  }

  // Convert array to string
  let  pinStr = pin.join('');
  // Truncate the PIN if its length exceeds the limit
  if (limit && pinStr.length > limit) {
    pinStr = pinStr.slice(0, limit);
  }

  return pinStr
}

export function shortenFileName(fileName){
  return fileName?.length > 30
      ? `${fileName.substring(0, 10)}...${fileName.substring(fileName.length - 10)}`
      : fileName
}
export function convertMegabytes(megabytes, decimalPlaces = 0) {
  const sizes = ['MB', 'GB', 'TB'];

  let sizeIndex = 0;

  if (megabytes > 500 && sizes[sizeIndex] === 'MB') {
    megabytes /= 1000;
    sizeIndex++;
  }

  if (megabytes > 500 && sizes[sizeIndex] === 'GB') {
    megabytes /= 1000;
    sizeIndex++;
  }

  return `${megabytes.toFixed(decimalPlaces)} ${sizes[sizeIndex]}`;
}
export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export function convertToGoogleMapsURL(inputString) {
  const baseURL = "https://www.google.com/maps/search/?api=1&data=!3m1!1e3!5m2!1e4!1e2&query=";
  // Replace spaces with plus signs
  const formattedString = inputString.replace(/\s+/g, '+');
  return baseURL + formattedString;
}

export const  convert24To12HourFormat = (inputTime) =>{
  // Parse the input time string
  const [hours, minutes] = inputTime.split(':');
  // Convert hours to 12-hour format
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  // Determine whether it's AM or PM
  const period = hours < 12 ? 'AM' : 'PM';
  // Create the formatted time string
  const formattedTime = `${formattedHours}:${minutes} ${period}`;
  return formattedTime;
}

export const  display24to12formatThrough = (inputTime,duration/* in hours */) =>{
  // console.log("input")
  // console.log(inputTime)
  // console.log("duration")
  // console.log(duration)
  let startTime = convert24To12HourFormat(inputTime);
  let endTime = new Date(inputTime);
  let convertedDuration = duration * 60 * 60 * 1000;
  endTime.setHours(endTime.getHours() + duration);

  let  [hours, minutes] = inputTime.split(':');
  // convert string to numbers
  hours = parseInt(hours);
  minutes = parseInt(minutes);

  hours=hours+duration;  
  // console.log(hours)
  if(hours>=24){
    // console.log(hours)
    hours = hours - 24;
    // console.log(hours)
  }
  // Convert hours to 12-hour format
  const formattedHours = (hours) % 12 === 0 ? 12 : (hours) % 12;
  // Determine whether it's AM or PM
  const period = hours < 12 ? 'AM' : 'PM';

  // Format the date in the desired format
  let formattedTime = `${startTime} - ${formattedHours}:${minutes} ${period}`;

  
  return formattedTime;
}

export const  convertDateFormat=(inputDateString) =>{
  // Parse the input date string
  const inputDate = new Date(inputDateString);

  // Format the date in the desired format
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = inputDate.toLocaleDateString('en-US', options);

  return formattedDate;
}
export const  convertDateFormatMDY=(inputDateString) =>{
  // Parse the input date string
  const inputDate = new Date(inputDateString);

  // Format the date in the desired format
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = inputDate.toLocaleDateString('en-US', options);

  return formattedDate;
}
export const  convertDateFormatDay=(inputDateString) =>{
  // Parse the input date string
  const inputDate = new Date(inputDateString);

  // Format the date in the desired format
  const options = {weekday: 'long'};
  const formattedDate = inputDate.toLocaleDateString('en-US', options);

  return formattedDate;
}
