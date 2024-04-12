import test from 'ava';
import {getEasterMonday, isEasterMonday} from '../lib/index.js';
import {fromIsoDate, toIsoDate} from '../lib/date-fns.js';

test('Easter monday date for 10 years', t => {
	t.is(toIsoDate(getEasterMonday(2024)), '2024-04-01');
	t.is(toIsoDate(getEasterMonday(2025)), '2025-04-21');
	t.is(toIsoDate(getEasterMonday(2026)), '2026-04-06');
	t.is(toIsoDate(getEasterMonday(2027)), '2027-03-29');
	t.is(toIsoDate(getEasterMonday(2028)), '2028-04-17');
	t.is(toIsoDate(getEasterMonday(2029)), '2029-04-02');
	t.is(toIsoDate(getEasterMonday(2030)), '2030-04-22');
	t.is(toIsoDate(getEasterMonday(2031)), '2031-04-14');
	t.is(toIsoDate(getEasterMonday(2032)), '2032-03-29');
	t.is(toIsoDate(getEasterMonday(2033)), '2033-04-18');
});

test('Easter monday date 100 years', t => {
	// 2105 and above
	t.is(toIsoDate(getEasterMonday(2105)), '2105-04-06');
	t.is(toIsoDate(getEasterMonday(2106)), '2106-04-19');

	// 2200 and above
	t.is(toIsoDate(getEasterMonday(2225)), '2225-03-28');
	t.is(toIsoDate(getEasterMonday(2299)), '2299-04-17');
});

test('Easter Monday in 2024', t => {
	t.true(isEasterMonday(fromIsoDate('2024-04-01')));
});
