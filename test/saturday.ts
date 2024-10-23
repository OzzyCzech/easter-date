import test from "ava";
import { getHolySaturday, isHolySaturday } from "../lib";
import { fromIsoDate, toIsoDate } from "../lib/date-fns.js";

test("Get Holy Saturday for 10 years", (t) => {
	t.is(toIsoDate(getHolySaturday(2024)), "2024-03-30");
	t.is(toIsoDate(getHolySaturday(2025)), "2025-04-19");
	t.is(toIsoDate(getHolySaturday(2026)), "2026-04-04");
	t.is(toIsoDate(getHolySaturday(2027)), "2027-03-27");
	t.is(toIsoDate(getHolySaturday(2028)), "2028-04-15");
	t.is(toIsoDate(getHolySaturday(2029)), "2029-03-31");
	t.is(toIsoDate(getHolySaturday(2030)), "2030-04-20");
	t.is(toIsoDate(getHolySaturday(2031)), "2031-04-12");
	t.is(toIsoDate(getHolySaturday(2032)), "2032-03-27");
	t.is(toIsoDate(getHolySaturday(2033)), "2033-04-16");
});

test("Get Holy Saturday for 100 years", (t) => {
	// 2105 and above
	t.is(toIsoDate(getHolySaturday(2105)), "2105-04-04");
	t.is(toIsoDate(getHolySaturday(2199)), "2199-04-13");

	// 2200 and above
	t.is(toIsoDate(getHolySaturday(2200)), "2200-04-05");
	t.is(toIsoDate(getHolySaturday(2299)), "2299-04-15");
});

test("Holy Saturday in 2024", (t) => {
	t.true(isHolySaturday(fromIsoDate("2024-03-30")));
});
