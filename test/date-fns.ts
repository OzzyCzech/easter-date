/**
 * Converts a date returned by the library (midnight UTC) to an ISO date
 * string (YYYY-MM-dd). Reads the UTC calendar day, so the result does not
 * depend on the process time zone.
 * @param date
 */
export function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/**
 * Converts an ISO date string (YYYY-MM-dd) to a local date (local midnight),
 * as an `is*` caller would build it with `new Date(year, monthIndex, day)`.
 * @param isoDate
 */
export function fromIsoDate(isoDate: string): Date {
	const [year, month, day] = isoDate.split("-").map(Number);

	if (year === undefined || month === undefined || day === undefined) {
		throw new Error("Invalid date format");
	}

	return new Date(year, month - 1, day);
}
