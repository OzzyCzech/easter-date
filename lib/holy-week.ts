import {getEaster} from './easter-sunday.js';

type HolyWeek = {
	palmSunday: { name: string; date: Date; };
	holyMonday: { name: string; date: Date; };
	holyTuesday: { name: string; date: Date; };
	holyWednesday: { name: string; date: Date; };
	maundyThursday: { name: string; date: Date; };
	goodFriday: { name: string; date: Date; };
	holySaturday: { name: string; date: Date; };
	easterSunday: { name: string; date: Date; };
	easterMonday: { name: string; date: Date; };
};

/**
 * Returns the dates of Holy Week for a given year.
 * Holly Week starts on Palm Sunday and ends on Easter Monday.
 * @param year
 */
export function getHolyWeek(year: number): HolyWeek {
	const easterDate = getEaster(year);

	const addDays = (date: Date, days: number) => {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + days);
		return newDate;
	};

	return {
		palmSunday: {
			name: 'Palm Sunday',
			date: addDays(easterDate, -7),
		},
		holyMonday: {
			name: 'Holy Monday',
			date: addDays(easterDate, -6),
		},
		holyTuesday: {
			name: 'Holy Tuesday',
			date: addDays(easterDate, -5),
		},
		holyWednesday: {
			name: 'Holy Wednesday',
			date: addDays(easterDate, -4),
		},
		maundyThursday: {
			name: 'Maundy Thursday',
			date: addDays(easterDate, -3),
		},
		goodFriday: {
			name: 'Good Friday',
			date: addDays(easterDate, -2),
		},
		holySaturday: {
			name: 'Holy Saturday',
			date: addDays(easterDate, -1),
		},
		easterSunday: {
			name: 'Easter Sunday',
			date: easterDate,
		},
		easterMonday: {
			name: 'Easter Monday',
			date: addDays(easterDate, 1),
		},
	};
}
