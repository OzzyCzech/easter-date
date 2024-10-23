import test from "ava";
import { getHolyWeek } from "../lib";
import { toIsoDate } from "../lib/date-fns.js";

test("Holy Week in 2024", (t) => {
	const holyWeek = getHolyWeek(2024);

	t.is(toIsoDate(holyWeek.palmSunday.date), "2024-03-24");
	t.is(toIsoDate(holyWeek.holyMonday.date), "2024-03-25");
	t.is(toIsoDate(holyWeek.holyTuesday.date), "2024-03-26");
	t.is(toIsoDate(holyWeek.holyWednesday.date), "2024-03-27");
	t.is(toIsoDate(holyWeek.maundyThursday.date), "2024-03-28");
	t.is(toIsoDate(holyWeek.goodFriday.date), "2024-03-29");
	t.is(toIsoDate(holyWeek.holySaturday.date), "2024-03-30");
	t.is(toIsoDate(holyWeek.easterSunday.date), "2024-03-31");
	t.is(toIsoDate(holyWeek.easterMonday.date), "2024-04-01");
});
