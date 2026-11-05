import { isDay, type PlainDateLike, toDate } from "./plain-date.js";

/**
 * Returns the calendar date of Easter Sunday for a given year, without a time
 * or a time zone. `month` is 1-based.
 *
 * @example Get the calendar date of Easter Sunday
 * ```ts
 * import { getEasterPlainDate } from "easter-date";
 * getEasterPlainDate(2024); // { year: 2024, month: 3, day: 31 }
 * Temporal.PlainDate.from(getEasterPlainDate(2024)).toString(); // "2024-03-31"
 * ```
 * @param year
 */
export function getEasterPlainDate(year: number): PlainDateLike {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4; // eslint-disable-line unicorn/prevent-abbreviations
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
 * Returns the date of Easter Sunday for a given year as a `Date` at
 * **midnight UTC**. Same as {@link getEasterSunday}.
 *
 * Read the result in UTC: `toISOString()`, the `getUTC*()` methods or
 * `timeZone: "UTC"`. Local getters show the previous day west of UTC. For a
 * calendar date without a time zone, use {@link getEasterPlainDate}.
 *
 * @example Get Easter date for a given year
 * ```ts
 * import { getEaster } from "easter-date";
 * getEaster(2023).toISOString(); // "2023-04-09T00:00:00.000Z"
 * ```
 * @param year
 */
export function getEaster(year: number): Date {
	return toDate(getEasterPlainDate(year));
}

/**
 * Returns true if the given date is Easter Sunday.
 *
 * A `Date` is read as its **local** calendar day (`getFullYear()`,
 * `getMonth()`, `getDate()`). A {@link PlainDateLike}, such as
 * `Temporal.PlainDate`, is compared by its fields, with no time zone involved.
 *
 * West of UTC, a `Date` at midnight UTC, e.g. `new Date("2024-03-31")` or a
 * result of {@link getEaster}, is the previous local day. Pass a calendar date
 * from {@link getEasterPlainDate} to check it in any time zone.
 *
 * @example Check if a date is Easter Sunday
 * ```ts
 * import { isEaster } from "easter-date";
 * isEaster(new Date(2024, 2, 31)); // true (local date, month is 0-based)
 * isEaster({ year: 2024, month: 3, day: 31 }); // true
 * isEaster(Temporal.PlainDate.from("2024-03-31")); // true
 * ```
 * @param date
 */
export function isEaster(date: Date | PlainDateLike): boolean {
	return isDay(date, getEasterPlainDate);
}

/**
 * Returns the date of Easter Sunday for a given year as a `Date` at
 * midnight UTC. Alias for {@link getEaster}.
 * @param year
 */
export function getEasterSunday(year: number): Date {
	return getEaster(year);
}

/**
 * Returns true if the given date is Easter Sunday. Alias for
 * {@link isEaster}.
 * @param date
 */
export function isEasterSunday(date: Date | PlainDateLike): boolean {
	return isEaster(date);
}
