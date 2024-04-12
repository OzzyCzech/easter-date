/**
 * Converts a date to an ISO date string (YYYY-MM-dd).
 * @param date
 */
export function toIsoDate(date: Date): string {
	return [
		date.getFullYear(),
		(date.getMonth() + 1).toString().padStart(2, '0'),
		date.getDate().toString().padStart(2, '0'),
	].join('-');
}

/**
 * Converts an ISO date string (YYYY-MM-dd) to a date.
 * @param isoDate
 */
export function fromIsoDate(isoDate: string): Date {
	const [year, month, day] = isoDate.split('-').map(Number);

	if (year === undefined || month === undefined || day === undefined) {
		throw new Error('Invalid date format');
	}

	return new Date(year, month - 1, day);
}

/**
 * Returns true if the two dates are the same day.
 * @param date1
 * @param date2
 */
export function isSameDay(date1: Date, date2: Date): boolean {
	return toIsoDate(date1) === toIsoDate(date2);
}
