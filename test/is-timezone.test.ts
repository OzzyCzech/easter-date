import { expect, it } from "vitest";
import {
	getEaster,
	getEasterMonday,
	getEasterMondayPlainDate,
	getEasterPlainDate,
	isEaster,
	isEasterMonday,
	isEasterSunday,
	isGoodFriday,
	isHolySaturday,
	type PlainDateLike,
} from "../lib";
import { addDays, forEachTimeZone, referenceEaster } from "./date-fns.js";

/**
 * is*() read the local calendar day of a Date and the fields of a plain date.
 * A local date on the right day must match at any time of day and in any
 * process time zone, and the days around it must not.
 */
const checks: {
	name: string;
	is: (date: Date | PlainDateLike) => boolean;
	offset: number;
}[] = [
	{ name: "isGoodFriday", is: isGoodFriday, offset: -2 },
	{ name: "isHolySaturday", is: isHolySaturday, offset: -1 },
	{ name: "isEaster", is: isEaster, offset: 0 },
	{ name: "isEasterSunday", is: isEasterSunday, offset: 0 },
	{ name: "isEasterMonday", is: isEasterMonday, offset: 1 },
];

// Local times of day: midnight, noon and late evening.
const times: [hours: number, minutes: number][] = [
	[0, 0],
	[12, 0],
	[23, 30],
];

forEachTimeZone((timeZone) => {
	it("is*() match a local date on the day only, at any time of day (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			const easter = referenceEaster(year);
			for (const { name, is, offset } of checks) {
				// The day itself, the day before and the day after.
				for (const delta of [-1, 0, 1]) {
					const { year: y, month, day } = addDays(easter, offset + delta);
					for (const [hours, minutes] of times) {
						const date = new Date(y, month - 1, day, hours, minutes);
						const expected = delta === 0;
						if (is(date) !== expected) {
							mismatches.push(`${name}(${date.toString()}) !== ${expected}`);
						}
					}
				}
			}
		}

		// Report the count and the first few mismatches, not thousands of lines.
		expect(mismatches.length, mismatches.slice(0, 6).join("\n")).toBe(0);
	});

	it("is*() match the examples from #4", () => {
		expect(isEaster(new Date(2024, 2, 31))).toBe(true);
		expect(isEaster(new Date(2024, 2, 30))).toBe(false);
		expect(isEasterMonday(new Date(2024, 3, 1))).toBe(true);
		expect(isGoodFriday(new Date(2024, 2, 29, 12))).toBe(true);
		expect(isHolySaturday(new Date(2024, 2, 30, 23, 30))).toBe(true);
	});

	it("is*() match a plain date on the day only (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			const easter = referenceEaster(year);
			for (const { name, is, offset } of checks) {
				for (const delta of [-1, 0, 1]) {
					const date = addDays(easter, offset + delta);
					const expected = delta === 0;
					if (is(date) !== expected) {
						mismatches.push(`${name}(${JSON.stringify(date)}) !== ${expected}`);
					}
				}
			}
		}

		expect(mismatches.length, mismatches.slice(0, 6).join("\n")).toBe(0);
	});

	it("is*() read a Date at midnight UTC as its local day", () => {
		// 2024-03-31T00:00Z is still March 30 west of UTC.
		const westOfUtc = timeZone.startsWith("America/");

		expect(isEaster(new Date("2024-03-31"))).toBe(!westOfUtc);
		expect(isHolySaturday(new Date("2024-03-31"))).toBe(westOfUtc);
		expect(isEaster(getEaster(2024))).toBe(!westOfUtc);
		expect(isEasterMonday(getEasterMonday(2024))).toBe(!westOfUtc);

		// A calendar date has no time zone to depend on.
		expect(isEaster(getEasterPlainDate(2024))).toBe(true);
		expect(isEasterMonday(getEasterMondayPlainDate(2024))).toBe(true);
	});
});
