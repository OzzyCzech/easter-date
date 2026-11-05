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
	isEasterMonday,
	isEasterSunday,
	isGoodFriday,
	isHolySaturday,
	type PlainDateLike,
} from "../lib";
import { toIsoDate } from "./date-fns.js";

const days: {
	name: string;
	getPlainDate: (year: number) => PlainDateLike;
	getDate: (year: number) => Date;
	weekday: number; // 0 = Sunday, as Date#getUTCDay()
}[] = [
	{
		name: "Good Friday",
		getPlainDate: getGoodFridayPlainDate,
		getDate: getGoodFriday,
		weekday: 5,
	},
	{
		name: "Holy Saturday",
		getPlainDate: getHolySaturdayPlainDate,
		getDate: getHolySaturday,
		weekday: 6,
	},
	{
		name: "Easter Sunday",
		getPlainDate: getEasterPlainDate,
		getDate: getEaster,
		weekday: 0,
	},
	{
		name: "Easter Monday",
		getPlainDate: getEasterMondayPlainDate,
		getDate: getEasterMonday,
		weekday: 1,
	},
];

const toIso = ({ year, month, day }: PlainDateLike) =>
	`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const addDays = ({ year, month, day }: PlainDateLike, days: number) => {
	const date = new Date(Date.UTC(year, month - 1, day + days));
	return {
		year: date.getUTCFullYear(),
		month: date.getUTCMonth() + 1,
		day: date.getUTCDate(),
	};
};

describe("get*PlainDate()", () => {
	it("return plain { year, month, day } objects with a 1-based month", () => {
		expect(getEasterPlainDate(2024)).toStrictEqual({
			year: 2024,
			month: 3,
			day: 31,
		});
		expect(toIso(getGoodFridayPlainDate(2024))).toBe("2024-03-29");
		expect(toIso(getHolySaturdayPlainDate(2024))).toBe("2024-03-30");
		expect(toIso(getEasterMondayPlainDate(2024))).toBe("2024-04-01");
		expect(toIso(getHolySaturdayPlainDate(2029))).toBe("2029-03-31");
		expect(toIso(getEasterPlainDate(2029))).toBe("2029-04-01");
		expect(toIso(getGoodFridayPlainDate(2299))).toBe("2299-04-14");
	});

	it("match the Date variants and fall on the right weekday (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			for (const { name, getPlainDate, getDate, weekday } of days) {
				const plainDate = getPlainDate(year);
				const date = getDate(year);
				if (date.toISOString() !== `${toIso(plainDate)}T00:00:00.000Z`) {
					mismatches.push(
						`${name} ${year}: ${date.toISOString()}, plain date ${toIso(plainDate)}`,
					);
				}
				if (date.getUTCDay() !== weekday) {
					mismatches.push(`${name} ${year}: weekday ${date.getUTCDay()}`);
				}
			}
		}

		expect(mismatches).toEqual([]);
	});

	it("keep years 0–99 (Date.UTC() would map them to 1900–1999)", () => {
		expect(getEasterPlainDate(99).year).toBe(99);
		expect(getEasterMondayPlainDate(99).year).toBe(99);
		expect(getEaster(99).getUTCFullYear()).toBe(99);
		expect(getGoodFriday(99).getUTCFullYear()).toBe(99);
	});

	it("return a new object on every call", () => {
		const easter = getEasterPlainDate(2024);
		easter.day = 1;
		expect(getEasterPlainDate(2024).day).toBe(31);
	});
});

describe("getHolyWeek()", () => {
	it("returns plainDate next to date for every day (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			const holyWeek = Object.values(getHolyWeek(year));
			const easter = getEasterPlainDate(year);
			holyWeek.forEach(({ name, date, plainDate }, index) => {
				const expected = toIso(addDays(easter, index - 7));
				if (toIso(plainDate) !== expected || toIsoDate(date) !== expected) {
					mismatches.push(
						`${name} ${year}: ${toIso(plainDate)} / ${toIsoDate(date)}, expected ${expected}`,
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

describe("is*() with a plain date", () => {
	it("read only year, month and day, also from getters", () => {
		// Getters on the prototype, like Temporal.PlainDate.
		class CalendarDay {
			readonly #iso: string;
			constructor(iso: string) {
				this.#iso = iso;
			}
			get year() {
				return Number(this.#iso.slice(0, 4));
			}
			get month() {
				return Number(this.#iso.slice(5, 7));
			}
			get day() {
				return Number(this.#iso.slice(8, 10));
			}
		}

		expect(isEaster(new CalendarDay("2024-03-31"))).toBe(true);
		expect(isEasterSunday(new CalendarDay("2024-03-31"))).toBe(true);
		expect(isEasterMonday(new CalendarDay("2024-04-01"))).toBe(true);
		expect(isEaster(new CalendarDay("2024-04-01"))).toBe(false);

		const withTime = { year: 2024, month: 3, day: 29, hour: 23 };
		expect(isGoodFriday(withTime)).toBe(true);
	});

	it("do not treat the month as 0-based", () => {
		expect(isEaster({ year: 2024, month: 2, day: 31 })).toBe(false);
		expect(isEaster({ year: 2024, month: 3, day: 31 })).toBe(true);
	});
});

type TemporalApi = {
	PlainDate: {
		from(item: PlainDateLike | string): PlainDateLike & {
			dayOfWeek: number;
			toString(): string;
		};
	};
	ZonedDateTime: {
		from(item: string): PlainDateLike;
	};
};

// Temporal is a global in Node 26, not in Node 24. Dereference it only inside
// the tests: the body of a skipped describe() still runs.
const Temporal = (globalThis as { Temporal?: TemporalApi }).Temporal;
const noTemporal = Temporal === undefined;

describe("Temporal", () => {
	it.skipIf(noTemporal)(
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

	it.skipIf(noTemporal)("is*() accept a Temporal.PlainDate", () => {
		const { PlainDate } = Temporal as TemporalApi;

		expect(isGoodFriday(PlainDate.from("2024-03-29"))).toBe(true);
		expect(isHolySaturday(PlainDate.from("2024-03-30"))).toBe(true);
		expect(isEaster(PlainDate.from("2024-03-31"))).toBe(true);
		expect(isEasterSunday(PlainDate.from("2024-03-31"))).toBe(true);
		expect(isEasterMonday(PlainDate.from("2024-04-01"))).toBe(true);
		expect(isEaster(PlainDate.from("2024-03-30"))).toBe(false);
		expect(isEasterMonday(PlainDate.from("2024-03-31"))).toBe(false);
	});

	it.skipIf(noTemporal)(
		"is*() accept a Temporal.ZonedDateTime and use its time zone",
		() => {
			const { ZonedDateTime } = Temporal as TemporalApi;

			// 2024-03-31T22:30Z: Easter Sunday in UTC, Easter Monday in Prague.
			expect(
				isEasterMonday(ZonedDateTime.from("2024-04-01T00:30[Europe/Prague]")),
			).toBe(true);
			// 2024-04-01T03:30Z: Easter Monday in UTC, Easter Sunday in New York.
			expect(
				isEasterMonday(
					ZonedDateTime.from("2024-03-31T23:30[America/New_York]"),
				),
			).toBe(false);
		},
	);
});
