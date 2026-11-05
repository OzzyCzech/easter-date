import { describe, expect, it } from "vitest";
import { getEaster, isEaster } from "../lib";
import { fromIsoDate, plainToIso, referenceEaster } from "./date-fns.js";

// getEaster() returns midnight UTC, so format it in UTC.
const czechDate = (date: Date) =>
	date.toLocaleDateString("cs-CZ", { timeZone: "UTC" });

describe("Easter date tests", () => {
	it("Easter date for 10 years", () => {
		expect(czechDate(getEaster(2024))).toBe("31. 3. 2024");
		expect(czechDate(getEaster(2025))).toBe("20. 4. 2025");
		expect(czechDate(getEaster(2026))).toBe("5. 4. 2026");
		expect(czechDate(getEaster(2027))).toBe("28. 3. 2027");
		expect(czechDate(getEaster(2028))).toBe("16. 4. 2028");
		expect(czechDate(getEaster(2029))).toBe("1. 4. 2029");
		expect(czechDate(getEaster(2030))).toBe("21. 4. 2030");
		expect(czechDate(getEaster(2031))).toBe("13. 4. 2031");
		expect(czechDate(getEaster(2032))).toBe("28. 3. 2032");
		expect(czechDate(getEaster(2033))).toBe("17. 4. 2033");
	});

	it("Easter date for 100 years", () => {
		expect(czechDate(getEaster(2105))).toBe("5. 4. 2105");
		expect(czechDate(getEaster(2106))).toBe("18. 4. 2106");
		expect(czechDate(getEaster(2225))).toBe("27. 3. 2225");
		expect(czechDate(getEaster(2199))).toBe("14. 4. 2199");
	});

	it("Easter in 2024", () => {
		expect(isEaster(fromIsoDate("2024-03-31"))).toBe(true);
	});

	it("the reference algorithm of the tests gives the known dates", () => {
		const known = [
			"1954-04-18",
			"1981-04-19",
			"2024-03-31",
			"2025-04-20",
			"2026-04-05",
			"2027-03-28",
			"2028-04-16",
			"2029-04-01",
			"2030-04-21",
			"2031-04-13",
			"2032-03-28",
			"2033-04-17",
			"2049-04-18",
			"2076-04-19",
			"2105-04-05",
			"2106-04-18",
			"2199-04-14",
			"2225-03-27",
			"2299-04-16",
		];
		for (const iso of known) {
			expect(plainToIso(referenceEaster(Number(iso.slice(0, 4))))).toBe(iso);
		}
	});
});
