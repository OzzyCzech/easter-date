import { expect, it } from "vitest";
import {
	getEaster,
	getEasterMonday,
	getGoodFriday,
	getHolySaturday,
	getHolyWeek,
	type HolyWeek,
} from "../lib";
import {
	addDays,
	forEachTimeZone,
	plainToIso,
	referenceEaster,
} from "./date-fns.js";

/**
 * getEaster() returns midnight UTC, so every derived date must land on
 * midnight UTC of the right day as well, regardless of the process time zone
 * and of any DST transition between Easter Sunday and the derived day.
 */
const holyWeekOffsets: Record<keyof HolyWeek, number> = {
	palmSunday: -7,
	holyMonday: -6,
	holyTuesday: -5,
	holyWednesday: -4,
	maundyThursday: -3,
	goodFriday: -2,
	holySaturday: -1,
	easterSunday: 0,
	easterMonday: 1,
};

function derivedDates(
	year: number,
): { name: string; date: Date; offset: number }[] {
	const holyWeek = getHolyWeek(year);

	return [
		{ name: "getEaster", date: getEaster(year), offset: 0 },
		{ name: "getGoodFriday", date: getGoodFriday(year), offset: -2 },
		{ name: "getHolySaturday", date: getHolySaturday(year), offset: -1 },
		{ name: "getEasterMonday", date: getEasterMonday(year), offset: 1 },
		...(Object.keys(holyWeekOffsets) as (keyof HolyWeek)[]).map((key) => ({
			name: `getHolyWeek().${key}`,
			date: holyWeek[key].date,
			offset: holyWeekOffsets[key],
		})),
	];
}

forEachTimeZone(() => {
	it("returns Easter Monday at midnight UTC when DST starts on Easter Sunday", () => {
		expect(getEasterMonday(2024).toISOString()).toBe(
			"2024-04-01T00:00:00.000Z",
		);
		expect(getEasterMonday(2027).toISOString()).toBe(
			"2027-03-29T00:00:00.000Z",
		);
		expect(getEasterMonday(2032).toISOString()).toBe(
			"2032-03-29T00:00:00.000Z",
		);
	});

	it("returns Good Friday at midnight UTC when DST ends on Easter Sunday", () => {
		expect(getGoodFriday(2010).toISOString()).toBe("2010-04-02T00:00:00.000Z");
		expect(getHolySaturday(2010).toISOString()).toBe(
			"2010-04-03T00:00:00.000Z",
		);
	});

	it("returns every date at midnight UTC of the right day (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			const easter = referenceEaster(year);
			for (const { name, date, offset } of derivedDates(year)) {
				const expected = `${plainToIso(addDays(easter, offset))}T00:00:00.000Z`;
				if (date.toISOString() !== expected) {
					mismatches.push(
						`${name}(${year}): ${date.toISOString()}, expected ${expected}`,
					);
				}
			}
		}

		expect(mismatches).toEqual([]);
	});
});
