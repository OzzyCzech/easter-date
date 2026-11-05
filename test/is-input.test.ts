import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";
import {
	isEaster,
	isEasterMonday,
	isEasterSunday,
	isGoodFriday,
	isHolySaturday,
	type PlainDateLike,
} from "../lib";
import { Temporal, type TemporalApi } from "./date-fns.js";

describe("is*() with a Date", () => {
	it("accept a Date from another realm (vm context, iframe)", () => {
		const date = runInNewContext("new Date(2024, 2, 31, 12)") as Date;
		expect(date instanceof Date).toBe(false);

		expect(isEaster(date)).toBe(true);
		expect(isEasterMonday(date)).toBe(false);
		expect(
			isEasterMonday(runInNewContext("new Date(2024, 3, 1)") as Date),
		).toBe(true);
	});
});

describe("is*() with invalid input", () => {
	const isFunctions = [
		isEaster,
		isEasterSunday,
		isGoodFriday,
		isHolySaturday,
		isEasterMonday,
	];

	// What a JavaScript caller might pass by mistake.
	const invalid: [string, unknown][] = [
		["an ISO string", "2024-03-31"],
		["a JSON-revived Date", JSON.parse(JSON.stringify(new Date(2024, 2, 31)))],
		["a timestamp", new Date(2024, 2, 31).getTime()],
		["an invalid Date", new Date("not a date")],
		["null", null],
		["undefined", undefined],
		["an empty object", {}],
		["a missing day", { year: 2024, month: 3 }],
		["a string field", { year: "2024", month: 3, day: 31 }],
		["a fractional day", { year: 2024, month: 3, day: 31.5 }],
		// dayjs and moment have year(), month() and date() methods.
		[
			"a dayjs-like object",
			{ year: () => 2024, month: () => 2, date: () => 31 },
		],
	];

	it.each(invalid)("throw a TypeError for %s", (_, input) => {
		for (const is of isFunctions) {
			expect(() => is(input as PlainDateLike)).toThrow(TypeError);
		}
	});

	it("say what they expect", () => {
		expect(() => isEaster("2024-03-31" as unknown as Date)).toThrow(
			"Expected a valid Date or a { year, month, day } object with integer fields",
		);
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

describe("is*() with Temporal", () => {
	it.skipIf(Temporal === undefined)("accept a Temporal.PlainDate", () => {
		const { PlainDate } = Temporal as TemporalApi;

		expect(isGoodFriday(PlainDate.from("2024-03-29"))).toBe(true);
		expect(isHolySaturday(PlainDate.from("2024-03-30"))).toBe(true);
		expect(isEaster(PlainDate.from("2024-03-31"))).toBe(true);
		expect(isEasterSunday(PlainDate.from("2024-03-31"))).toBe(true);
		expect(isEasterMonday(PlainDate.from("2024-04-01"))).toBe(true);
		expect(isEaster(PlainDate.from("2024-03-30"))).toBe(false);
		expect(isEasterMonday(PlainDate.from("2024-03-31"))).toBe(false);
	});

	it.skipIf(Temporal === undefined)(
		"accept a Temporal.ZonedDateTime and use its time zone",
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

	it.skipIf(Temporal === undefined)(
		"read a Temporal date in another calendar as its ISO date",
		() => {
			const { PlainDate, ZonedDateTime } = Temporal as TemporalApi;
			const easter = PlainDate.from("2024-03-31");

			// Buddhist year 2567, Hebrew 21 Adar II 5784.
			expect(easter.withCalendar("buddhist").year).toBe(2567);
			expect(isEaster(easter.withCalendar("buddhist"))).toBe(true);
			expect(isEaster(easter.withCalendar("hebrew"))).toBe(true);
			expect(isEaster(easter.withCalendar("japanese"))).toBe(true);
			expect(
				isEaster(PlainDate.from("2024-03-30").withCalendar("buddhist")),
			).toBe(false);
			expect(
				isEasterMonday(
					ZonedDateTime.from("2024-04-01T00:30[Europe/Prague][u-ca=hebrew]"),
				),
			).toBe(true);
		},
	);
});
