import moment from 'moment';

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = ONE_DAY * 7;

export function getWeekOfYear(date) {
    const year = moment(date).year();
    const yearStart = moment([year, 0, 1]).valueOf();
    const yearStartWeek = moment([year, 0, 1]).weekday();
    const yearFirstWeekEnd = yearStart + ((7 - yearStartWeek) * ONE_DAY);
    const dataValue = moment(date).valueOf();

    if (dataValue < yearFirstWeekEnd) {
        return 1;
    }

    return Math.floor((dataValue - yearFirstWeekEnd) / ONE_WEEK) + 2;
}

export function getMonthOfYear(date) {
    return moment(date).month() + 1;
};

export function getWeekEnd(date) {
    const weekDay = moment(date).weekday();
    const dateValue = moment(date).valueOf();

    return dateValue + ((7 - weekDay - 1) * ONE_DAY);
};

export function getMonthEnd(date) {
    const year = moment(date).get('year');
    const month = moment(date).get('month');
    if (month + 1 > 11) {
        return moment([year + 1, 0, 1]).valueOf() - 1
    }
    const monthEnd = moment([year, month + 1, 1]).valueOf() - 1;

    return monthEnd;
};

export default {
    getWeekOfYear,
    getMonthOfYear,
    getWeekEnd,
    getMonthEnd,
};