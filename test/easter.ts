import test from 'ava';
import {
	fromIsoDate, getEaster, ieEaster, toIsoDate,
} from '../lib/index.js';

test('Easter date for 10 years', t => {
	t.is(toIsoDate(getEaster(2024)), '2024-03-31');
	t.is(toIsoDate(getEaster(2025)), '2025-04-20');
	t.is(toIsoDate(getEaster(2026)), '2026-04-05');
	t.is(toIsoDate(getEaster(2027)), '2027-03-28');
	t.is(toIsoDate(getEaster(2028)), '2028-04-16');
	t.is(toIsoDate(getEaster(2029)), '2029-04-01');
	t.is(toIsoDate(getEaster(2030)), '2030-04-21');
	t.is(toIsoDate(getEaster(2031)), '2031-04-13');
	t.is(toIsoDate(getEaster(2032)), '2032-03-28');
	t.is(toIsoDate(getEaster(2033)), '2033-04-17');
});

test('Easter date for 100 years', t => {
	// 2105 and above
	t.is(toIsoDate(getEaster(2105)), '2105-04-05');
	t.is(toIsoDate(getEaster(2106)), '2106-04-18');

	// 2200 and above
	t.is(toIsoDate(getEaster(2225)), '2225-03-27');
	t.is(toIsoDate(getEaster(2299)), '2299-04-16');
});

test('Easter in 2024', t => {
	t.true(ieEaster(fromIsoDate('2024-03-31')));
});
