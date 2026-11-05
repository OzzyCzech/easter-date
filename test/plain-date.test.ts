import { describe, expect, it } from "vitest";
import {
	getEaster,
	getEasterMonday,
	getEasterMondayPlainDate,
	getEasterPlainDate,
	getGoodFriday,
	getGoodFridayPlainDate,
	getHolySaturday,
	getHolySaturdayPlainDate,
	getHolyWeek,
	isEaster,
	type PlainDateLike,
} from "../lib";
import {
	addDays,
	plainToIso,
	referenceEaster,
	Temporal,
	type TemporalApi,
	toIsoDate,
} from "./date-fns.js";

const days: {
	name: string;
	getPlainDate: (year: number) => PlainDateLike;
	getDate: (year: number) => Date;
	offset: number; // days after Easter Sunday
	weekday: number; // 0 = Sunday, as Date#getUTCDay()
}[] = [
	{
		name: "Good Friday",
		getPlainDate: getGoodFridayPlainDate,
		getDate: getGoodFriday,
		offset: -2,
		weekday: 5,
	},
	{
		name: "Holy Saturday",
		getPlainDate: getHolySaturdayPlainDate,
		getDate: getHolySaturday,
		offset: -1,
		weekday: 6,
	},
	{
		name: "Easter Sunday",
		getPlainDate: getEasterPlainDate,
		getDate: getEaster,
		offset: 0,
		weekday: 0,
	},
	{
		name: "Easter Monday",
		getPlainDate: getEasterMondayPlainDate,
		getDate: getEasterMonday,
		offset: 1,
		weekday: 1,
	},
];

describe("get*PlainDate()", () => {
	it("return plain { year, month, day } objects with a 1-based month", () => {
		expect(getEasterPlainDate(2024)).toStrictEqual({
			year: 2024,
			month: 3,
			day: 31,
		});
		expect(plainToIso(getGoodFridayPlainDate(2024))).toBe("2024-03-29");
		expect(plainToIso(getHolySaturdayPlainDate(2024))).toBe("2024-03-30");
		expect(plainToIso(getEasterMondayPlainDate(2024))).toBe("2024-04-01");
		expect(plainToIso(getHolySaturdayPlainDate(2029))).toBe("2029-03-31");
		expect(plainToIso(getEasterPlainDate(2029))).toBe("2029-04-01");
		expect(plainToIso(getGoodFridayPlainDate(2299))).toBe("2299-04-14");
	});

	it("match the reference, the Date variants and the weekday (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			const easter = referenceEaster(year);
			for (const { name, getPlainDate, getDate, offset, weekday } of days) {
				const expected = plainToIso(addDays(easter, offset));
				const plainDate = plainToIso(getPlainDate(year));
				const date = getDate(year);
				if (
					plainDate !== expected ||
					date.toISOString() !== `${expected}T00:00:00.000Z` ||
					date.getUTCDay() !== weekday
				) {
					mismatches.push(
						`${name} ${year}: ${plainDate}, ${date.toISOString()}, expected ${expected}`,
					);
				}
			}
		}

		expect(mismatches).toEqual([]);
	});

	it("return a new object on every call", () => {
		const easter = getEasterPlainDate(2024);
		easter.day = 1;
		expect(getEasterPlainDate(2024).day).toBe(31);
	});
});

describe("years 0–99", () => {
	// Date.UTC() maps years 0–99 to 1900–1999: getEaster(50) was 1950-03-27.
	it("get*() return midnight UTC in that year", () => {
		expect(getEaster(50).toISOString()).toBe("0050-03-27T00:00:00.000Z");
		expect(getEaster(99).toISOString()).toBe("0099-03-29T00:00:00.000Z");
		expect(getGoodFriday(99).toISOString()).toBe("0099-03-27T00:00:00.000Z");
		expect(getEasterMonday(99).toISOString()).toBe("0099-03-30T00:00:00.000Z");
		expect(getHolyWeek(99).palmSunday.date.toISOString()).toBe(
			"0099-03-22T00:00:00.000Z",
		);
	});

	it("get*PlainDate() return that year", () => {
		expect(getEasterPlainDate(50)).toStrictEqual({
			year: 50,
			month: 3,
			day: 27,
		});
		expect(getGoodFridayPlainDate(99)).toStrictEqual({
			year: 99,
			month: 3,
			day: 27,
		});
	});

	it("is*() read a Date in that year", () => {
		// new Date(50, 2, 27) would be 1950: set the full year explicitly.
		const date = new Date(2000, 0, 1, 12);
		date.setFullYear(50, 2, 27);

		expect(isEaster(date)).toBe(true);
		date.setDate(28);
		expect(isEaster(date)).toBe(false);
		expect(isEaster({ year: 50, month: 3, day: 27 })).toBe(true);
	});
});

describe("getHolyWeek()", () => {
	it("returns plainDate next to date for every day (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			const holyWeek = Object.values(getHolyWeek(year));
			const easter = referenceEaster(year);
			holyWeek.forEach(({ name, date, plainDate }, index) => {
				const expected = plainToIso(addDays(easter, index - 7));
				if (
					plainToIso(plainDate) !== expected ||
					toIsoDate(date) !== expected
				) {
					mismatches.push(
						`${name} ${year}: ${plainToIso(plainDate)} / ${toIsoDate(date)}, expected ${expected}`,
					);
				}
			});
		}

		expect(mismatches).toEqual([]);
	});

	it("returns the 2024 dates", () => {
		const { palmSunday, easterMonday } = getHolyWeek(2024);
		expect(palmSunday.plainDate).toStrictEqual({
			year: 2024,
			month: 3,
			day: 24,
		});
		expect(easterMonday.plainDate).toStrictEqual({
			year: 2024,
			month: 4,
			day: 1,
		});
	});
});

describe("Temporal", () => {
	it.skipIf(Temporal === undefined)(
		"Temporal.PlainDate.from() accepts get*PlainDate() (1900–2299)",
		() => {
			const { PlainDate } = Temporal as TemporalApi;
			const mismatches: string[] = [];

			for (let year = 1900; year <= 2299; year++) {
				for (const { name, getPlainDate, getDate, weekday } of days) {
					const plainDate = PlainDate.from(getPlainDate(year));
					if (
						plainDate.toString() !== toIsoDate(getDate(year)) ||
						plainDate.dayOfWeek % 7 !== weekday
					) {
						mismatches.push(`${name} ${year}: ${plainDate.toString()}`);
					}
				}
			}

			expect(mismatches).toEqual([]);
		},
	);
});
