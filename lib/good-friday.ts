import { getEaster } from "./easter-sunday.js";

/**
 * Returns the date of Good Friday for a given year.
 * @param year
 */
export function getGoodFriday(year: number): Date {
	const date = getEaster(year);
	date.setDate(date.getDate() - 2);
	return date;
}

/**
 * Returns true if the given date is Good Friday.
 * @param date
 */
export function isGoodFriday(date: Date): boolean {
	const goodFriday = getGoodFriday(date.getFullYear());
	return (
		date.getFullYear() === goodFriday.getFullYear() &&
		date.getMonth() === goodFriday.getMonth() &&
		date.getDate() === goodFriday.getDate()
	);
}
