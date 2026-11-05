import { easterDay, isEasterDay } from "./computus.js";
import { type PlainDateLike, toPlainDate } from "./plain-date.js";

/**
 * Returns the calendar date of Easter Monday for a given year, without a time
 * or a time zone. `month` is 1-based.
 *
 * @example
 * ```ts
 * import { getEasterMondayPlainDate } from "easter-date";
 * getEasterMondayPlainDate(2024); // { year: 2024, month: 4, day: 1 }
 * ```
 * @param year
 */
export function getEasterMondayPlainDate(year: number): PlainDateLike {
	return toPlainDate(getEasterMonday(year));
}

/**
 * Returns the date of Easter Monday for a given year as a `Date` at
 * **midnight UTC**. Read it in UTC (`toISOString()`, `getUTC*()`,
 * `timeZone: "UTC"`), or use {@link getEasterMondayPlainDate}.
 *
 * @example Get the date of Easter Monday for the year 2023
 * ```ts
 * import { getEasterMonday } from "easter-date";
 * getEasterMonday(2023).toISOString(); // "2023-04-10T00:00:00.000Z"
 * ```
 * @param year
 */
export function getEasterMonday(year: number): Date {
	return easterDay(year, 1);
}

/**
 * Returns true if the given date is Easter Monday.
 *
 * A `Date` is read as its **local** calendar day. A {@link PlainDateLike},
 * such as `Temporal.PlainDate`, is compared by its fields.
 *
 * @example Check if a date is Easter Monday
 * ```ts
 * import { isEasterMonday } from "easter-date";
 * isEasterMonday(new Date(2023, 3, 10)); // true (local date, month is 0-based)
 * isEasterMonday({ year: 2023, month: 4, day: 10 }); // true
 * ```
 * @param date
 * @throws {TypeError} if `date` is neither a valid `Date` nor an object with
 * integer `year`, `month` and `day`.
 */
export function isEasterMonday(date: Date | PlainDateLike): boolean {
	return isEasterDay(date, 1);
}
