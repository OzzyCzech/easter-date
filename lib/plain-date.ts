/**
 * A calendar date without a time or a time zone, in the ISO (Gregorian)
 * calendar. The fields are integers and `month` is 1-based (1 = January), as
 * in `Temporal.PlainDate`.
 *
 * The `get*PlainDate()` functions return plain objects of this shape, which
 * `Temporal.PlainDate.from()` accepts. The `is*()` functions accept any object
 * with these fields. A Temporal object (`PlainDate`, `ZonedDateTime`, …) in
 * another calendar is converted to the ISO calendar first.
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

/** A Temporal date object (`PlainDate`, `ZonedDateTime`, …) has a calendar. */
type WithCalendar = PlainDateLike & {
	withCalendar?: (calendar: "iso8601") => PlainDateLike;
};

/**
 * Reads the calendar day of an `is*()` argument: the local day of a `Date`,
 * or the ISO year, month and day of a {@link PlainDateLike}.
 *
 * @throws {TypeError} for anything else, including an invalid `Date`.
 */
export function readCalendarDay(input: Date | PlainDateLike): PlainDateLike {
	if (typeof input === "object" && input !== null) {
		const { year, month, day } = calendarFields(input);
		if (
			Number.isInteger(year) &&
			Number.isInteger(month) &&
			Number.isInteger(day)
		) {
			return { year, month, day };
		}
	}
	throw new TypeError(
		"Expected a valid Date or a { year, month, day } object with integer fields",
	);
}

function calendarFields(input: Date | PlainDateLike): PlainDateLike {
	// Not instanceof: a Date from another realm (a vm context, an iframe) is
	// not an instance of this realm's Date.
	if (typeof (input as Date).getFullYear === "function") {
		const date = input as Date;
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
		};
	}
	// A Temporal object carries its calendar: read the ISO date, not e.g. the
	// Buddhist year 2567.
	const temporal = input as WithCalendar;
	if (typeof temporal.withCalendar === "function") {
		return temporal.withCalendar("iso8601");
	}
	return input as PlainDateLike;
}
