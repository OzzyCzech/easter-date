import { describe, expect, it } from "vitest";
import { getHolyWeek } from "../lib";
import { toIsoDate } from "../lib/date-fns.js";

describe("Holy Week in 2024", () => {
  it("should return correct dates", () => {
    const holyWeek = getHolyWeek(2024);

    expect(toIsoDate(holyWeek.palmSunday.date)).toBe("2024-03-24");
    expect(toIsoDate(holyWeek.holyMonday.date)).toBe("2024-03-25");
    expect(toIsoDate(holyWeek.holyTuesday.date)).toBe("2024-03-26");
    expect(toIsoDate(holyWeek.holyWednesday.date)).toBe("2024-03-27");
    expect(toIsoDate(holyWeek.maundyThursday.date)).toBe("2024-03-28");
    expect(toIsoDate(holyWeek.goodFriday.date)).toBe("2024-03-29");
    expect(toIsoDate(holyWeek.holySaturday.date)).toBe("2024-03-30");
    expect(toIsoDate(holyWeek.easterSunday.date)).toBe("2024-03-31");
    expect(toIsoDate(holyWeek.easterMonday.date)).toBe("2024-04-01");
  });
});