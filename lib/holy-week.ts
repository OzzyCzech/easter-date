import { easterSunday } from "./computus.js";
import { type PlainDateLike, toPlainDate, utcMidnight } from "./plain-date.js";

/**
 * A day of Holy Week: its English name, a `Date` at midnight UTC and the
 * calendar date without a time zone.
 */
export type HolyWeekDay = {
	name: string;
	date: Date;
	plainDate: PlainDateLike;
};

export type HolyWeek = {
	palmSunday: HolyWeekDay;
	holyMonday: HolyWeekDay;
	holyTuesday: HolyWeekDay;
	holyWednesday: HolyWeekDay;
	maundyThursday: HolyWeekDay;
	goodFriday: HolyWeekDay;
	holySaturday: HolyWeekDay;
	easterSunday: HolyWeekDay;
	easterMonday: HolyWeekDay;
};

/**
 * Returns the dates of Holy Week for a given year.
 * Holy Week starts on Palm Sunday and ends on Easter Monday.
 *
 * Each `date` is a `Date` at midnight UTC, each `plainDate` the calendar
 * date `{ year, month, day }` with a 1-based month.
 *
 * @example
 * ```ts
 * import { getHolyWeek } from "easter-date";
 * const { palmSunday } = getHolyWeek(2024);
 * palmSunday.name; // "Palm Sunday"
 * palmSunday.date.toISOString(); // "2024-03-24T00:00:00.000Z"
 * palmSunday.plainDate; // { year: 2024, month: 3, day: 24 }
 * ```
 * @param year
 */
export function getHolyWeek(year: number): HolyWeek {
	const easter = easterSunday(year);

	const day = (name: string, offset: number): HolyWeekDay => {
		const date = utcMidnight(easter.year, easter.month, easter.day + offset);
		return { name, date, plainDate: toPlainDate(date) };
	};

	return {
		palmSunday: day("Palm Sunday", -7),
		holyMonday: day("Holy Monday", -6),
		holyTuesday: day("Holy Tuesday", -5),
		holyWednesday: day("Holy Wednesday", -4),
		maundyThursday: day("Maundy Thursday", -3),
		goodFriday: day("Good Friday", -2),
		holySaturday: day("Holy Saturday", -1),
		easterSunday: day("Easter Sunday", 0),
		easterMonday: day("Easter Monday", 1),
	};
}
