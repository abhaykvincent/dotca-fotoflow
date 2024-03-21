export const countdownTo = (targetDate) => {
	// Parse the target date string
	const targetDateTime = new Date(targetDate).getTime();

	// Get the current date and time
	const currentDate = new Date().getTime();

	// Calculate the time difference
	const timeDifference = targetDateTime - currentDate;

	// Check if the target date is today
	const isToday = new Date(targetDateTime).toDateString() === new Date(currentDate).toDateString();

	// Calculate the days, hours, minutes, and seconds
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

	// Determine whether the countdown is in the past or future
	const suffix = timeDifference < 0 ? "Ago" : "to go";

	// Construct the countdown string
	let countdownString;

	if (isToday) {
		countdownString = "Today";
	} else if (timeDifference < 0) {
		countdownString = `${Math.abs(days)} days Ago`;
	} else {
		countdownString = `In ${days} days`;
	}

	return countdownString;
}
  