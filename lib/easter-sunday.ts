/**
 * Returns the date of Easter for a given year.
 * Function is an alias for getEasterSunday() function
 * @param year
 */
export function getEaster(year: number): Date {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4; // eslint-disable-line unicorn/prevent-abbreviations
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = ((19 * a) + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + (2 * e) + (2 * i) - h - k) % 7;
	const m = Math.floor((a + (11 * h) + (22 * l)) / 451);
	const month = Math.floor((h + l - (7 * m) + 114) / 31);
	const day = ((h + l - (7 * m) + 114) % 31) + 1;

	return new Date(year, month - 1, day);
}

/**
 * Returns true if the given date is Easter Sunday.
 * @param date
 */
export function isEaster(date: Date): boolean {
	const easter = getEaster(date.getFullYear());
	return date.getFullYear() === easter.getFullYear()
		&& date.getMonth() === easter.getMonth()
		&& date.getDate() === easter.getDate();
}

/**
 * Returns the date of Easter for a given year.
 * @param year
 */
export function getEasterSunday(year: number): Date {
	return getEaster(year);
}

/**
 * Returns true if the given date is Easter Sunday.
 * @param date
 */
export function isEasterSunday(date: Date): boolean {
	return isEaster(date);
}
