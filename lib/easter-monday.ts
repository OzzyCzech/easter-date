import {getEaster} from './easter-sunday.js';

/**
 * Returns the date of Easter Monday for a given year.
 * @param year
 */
export function getEasterMonday(year: number): Date {
	const date = getEaster(year);
	date.setDate(date.getDate() + 1);
	return date;
}

/**
 * Returns true if the given date is Easter Monday.
 * @param date
 */
export function isEasterMonday(date: Date): boolean {
	return date.getTime() === getEasterMonday(date.getFullYear()).getTime();
}
