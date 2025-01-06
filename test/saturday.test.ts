import { describe, expect, it } from "vitest";
import { getHolySaturday, isHolySaturday } from "../lib";
import { fromIsoDate, toIsoDate } from "../lib/date-fns.js";

describe("Holy Saturday date tests", () => {
  it("Get Holy Saturday for 10 years", () => {
    expect(toIsoDate(getHolySaturday(2024))).toBe("2024-03-30");
    expect(toIsoDate(getHolySaturday(2025))).toBe("2025-04-19");
    expect(toIsoDate(getHolySaturday(2026))).toBe("2026-04-04");
    expect(toIsoDate(getHolySaturday(2027))).toBe("2027-03-27");
    expect(toIsoDate(getHolySaturday(2028))).toBe("2028-04-15");
    expect(toIsoDate(getHolySaturday(2029))).toBe("2029-03-31");
    expect(toIsoDate(getHolySaturday(2030))).toBe("2030-04-20");
    expect(toIsoDate(getHolySaturday(2031))).toBe("2031-04-12");
    expect(toIsoDate(getHolySaturday(2032))).toBe("2032-03-27");
    expect(toIsoDate(getHolySaturday(2033))).toBe("2033-04-16");
  });

  it("Get Holy Saturday for 100 years", () => {
    // 2105 and above
    expect(toIsoDate(getHolySaturday(2105))).toBe("2105-04-04");
    expect(toIsoDate(getHolySaturday(2199))).toBe("2199-04-13");

    // 2200 and above
    expect(toIsoDate(getHolySaturday(2200))).toBe("2200-04-05");
    expect(toIsoDate(getHolySaturday(2299))).toBe("2299-04-15");
  });

  it("Holy Saturday in 2024", () => {
    expect(isHolySaturday(fromIsoDate("2024-03-30"))).toBe(true);
  });
});