import {getEaster} from './easter-sunday.js';

/**
 * Returns the date of Holy Saturday for a given year.
 * @param year
 */
export function getHolySaturday(year: number): Date {
	const date = getEaster(year);
	date.setDate(date.getDate() - 1);
	return date;
}

/**
 * Returns true if the given date is Holy Saturday.
 * @param date
 */
export function isHolySaturday(date: Date): boolean {
	const holySaturday = getHolySaturday(date.getFullYear());
	return date.getFullYear() === holySaturday.getFullYear()
		&& date.getMonth() === holySaturday.getMonth()
		&& date.getDate() === holySaturday.getDate();
}
