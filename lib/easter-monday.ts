import { getEaster } from "./easter-sunday.js";

/**
 * Returns the date of Easter Monday for a given year.
 *
 * @example Get the date of Easter Monday for the year 2023
 * ```ts
 * import { getEasterMonday } from "easter-date";
 * const easterMonday = getEasterMonday(2023);
 * console.log(easterMonday); // 2023-04-10T00:00
 * ```
 * @param year
 */
export function getEasterMonday(year: number): Date {
	const date = getEaster(year);
	date.setDate(date.getDate() + 1);
	return date;
}

/**
 * Returns true if the given date is Easter Monday.
 * @example Check if a date is Easter Monday
 * ```ts
 * import { isEasterMonday } from "easter-date";
 * const date = new Date("2023-04-10");
 * console.log(isEasterMonday(date)); // true
 * ```
 * @param date
 */
export function isEasterMonday(date: Date): boolean {
	const easterMonday = getEasterMonday(date.getFullYear());
	return (
		date.getFullYear() === easterMonday.getFullYear() &&
		date.getMonth() === easterMonday.getMonth() &&
		date.getDate() === easterMonday.getDate()
	);
}
