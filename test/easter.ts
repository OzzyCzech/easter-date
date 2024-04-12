import test from 'ava';
import {fromIsoDate, getEaster, ieEaster,} from '../lib/index.js';

test('Easter date for 10 years', t => {
	t.is(getEaster(2024).toLocaleDateString('cs-CZ'), '31. 3. 2024');
	t.is(getEaster(2025).toLocaleDateString('cs-CZ'), '20. 4. 2025');
	t.is(getEaster(2026).toLocaleDateString('cs-CZ'), '5. 4. 2026');
	t.is(getEaster(2027).toLocaleDateString('cs-CZ'), '28. 3. 2027');
	t.is(getEaster(2028).toLocaleDateString('cs-CZ'), '16. 4. 2028');
	t.is(getEaster(2029).toLocaleDateString('cs-CZ'), '1. 4. 2029');
	t.is(getEaster(2030).toLocaleDateString('cs-CZ'), '21. 4. 2030');
	t.is(getEaster(2031).toLocaleDateString('cs-CZ'), '13. 4. 2031');
	t.is(getEaster(2032).toLocaleDateString('cs-CZ'), '28. 3. 2032');
	t.is(getEaster(2033).toLocaleDateString('cs-CZ'), '17. 4. 2033');
});

test('Easter date for 100 years', t => {
	// 2105 and above
	t.is(getEaster(2105).toLocaleDateString('cs-CZ'), '5. 4. 2105');
	t.is(getEaster(2106).toLocaleDateString('cs-CZ'), '18. 4. 2106');

	// 2200 and above
	t.is(getEaster(2225).toLocaleDateString('cs-CZ'), '27. 3. 2225');
	t.is(getEaster(2199).toLocaleDateString('cs-CZ'), '14. 4. 2199');
});

test('Easter in 2024', t => {
	t.true(ieEaster(fromIsoDate('2024-03-31')));
});
