import { easterDay, isEasterDay } from "./computus.js";
import { type PlainDateLike, toPlainDate } from "./plain-date.js";

/**
 * Returns the calendar date of Holy Saturday for a given year, without a time
 * or a time zone. `month` is 1-based.
 *
 * @example
 * ```ts
 * import { getHolySaturdayPlainDate } from "easter-date";
 * getHolySaturdayPlainDate(2024); // { year: 2024, month: 3, day: 30 }
 * ```
 * @param year
 */
export function getHolySaturdayPlainDate(year: number): PlainDateLike {
	return toPlainDate(getHolySaturday(year));
}

/**
 * Returns the date of Holy Saturday for a given year as a `Date` at
 * **midnight UTC**. Read it in UTC (`toISOString()`, `getUTC*()`,
 * `timeZone: "UTC"`), or use {@link getHolySaturdayPlainDate}.
 *
 * @example
 * ```ts
 * import { getHolySaturday } from "easter-date";
 * getHolySaturday(2024).toISOString(); // "2024-03-30T00:00:00.000Z"
 * ```
 * @param year
 */
export function getHolySaturday(year: number): Date {
	return easterDay(year, -1);
}

/**
 * Returns true if the given date is Holy Saturday.
 *
 * A `Date` is read as its **local** calendar day. A {@link PlainDateLike},
 * such as `Temporal.PlainDate`, is compared by its fields.
 *
 * @example
 * ```ts
 * import { isHolySaturday } from "easter-date";
 * isHolySaturday(new Date(2024, 2, 30)); // true (local date, month is 0-based)
 * isHolySaturday({ year: 2024, month: 3, day: 30 }); // true
 * ```
 * @param date
 * @throws {TypeError} if `date` is neither a valid `Date` nor an object with
 * integer `year`, `month` and `day`.
 */
export function isHolySaturday(date: Date | PlainDateLike): boolean {
	return isEasterDay(date, -1);
}
