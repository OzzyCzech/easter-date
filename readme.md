# Easter date

[![NPM Downloads](https://img.shields.io/npm/dm/easter-date?style=for-the-badge)](https://www.npmjs.com/package/easter-date)
[![NPM Version](https://img.shields.io/npm/v/easter-date?style=for-the-badge)](https://www.npmjs.com/package/easter-date)
[![NPM License](https://img.shields.io/npm/l/easter-date?style=for-the-badge)](https://github.com/OzzyCzech/easter-date/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/OzzyCzech/easter-date?style=for-the-badge)](https://github.com/OzzyCzech/easter-date/commits/main)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/OzzyCzech/easter-date/main.yml?style=for-the-badge)](https://github.com/OzzyCzech/easter-date/actions)

Simple library that calculates the date of Easter for a given year and other Easter days.

## Install package

```shell
npm i easter-date
```

or

```shell
yarn add easter-date
```

## Functions

Every Easter day comes in two forms: a `Date` and a calendar date without a time zone.

| Day           | `Date` (midnight UTC) | Calendar date              | Check            |
| ------------- | --------------------- | -------------------------- | ---------------- |
| Good Friday   | `getGoodFriday`       | `getGoodFridayPlainDate`   | `isGoodFriday`   |
| Holy Saturday | `getHolySaturday`     | `getHolySaturdayPlainDate` | `isHolySaturday` |
| Easter Sunday | `getEaster`           | `getEasterPlainDate`       | `isEaster`       |
| Easter Monday | `getEasterMonday`     | `getEasterMondayPlainDate` | `isEasterMonday` |

`getEasterSunday` and `isEasterSunday` are aliases of `getEaster` and `isEaster`.

### Get a date

The `get*` functions take a year and return a `Date` at **midnight UTC** of that day.
Read it in UTC: with `toISOString()`, the `getUTC*()` methods or `timeZone: "UTC"`.
Local getters and `toLocaleDateString()` without a time zone show the previous day in time zones west of UTC.

```javascript
import { getEaster, getEasterMonday, getGoodFriday } from "easter-date";

getEaster(2024).toISOString(); // "2024-03-31T00:00:00.000Z"
getGoodFriday(2024).toISOString().slice(0, 10); // "2024-03-29"
getEasterMonday(2024).toLocaleDateString("en-US", { timeZone: "UTC" }); // "4/1/2024"
```

### Get a calendar date

The `get*PlainDate` functions return the calendar date as `{ year, month, day }`, with a 1-based month.
There is no time and no time zone to get wrong.
[`Temporal.PlainDate.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/from) accepts it as it is.

```javascript
import { getEasterMondayPlainDate, getEasterPlainDate } from "easter-date";

getEasterPlainDate(2024); // { year: 2024, month: 3, day: 31 }
getEasterMondayPlainDate(2024); // { year: 2024, month: 4, day: 1 }

Temporal.PlainDate.from(getEasterPlainDate(2024)).toString(); // "2024-03-31"
```

The type of these objects is exported as `PlainDateLike`.

### Check a date

The `is*` functions accept a `Date` or a calendar date:

- a `Date` is read as its **local** calendar day (`getFullYear()`, `getMonth()`, `getDate()`), in the time zone of the process,
- a `{ year, month, day }` object is compared by its fields, with no time zone involved.
  The fields are integers in the ISO (Gregorian) calendar, with a 1-based month.
  A Temporal object, such as a `Temporal.PlainDate`, is converted to the ISO calendar first, so a Buddhist or Hebrew date works too.

Anything else, such as a string, a timestamp or an invalid `Date`, throws a `TypeError`.

```javascript
import { isEaster, isEasterMonday } from "easter-date";

isEaster(new Date(2024, 2, 31)); // true, local date (the month is 0-based)
isEaster(new Date(2024, 2, 31, 23, 30)); // true
isEaster({ year: 2024, month: 3, day: 31 }); // true
isEaster(Temporal.PlainDate.from("2024-03-31")); // true

// Is it Easter Monday in Prague, whatever the time zone of the process?
isEasterMonday(Temporal.Now.plainDateISO("Europe/Prague"));
```

**Do not pass a `get*` result back to `is*` west of UTC.**
A `Date` at midnight UTC, such as `getEaster(2024)` or `new Date("2024-03-31")`, is still the previous day there, so `isEaster(getEaster(2024))` is `false` in New York.
For a round trip, use the calendar dates: `isEaster(getEasterPlainDate(2024))` is `true` in every time zone.

### Get Holy Week

Function `getHolyWeek` returns the days from Palm Sunday to Easter Monday for a given year.
Each day has a `name`, a `date` (midnight UTC) and a `plainDate`:

```javascript
import { getHolyWeek } from "easter-date";

const holyWeek = getHolyWeek(2024);

holyWeek.palmSunday.name; // "Palm Sunday"
holyWeek.palmSunday.date.toISOString(); // "2024-03-24T00:00:00.000Z"
holyWeek.palmSunday.plainDate; // { year: 2024, month: 3, day: 24 }
```

## Upgrading to 3.0

`isEaster`, `isEasterSunday`, `isGoodFriday`, `isHolySaturday` and `isEasterMonday` now read the **local** calendar day of a `Date` and compare it with the calendar date of the Easter day.
In 2.x they compared it with the local day of the `get*` result, which is midnight UTC.
In time zones west of UTC (e.g. the Americas), every check answered for the day before: `isEaster(new Date(2024, 2, 31))` was `false` and `isEaster(new Date(2024, 2, 30))` was `true`.

In UTC and in time zones east of it (e.g. Europe, Asia, Australia), nothing changes.
In time zones west of UTC:

- local dates, such as `new Date()` or `new Date(2024, 2, 31)`, now give the right answer,
- a `Date` at midnight UTC, such as `new Date("2024-03-31")` or `getEaster(2024)`, is now read as the previous local day, so `isEaster(getEaster(2024))` is `false`.
  Pass a calendar date instead: `isEaster(getEasterPlainDate(2024))` or `isEaster({ year: 2024, month: 3, day: 31 })`.

An invalid `Date`, such as `new Date("not a date")`, now throws a `TypeError`; 2.x returned `false`.
Strings, numbers and other objects without `getFullYear()` threw a `TypeError` in 2.x already.

The `get*` functions still return the same `Date` at midnight UTC for every year from 100 on.
For the years 0–99 they now return that year.
2.x built the date with `Date.UTC()`, which maps these years to 1900–1999:
`getEaster(50)` was `1950-03-27T00:00:00.000Z` and is now `0050-03-27T00:00:00.000Z`.

## Running Tests

```shell
npm run test
```

## Credits

- [Easter dates calculation](https://github.com/paulzag/ZagZ-iCalendars) for the Easter dates
- [Svatý týden](https://cs.wikipedia.org/wiki/Svat%C3%BD_t%C3%BDden) for names of the Easter days
- [Online calendar](https://calendar.center/) for verifying the data

## License

[MIT](./LICENSE)

Made with ❤️ by the [Roman Ožana](https://ozana.cz)
