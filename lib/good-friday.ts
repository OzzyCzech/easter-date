import { easterDay, isEasterDay } from "./computus.js";
import { type PlainDateLike, toPlainDate } from "./plain-date.js";

/**
 * Returns the calendar date of Good Friday for a given year, without a time
 * or a time zone. `month` is 1-based.
 *
 * @example
 * ```ts
 * import { getGoodFridayPlainDate } from "easter-date";
 * getGoodFridayPlainDate(2024); // { year: 2024, month: 3, day: 29 }
 * ```
 * @param year
 */
export function getGoodFridayPlainDate(year: number): PlainDateLike {
	return toPlainDate(getGoodFriday(year));
}

/**
 * Returns the date of Good Friday for a given year as a `Date` at
 * **midnight UTC**. Read it in UTC (`toISOString()`, `getUTC*()`,
 * `timeZone: "UTC"`), or use {@link getGoodFridayPlainDate}.
 *
 * @example
 * ```ts
 * import { getGoodFriday } from "easter-date";
 * getGoodFriday(2024).toISOString(); // "2024-03-29T00:00:00.000Z"
 * ```
 * @param year
 */
export function getGoodFriday(year: number): Date {
	return easterDay(year, -2);
}

/**
 * Returns true if the given date is Good Friday.
 *
 * A `Date` is read as its **local** calendar day. A {@link PlainDateLike},
 * such as `Temporal.PlainDate`, is compared by its fields.
 *
 * @example
 * ```ts
 * import { isGoodFriday } from "easter-date";
 * isGoodFriday(new Date(2024, 2, 29)); // true (local date, month is 0-based)
 * isGoodFriday({ year: 2024, month: 3, day: 29 }); // true
 * ```
 * @param date
 */
export function isGoodFriday(date: Date | PlainDateLike): boolean {
	return isEasterDay(date, -2);
}
