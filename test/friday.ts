import test from 'ava';
import {
	fromIsoDate, getGoodFriday, isGoodFriday, toIsoDate,
} from '../lib/index.js';

test('Good Friday date for 10 years', t => {
	t.is(toIsoDate(getGoodFriday(2024)), '2024-03-29');
	t.is(toIsoDate(getGoodFriday(2025)), '2025-04-18');
	t.is(toIsoDate(getGoodFriday(2026)), '2026-04-03');
	t.is(toIsoDate(getGoodFriday(2027)), '2027-03-26');
	t.is(toIsoDate(getGoodFriday(2028)), '2028-04-14');
	t.is(toIsoDate(getGoodFriday(2029)), '2029-03-30');
	t.is(toIsoDate(getGoodFriday(2030)), '2030-04-19');
	t.is(toIsoDate(getGoodFriday(2031)), '2031-04-11');
	t.is(toIsoDate(getGoodFriday(2032)), '2032-03-26');
	t.is(toIsoDate(getGoodFriday(2033)), '2033-04-15');
});

test('Good Friday date for 100 years', t => {
	// 2105 and above
	t.is(toIsoDate(getGoodFriday(2105)), '2105-04-03');
	t.is(toIsoDate(getGoodFriday(2106)), '2106-04-16');

	// 2200 and above
	t.is(toIsoDate(getGoodFriday(2225)), '2225-03-25');
	t.is(toIsoDate(getGoodFriday(2299)), '2299-04-14');
});

test('Good Friday in 2024', t => {
	t.true(isGoodFriday(fromIsoDate('2024-03-29')));
});
