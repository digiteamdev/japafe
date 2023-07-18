export function monthDiff(firstMonth: any, lastMonth: any) {
	let months;
	months = (lastMonth.getFullYear() - firstMonth.getFullYear()) * 12;
	months -= firstMonth.getMonth();
	months += lastMonth.getMonth();
	return months <= 0 ? 0 : months;
}

export function getMonthName(month: any) {
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	return monthNames[month];
}

export function dayDiff(startDate: any, endDate: any) {
	const difference =
		new Date(endDate).getTime() - new Date(startDate).getTime();
	const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
	return days;
}

export function countDay(startDate: any, endDate: any) {
	let Duration_In_Time =
		new Date(endDate).getTime() - new Date(startDate).getTime();
	let Duration_In_Days = Duration_In_Time / (1000 * 3600 * 24);
	let durationDay = Math.round(Duration_In_Days) + 1;
	return durationDay
}
