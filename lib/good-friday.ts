import {getEaster} from './easter-sunday.js';
import {isSameDay} from './date-fns.js';

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
	return isSameDay(date, getGoodFriday(date.getFullYear()));
}
