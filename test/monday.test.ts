import { describe, expect, it } from "vitest";
import { getEasterMonday, isEasterMonday } from "../lib";
import { fromIsoDate, toIsoDate } from "../lib/date-fns.js";

describe("Easter Monday date tests", () => {
  it("Easter Monday date for 10 years", () => {
    expect(toIsoDate(getEasterMonday(2024))).toBe("2024-04-01");
    expect(toIsoDate(getEasterMonday(2025))).toBe("2025-04-21");
    expect(toIsoDate(getEasterMonday(2026))).toBe("2026-04-06");
    expect(toIsoDate(getEasterMonday(2027))).toBe("2027-03-29");
    expect(toIsoDate(getEasterMonday(2028))).toBe("2028-04-17");
    expect(toIsoDate(getEasterMonday(2029))).toBe("2029-04-02");
    expect(toIsoDate(getEasterMonday(2030))).toBe("2030-04-22");
    expect(toIsoDate(getEasterMonday(2031))).toBe("2031-04-14");
    expect(toIsoDate(getEasterMonday(2032))).toBe("2032-03-29");
    expect(toIsoDate(getEasterMonday(2033))).toBe("2033-04-18");
  });

  it("Easter Monday date for 100 years", () => {
    // 2105 and above
    expect(toIsoDate(getEasterMonday(2105))).toBe("2105-04-06");
    expect(toIsoDate(getEasterMonday(2106))).toBe("2106-04-19");

    // 2200 and above
    expect(toIsoDate(getEasterMonday(2225))).toBe("2225-03-28");
    expect(toIsoDate(getEasterMonday(2299))).toBe("2299-04-17");
  });

  it("Easter Monday in 2024", () => {
    expect(isEasterMonday(fromIsoDate("2024-04-01"))).toBe(true);
  });
});