/**
 * A calendar date without a time or a time zone. `month` is 1-based
 * (1 = January), as in `Temporal.PlainDate`.
 *
 * The `get*PlainDate()` functions return plain objects of this shape, which
 * `Temporal.PlainDate.from()` accepts. The `is*()` functions accept any object
 * with these fields, including a `Temporal.PlainDate` in the ISO calendar.
 *
 * @example
 * ```ts
 * import { getEasterPlainDate, isEaster } from "easter-date";
 * getEasterPlainDate(2024); // { year: 2024, month: 3, day: 31 }
 * isEaster({ year: 2024, month: 3, day: 31 }); // true
 * ```
 */
export type PlainDateLike = {
	year: number;
	month: number;
	day: number;
};

// Internal helpers below. The package entry point exports only the type.

/** Midnight UTC of a calendar day. Unlike `Date.UTC()`, keeps years 0–99. */
function utcMidnight(year: number, month: number, day: number): Date {
	const date = new Date(0);
	date.setUTCFullYear(year, month - 1, day);
	return date;
}

/** Converts a calendar date to a `Date` at midnight UTC of that day. */
export function toDate(date: PlainDateLike): Date {
	return utcMidnight(date.year, date.month, date.day);
}

/** Returns the calendar date `days` days after `date` (before, if negative). */
export function addDays(date: PlainDateLike, days: number): PlainDateLike {
	const shifted = utcMidnight(date.year, date.month, date.day + days);
	return {
		year: shifted.getUTCFullYear(),
		month: shifted.getUTCMonth() + 1,
		day: shifted.getUTCDate(),
	};
}

/**
 * Returns true if `date` is the day that `getDay()` returns for its year.
 * A `Date` is read as its local calendar day, anything else by its fields.
 */
export function isDay(
	date: Date | PlainDateLike,
	getDay: (year: number) => PlainDateLike,
): boolean {
	const { year, month, day } =
		date instanceof Date
			? {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					day: date.getDate(),
				}
			: date;
	const target = getDay(year);
	return year === target.year && month === target.month && day === target.day;
}
