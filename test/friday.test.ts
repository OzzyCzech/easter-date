import { describe, expect, it } from "vitest";
import { getGoodFriday, isGoodFriday } from "../lib";
import { fromIsoDate, toIsoDate } from "../lib/date-fns.js";

describe("Good Friday date tests", () => {
	it("Good Friday date for 10 years", () => {
		expect(toIsoDate(getGoodFriday(2024))).toBe("2024-03-29");
		expect(toIsoDate(getGoodFriday(2025))).toBe("2025-04-18");
		expect(toIsoDate(getGoodFriday(2026))).toBe("2026-04-03");
		expect(toIsoDate(getGoodFriday(2027))).toBe("2027-03-26");
		expect(toIsoDate(getGoodFriday(2028))).toBe("2028-04-14");
		expect(toIsoDate(getGoodFriday(2029))).toBe("2029-03-30");
		expect(toIsoDate(getGoodFriday(2030))).toBe("2030-04-19");
		expect(toIsoDate(getGoodFriday(2031))).toBe("2031-04-11");
		expect(toIsoDate(getGoodFriday(2032))).toBe("2032-03-26");
		expect(toIsoDate(getGoodFriday(2033))).toBe("2033-04-15");
	});

	it("Good Friday date for 100 years", () => {
		// 2105 and above
		expect(toIsoDate(getGoodFriday(2105))).toBe("2105-04-03");
		expect(toIsoDate(getGoodFriday(2106))).toBe("2106-04-16");

		// 2200 and above
		expect(toIsoDate(getGoodFriday(2225))).toBe("2225-03-25");
		expect(toIsoDate(getGoodFriday(2299))).toBe("2299-04-14");
	});

	it("Good Friday in 2024", () => {
		expect(isGoodFriday(fromIsoDate("2024-03-29"))).toBe(true);
	});
});
