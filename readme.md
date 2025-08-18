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

Functions are expecting a year as a parameter and return a `Date` object.

### Get Easter date

Function `getEaster` returns Easter date for a given year:

```javascript
import { getEaster } from 'easter-date';

getEaster(2024).toLocaleDateString('en-US'); // return 31/03/2024
```

### Get Good Friday

Function `getGoodFriday` returns Good Friday date for a given year:

```javascript
import { getGoodFriday } from 'easter-date';

getGoodFriday(2024).toLocaleDateString('en-US'); // return 29/03/2024
```

### Get Easter Monday

Function `getEasterMonday` returns Easter Monday date for a given year:

```javascript
import { getEasterMonday } from 'easter-date';

getEasterMonday(2024).toLocaleDateString('en-US'); // return 01/04/2024
```

### Get Holy Week object

Function `getHolyWeek` returns an object of Holy Week dates for a given year:

```javascript
import { getHolyWeek } from 'easter-date';

const holyWeek = getHolyWeek(2024);

holyWeek.palmSunday.name; // return Palm Sunday
holyWeek.palmSunday.date.toLocaleDateString('en-US'); // return 24/03/2024
```

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