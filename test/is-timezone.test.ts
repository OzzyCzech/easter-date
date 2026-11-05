import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	getEaster,
	isEaster,
	isEasterMonday,
	isEasterSunday,
	isGoodFriday,
	isHolySaturday,
} from "../lib";

/**
 * is*() read the local calendar day of a Date. A local date on the right day
 * must match at any time of day and in any process time zone, and the days
 * around it must not.
 */
const timeZones = [
	"UTC",
	"Europe/Prague",
	"America/New_York",
	"America/Santiago",
	"Pacific/Auckland",
];

const checks: { name: string; is: (date: Date) => boolean; offset: number }[] =
	[
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

/**
 * Calendar day `offset` days after Easter Sunday of `year`, as
 * [year, monthIndex, day]. getEaster() returns midnight UTC, so its UTC
 * fields are the calendar day.
 */
function easterDay(year: number, offset: number): [number, number, number] {
	const easter = getEaster(year);
	const day = new Date(
		Date.UTC(
			easter.getUTCFullYear(),
			easter.getUTCMonth(),
			easter.getUTCDate() + offset,
		),
	);
	return [day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()];
}

const originalTimeZone = process.env.TZ;

afterAll(() => {
	if (originalTimeZone === undefined) {
		delete process.env.TZ;
	} else {
		process.env.TZ = originalTimeZone;
	}
});

describe.each(timeZones)("TZ=%s", (timeZone) => {
	beforeAll(() => {
		process.env.TZ = timeZone;
	});

	it("is*() match a local date on the day only, at any time of day (1900–2299)", () => {
		const mismatches: string[] = [];

		for (let year = 1900; year <= 2299; year++) {
			for (const { name, is, offset } of checks) {
				// The day itself, the day before and the day after.
				for (const delta of [-1, 0, 1]) {
					const [y, monthIndex, day] = easterDay(year, offset + delta);
					for (const [hours, minutes] of times) {
						const date = new Date(y, monthIndex, day, hours, minutes);
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
});
