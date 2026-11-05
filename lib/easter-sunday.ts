import { easterDay, isEasterDay } from "./computus.js";
import { type PlainDateLike, toPlainDate } from "./plain-date.js";

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
	return toPlainDate(getEaster(year));
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
	return easterDay(year, 0);
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
	return isEasterDay(date, 0);
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
