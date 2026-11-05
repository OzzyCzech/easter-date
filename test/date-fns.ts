import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PlainDateLike } from "../lib";

/**
 * Converts a date returned by the library (midnight UTC) to an ISO date
 * string (YYYY-MM-dd). Reads the UTC calendar day, so the result does not
 * depend on the process time zone.
 * @param date
 */
export function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/**
 * Converts an ISO date string (YYYY-MM-dd) to a local date (local midnight),
 * as an `is*` caller would build it with `new Date(year, monthIndex, day)`.
 * @param isoDate
 */
export function fromIsoDate(isoDate: string): Date {
	const [year, month, day] = isoDate.split("-").map(Number);

	if (year === undefined || month === undefined || day === undefined) {
		throw new Error("Invalid date format");
	}

	return new Date(year, month - 1, day);
}

/**
 * Formats a calendar date as an ISO date string (YYYY-MM-dd).
 * @param date
 */
export function plainToIso({ year, month, day }: PlainDateLike): string {
	return [
		String(year).padStart(4, "0"),
		String(month).padStart(2, "0"),
		String(day).padStart(2, "0"),
	].join("-");
}

/**
 * Returns the calendar date `days` days after `date` (before, if negative).
 * Uses Date.UTC(), so only for years from 100 on.
 * @param date
 * @param days
 */
export function addDays(date: PlainDateLike, days: number): PlainDateLike {
	const shifted = new Date(
		Date.UTC(date.year, date.month - 1, date.day + days),
	);
	return {
		year: shifted.getUTCFullYear(),
		month: shifted.getUTCMonth() + 1,
		day: shifted.getUTCDate(),
	};
}

/**
 * Reference date of Easter Sunday, independent of the library: the
 * algorithm from Claus Tøndering's Calendar FAQ (after Oudin, 1940). The
 * library uses the Meeus/Jones/Butcher algorithm.
 * @param year
 */
export function referenceEaster(year: number): PlainDateLike {
	const golden = year % 19;
	const century = Math.floor(year / 100);
	const h =
		(century -
			Math.floor(century / 4) -
			Math.floor((8 * century + 13) / 25) +
			19 * golden +
			15) %
		30;
	const i =
		h -
		Math.floor(h / 28) *
			(1 - Math.floor(29 / (h + 1)) * Math.floor((21 - golden) / 11));
	const j =
		(year + Math.floor(year / 4) + i + 2 - century + Math.floor(century / 4)) %
		7;
	const l = i - j;
	const month = 3 + Math.floor((l + 40) / 44);
	const day = l + 28 - 31 * Math.floor(month / 4);
	return { year, month, day };
}

/**
 * Time zones on both sides of UTC, with DST in both hemispheres, including
 * DST transitions on Easter Sunday (Europe) and at local midnight (Santiago).
 */
export const timeZones = [
	"UTC",
	"Europe/Prague",
	"Europe/London",
	"America/New_York",
	"America/Santiago",
	"Australia/Sydney",
	"Pacific/Auckland",
];

/**
 * Runs `tests` once per time zone, with `process.env.TZ` set to it, and
 * restores the original TZ afterwards. Each block starts with a test that the
 * switch took effect: it works in vitest's default forks pool, but not in the
 * threads pool, where the time zone tests would pass without testing anything.
 * @param tests
 */
export function forEachTimeZone(tests: (timeZone: string) => void): void {
	describe.each(timeZones)("TZ=%s", (timeZone) => {
		const originalTimeZone = process.env.TZ;

		beforeAll(() => {
			process.env.TZ = timeZone;
		});

		afterAll(() => {
			if (originalTimeZone === undefined) {
				delete process.env.TZ;
			} else {
				process.env.TZ = originalTimeZone;
			}
		});

		it("runs in the time zone", () => {
			expect(new Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(
				timeZone,
			);
		});

		tests(timeZone);
	});
}

/** The parts of the Temporal API that the tests use. */
export type TemporalApi = {
	PlainDate: {
		from(item: PlainDateLike | string): PlainDateLike & {
			dayOfWeek: number;
			toString(): string;
			withCalendar(calendar: string): PlainDateLike;
		};
	};
	ZonedDateTime: {
		from(item: string): PlainDateLike;
	};
};

/**
 * The global Temporal object: available in Node 26, not in older runtimes.
 * Dereference it only inside a test that is skipped without it: the body of a
 * skipped describe() still runs.
 */
export const Temporal = (globalThis as { Temporal?: TemporalApi }).Temporal;
