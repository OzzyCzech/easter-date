import {getEaster} from './easter-sunday.js';
import {isSameDay} from './date-fns.js';

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
	return isSameDay(date, getEasterMonday(date.getFullYear()));
}
