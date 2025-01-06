import { describe, it, expect } from "vitest";
import { getEaster, isEaster } from "../lib";
import { fromIsoDate } from "../lib/date-fns.js";

describe("Easter date tests", () => {
	it("Easter date for 10 years", () => {
		expect(getEaster(2024).toLocaleDateString("cs-CZ")).toBe("31. 3. 2024");
		expect(getEaster(2025).toLocaleDateString("cs-CZ")).toBe("20. 4. 2025");
		expect(getEaster(2026).toLocaleDateString("cs-CZ")).toBe("5. 4. 2026");
		expect(getEaster(2027).toLocaleDateString("cs-CZ")).toBe("28. 3. 2027");
		expect(getEaster(2028).toLocaleDateString("cs-CZ")).toBe("16. 4. 2028");
		expect(getEaster(2029).toLocaleDateString("cs-CZ")).toBe("1. 4. 2029");
		expect(getEaster(2030).toLocaleDateString("cs-CZ")).toBe("21. 4. 2030");
		expect(getEaster(2031).toLocaleDateString("cs-CZ")).toBe("13. 4. 2031");
		expect(getEaster(2032).toLocaleDateString("cs-CZ")).toBe("28. 3. 2032");
		expect(getEaster(2033).toLocaleDateString("cs-CZ")).toBe("17. 4. 2033");
	});

	it("Easter date for 100 years", () => {
		expect(getEaster(2105).toLocaleDateString("cs-CZ")).toBe("5. 4. 2105");
		expect(getEaster(2106).toLocaleDateString("cs-CZ")).toBe("18. 4. 2106");
		expect(getEaster(2225).toLocaleDateString("cs-CZ")).toBe("27. 3. 2225");
		expect(getEaster(2199).toLocaleDateString("cs-CZ")).toBe("14. 4. 2199");
	});

	it("Easter in 2024", () => {
		expect(isEaster(fromIsoDate("2024-03-31"))).toBe(true);
	});
});
