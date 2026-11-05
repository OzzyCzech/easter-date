// Internal: the Easter calculation. The package entry point does not export it.
import {
	type PlainDateLike,
	readCalendarDay,
	utcMidnight,
} from "./plain-date.js";

/**
 * Returns the calendar date of Easter Sunday in the Gregorian calendar
 * (anonymous Gregorian algorithm, after Meeus, Jones and Butcher).
 */
export function easterSunday(year: number): PlainDateLike {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = ((h + l - 7 * m + 114) % 31) + 1;

	return { year, month, day };
}

/**
 * Returns the day `offset` days after Easter Sunday of `year` (before it, if
 * negative), as a `Date` at midnight UTC.
 */
export function easterDay(year: number, offset: number): Date {
	const easter = easterSunday(year);
	return utcMidnight(easter.year, easter.month, easter.day + offset);
}

/**
 * Returns true if `input` is the day `offset` days after Easter Sunday of its
 * year: the local day of a `Date`, or the fields of a {@link PlainDateLike}.
 */
export function isEasterDay(
	input: Date | PlainDateLike,
	offset: number,
): boolean {
	const { year, month, day } = readCalendarDay(input);
	const date = easterDay(year, offset);
	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() + 1 === month &&
		date.getUTCDate() === day
	);
}
