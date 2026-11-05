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

/**
 * Returns midnight UTC of a calendar day. The day may overflow the month
 * (`day + offset`). Unlike `Date.UTC()`, keeps years 0–99.
 */
export function utcMidnight(year: number, month: number, day: number): Date {
	const date = new Date(0);
	date.setUTCFullYear(year, month - 1, day);
	return date;
}

/** Reads the calendar date of a `Date` at midnight UTC. */
export function toPlainDate(date: Date): PlainDateLike {
	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth() + 1,
		day: date.getUTCDate(),
	};
}

/**
 * Reads the calendar day of an `is*()` argument: the local day of a `Date`,
 * or the fields of a {@link PlainDateLike}.
 */
export function readCalendarDay(input: Date | PlainDateLike): PlainDateLike {
	return input instanceof Date
		? {
				year: input.getFullYear(),
				month: input.getMonth() + 1,
				day: input.getDate(),
			}
		: input;
}
