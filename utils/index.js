const momentTimeZone = require('moment-timezone');
const moment = require('moment');
const constants = require('../constant/constant');

function getDateyyyymmdd(date) {
    const d = new Date(date);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

function getWeek(dt) {
    const tdt = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

function getCommonFormatedDate(date) {
    return moment(date).format('YYYY-MM-DD');
}

function getPastDays(date, day) {
    return moment().subtract(day, 'days');
}

function getFutureDate(date, day) {
    return moment(date).add(day, 'days');
}

function getDateToString() {
    return '%Y-%m-%d';
}

function getDateFromUTCEpoch(milliseconds) {
    if (milliseconds) {
        return new Date(new Date(milliseconds).toUTCString());
    }
    return new Date();
}

function getLastSevenDayPeriod() {
    let period = {};
    period.from = moment.utc().subtract(7, "day").startOf("day").toDate();
    period.to = moment.utc().subtract().startOf("day").toDate();
    return period;
}

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

function getTimeDifference(date1, date2, diffParam) {
    return Math.ceil(moment(date1).diff(moment(date2), diffParam, true)); // diffParameter = days or months or years
}

function convertUTCtoSpecificTimezone(utcTime, timezone = 'Asia/Kolkata') {
    const specificTime = momentTimeZone(utcTime);
    specificTime.tz(timezone);
    return specificTime;
}

function convert24HourTimeTo12HourFormat(time24) {
    let ts = time24.toString();
    const H = +ts.substr(0, 2);
    let h = H % 12 || 12;
    h = h < 10 ? '0' + h : h; // leading 0 at the left for 1 digit hours
    const ampm = H < 12 ? 'AM' : 'PM';
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
}

function dateInProper(n) {
    return (n < 10 ? '0' : '') + n;
}

function showPresentTextfunction(date, timezone) {
    let showPresentText = false;
    date = new Date(date);
    const dates = `${date.getFullYear()}-${dateInProper(date.getMonth() + 1)}-${dateInProper(
        date.getDate(),
    )}T${dateInProper(date.getHours())}:${dateInProper(date.getMinutes())}:00.000Z`;
    const endDateClientTimezone = convertUTCtoSpecificTimezone(new Date(dates), timezone);
    if (endDateClientTimezone.minutes() > 0) {
        showPresentText = true;
    }
    return showPresentText;
}

function getWeekRangeByIsoStartDate(weekStartDate, startDate, endDate, timezone) {
    let weekEndDate = moment(weekStartDate).add(6, 'days');
    startDate = moment(startDate);
    endDate = moment(endDate);
    if (weekEndDate > endDate) {
        weekEndDate = endDate;
    }
    if (weekStartDate < startDate) {
        weekStartDate = startDate;
    }
    weekStartDate = convertUTCtoSpecificTimezone(weekStartDate, timezone);
    weekEndDate = convertUTCtoSpecificTimezone(weekEndDate, timezone);
    if (weekStartDate.month() === weekEndDate.month()) {
        return `${weekStartDate.date()}-${weekEndDate.date()} ${getMonthName(
            weekEndDate.month(),
        )} ${weekEndDate.year()}`;
    } else {
        return `${weekStartDate.date()} ${getMonthName(
            weekStartDate.month(),
        )}-${weekEndDate.date()} ${getMonthName(weekEndDate.month())} ${weekEndDate.year()}`;
    }
}

function getMonthName(month) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[month];
}

function fetchXaxisLabel(UTCDateTime, timezone, groupBy, startDate, endDate, isLastRecord = false) {
    const actualTime = moment(UTCDateTime);
    let showPresentText = false;
    if (groupBy === constants.BAR_GROUP_BY.HOURS) {
        const clientDate = convertUTCtoSpecificTimezone(UTCDateTime, timezone);
        if (isLastRecord) {
            showPresentText = showPresentTextfunction(startDate, timezone);
        }
        const interVal = constants.GROUP_BY_DAY_HOUR_INTERVAL;
        return `${convert24HourTimeTo12HourFormat(clientDate.hours())} - ${
            showPresentText ? 'Present' : convert24HourTimeTo12HourFormat(clientDate.hours() + interVal)
            }`;
    } else if (groupBy === constants.BAR_GROUP_BY.PAST_ONE_DAY) {
        const clientDate = convertUTCtoSpecificTimezone(UTCDateTime, timezone);
        if (isLastRecord) {
            showPresentText = showPresentText(endDate, timezone);
        }
        const interVal = constants.GROUP_BY_PAST_ONE_DAY_HOUR_INTERVAL;
        return `${convert24HourTimeTo12HourFormat(clientDate.hours())} - ${
            showPresentText ? 'Present' : convert24HourTimeTo12HourFormat(clientDate.hours() + interVal)
            }`;
    } else if (groupBy === constants.BAR_GROUP_BY.DAYS) {
        const clientDate = convertUTCtoSpecificTimezone(UTCDateTime, timezone);
        return `${clientDate.date()} ${getMonthName(clientDate.month())} ${clientDate.year()}`;
    } else if (groupBy === constants.BAR_GROUP_BY.WEEKS) {
        return getWeekRangeByIsoStartDate(actualTime, startDate, endDate, timezone);
    } else if (groupBy === constants.BAR_GROUP_BY.MONTHS) {
        const clientDate = convertUTCtoSpecificTimezone(UTCDateTime, timezone);
        return `${getMonthName(clientDate.month())} ${clientDate.year()}`;
    } else if (groupBy === constants.BAR_GROUP_BY.YEARS) {
        const clientDate = convertUTCtoSpecificTimezone(UTCDateTime, timezone);
        return `${clientDate.year()}`;
    }
}

function getDateOfISOWeek(w, y) {
    const simple = new Date(y, 0, 1 + (w - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function getWeekRangeByNumber(week, year, startDate, endDate, timezone) {
    let weekStartDate = getDateOfISOWeek(week, year);
    let weekEndDate = new Date(new Date(weekStartDate).setDate(weekStartDate.getDate() + 6));
    if (weekStartDate < startDate) {
        weekStartDate = startDate;
    }
    if (weekEndDate > endDate) {
        weekEndDate = endDate;
    }
    weekEndDate = convertUTCtoSpecificTimezone(weekEndDate, timezone);
    weekStartDate = convertUTCtoSpecificTimezone(weekStartDate, timezone);
    if (weekStartDate.month() === weekEndDate.month()) {
        return `${weekStartDate.date()}-${weekEndDate.date()} ${getMonthName(
            weekEndDate.month(),
        )} ${weekEndDate.year()}`;
    } else {
        return `${weekStartDate.date()} ${getMonthName(
            weekStartDate.month(),
        )}-${weekEndDate.date()} ${getMonthName(weekEndDate.month())}${weekEndDate.year()}`;
    }
}

module.exports = {
    getTimeDifference,
    fetchXaxisLabel,
    getDateyyyymmdd,
    getCommonFormatedDate,
    getPastDays,
    getFutureDate,
    getDateToString,
    getDateFromUTCEpoch,
    getLastSevenDayPeriod,
    getWeek,
    delay,
    dateInProper,
    convertUTCtoSpecificTimezone,
    getWeekRangeByNumber,
    getMonthName
};