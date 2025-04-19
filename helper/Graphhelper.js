
const constants = require('../constant/constant');
const utils = require('../utils');

const appendZeroCountForDailyBarGraph = (startDate, endDate, timezone) => {
    const results = [];
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let loop = new Date(startDate);
    while (loop <= endDate) {
        const dates = `${loop.getUTCFullYear()}-${utils.dateInProper(loop.getUTCMonth() + 1)}-${utils.dateInProper(
            loop.getUTCDate(),
        )}T${utils.dateInProper(loop.getHours())}:${utils.dateInProper(loop.getMinutes())}:00.000Z`;
        const updateDate = utils.convertUTCtoSpecificTimezone(new Date(dates), timezone);

        results.push({
            day: updateDate.date(),
            month: updateDate.month() + 1,
            year: updateDate.year(),
            xAxisLabel: `${updateDate.date()} ${utils.getMonthName(updateDate.month())} ${updateDate.year()}`,
            count: 0,
        });
        const newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
    }
    return results;
}

const appendZeroCountForWeeklyBarGraph = (startDate, endDate, timezone) => {
    const results = [];
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let loop = new Date(startDate);
    while (loop <= endDate) {
        const dates = `${loop.getUTCFullYear()}-${utils.dateInProper(loop.getUTCMonth() + 1)}-${utils.dateInProper(
            loop.getUTCDate(),
        )}T${utils.dateInProper(loop.getHours())}:${utils.dateInProper(loop.getMinutes())}:00.000Z`;
        const updateDate = utils.convertUTCtoSpecificTimezone(new Date(dates), timezone);
        const currentWeek = updateDate.isoWeek();
        const weekRange = utils.getWeekRangeByNumber(currentWeek, updateDate.year(), startDate, endDate, timezone);
        results.push({
            week: currentWeek,
            xAxisLabel: weekRange,
            year: loop.getUTCFullYear(),
            count: 0,
        });
        const days = utils.getTimeDifference(endDate, loop, constants.DATE_DIFFERENCE_PARAMETER.DAYS);
        let newDate = loop.setDate(loop.getDate() + 7);
        if (days && days <= 7 && days > 4) {
            newDate = endDate;
        }
        loop = new Date(newDate);
    }
    return results;
}

const appendZeroCountForMonthlyBarGraph = (startDate, endDate, timezone) => {
    const results = [];
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let loop = new Date(startDate);
    while (loop <= endDate) {
        const dates = `${loop.getUTCFullYear()}-${utils.dateInProper(loop.getUTCMonth() + 1)}-${utils.dateInProper(
            loop.getUTCDate(),
        )}T${utils.dateInProper(loop.getHours())}:${utils.dateInProper(loop.getMinutes())}:00.000Z`;
        const updateDate = utils.convertUTCtoSpecificTimezone(new Date(dates), timezone);

        results.push({
            month: updateDate.month(),
            year: updateDate.year(),
            xAxisLabel: `${utils.getMonthName(updateDate.month())} ${updateDate.year()}`,
            count: 0,
        });

        const newDate = loop.setMonth(loop.getMonth() + 1);
        loop = new Date(newDate);
    }
    return results;
}

const appendZeroCountForYearlyBarGraph = (startDate, endDate, timezone) => {
    const results = [];
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let loop = new Date(startDate);
    while (loop <= endDate) {
        const dates = `${loop.getUTCFullYear()}-${utils.dateInProper(loop.getUTCMonth() + 1)}-${utils.dateInProper(
            loop.getUTCDate(),
        )}T${utils.dateInProper(loop.getHours())}:${utils.dateInProper(loop.getMinutes())}:00.000Z`;
        const updateDate = utils.convertUTCtoSpecificTimezone(new Date(dates), timezone);
        results.push({
            year: updateDate.year(),
            xAxisLabel: `${updateDate.year()}`,
            count: 0,
        });

        const newDate = loop.setFullYear(loop.getFullYear() + 1);
        loop = new Date(newDate);
    }
    return results;
}

const appendZeroForCertainHours = (startDate, endDate, timezone, groupBy) => {
    const results = [];
    let count = 0;
    const interval =
        groupBy === constants.BAR_GROUP_BY.PAST_ONE_DAY
            ? constants.GROUP_BY_PAST_ONE_DAY_HOUR_INTERVAL
            : constants.GROUP_BY_DAY_HOUR_INTERVAL;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    endDate = new Date(endDate.setHours(endDate.getHours() + 1));
    let loop = new Date(startDate);
    let intervalLoop = loop.getUTCHours() + interval;
    while (loop <= endDate) {
        const dates = `${loop.getUTCFullYear()}-${utils.dateInProper(loop.getUTCMonth() + 1)}-${utils.dateInProper(
            loop.getUTCDate(),
        )}T${utils.dateInProper(loop.getHours())}:${utils.dateInProper(loop.getMinutes())}:00.000Z`;

        const updateDate = utils.convertUTCtoSpecificTimezone(new Date(dates), timezone);
        if (loop.getUTCHours() === intervalLoop) {
            const lastHourDate = moment(updateDate);
            lastHourDate.set({
                hour: updateDate.hours() - interval,
            });
            results.push({
                hour: updateDate.hours(),
                day: updateDate.date(),
                month: updateDate.month(),
                year: updateDate.year(),
                xAxisLabel: `${utils.convert24HourTimeTo12HourFormat(
                    lastHourDate.hours(),
                )} - ${utils.convert24HourTimeTo12HourFormat(updateDate.hours())}`,
                count: count,
            });
            count = 0;
            intervalLoop = intervalLoop + interval;
        }
        if (intervalLoop >= 24) {
            intervalLoop = intervalLoop - 24;
        }
        loop = new Date(startDate.setHours(startDate.getHours() + 1));
    }

    endDate = new Date(endDate.setHours(endDate.getHours() - 1));
    const dates = `${endDate.getFullYear()}-${utils.dateInProper(endDate.getMonth() + 1)}-${utils.dateInProper(
        endDate.getDate(),
    )}T${utils.dateInProper(endDate.getHours())}:${utils.dateInProper(endDate.getMinutes())}:00.000Z`;
    const startDateClientTimezone = utils.convertUTCtoSpecificTimezone(new Date(dates), timezone);
    if (startDateClientTimezone.minutes() != 59) {
        results.push({
            hour: startDateClientTimezone.hours(),
            day: startDateClientTimezone.date(),
            month: startDateClientTimezone.month(),
            year: startDateClientTimezone.year(),
            xAxisLabel: `${utils.convert24HourTimeTo12HourFormat(startDateClientTimezone.hours())} -Present`,
            count: count,
        });
    }
    return results;
}

const getGroupByParameter = (reportDto) => {
    let groupBy = constants.BAR_GROUP_BY.DAYS;
    if (reportDto.startDate && reportDto.endDate) {
        const diff = utils.getTimeDifference(
            new Date(reportDto.endDate),
            new Date(reportDto.startDate),
            constants.DATE_DIFFERENCE_PARAMETER.HOURS,
        );
        if (diff <= 24) {
            groupBy = constants.BAR_GROUP_BY.HOURS;
        } else if (diff < 48) {
            groupBy = constants.BAR_GROUP_BY.PAST_ONE_DAY;
        } else if (diff <= 240) {
            groupBy = constants.BAR_GROUP_BY.DAYS;
        } else if (diff <= 1680) {
            groupBy = constants.BAR_GROUP_BY.WEEKS;
        } else if (diff <= 8784) {
            groupBy = constants.BAR_GROUP_BY.MONTHS;
        } else {
            groupBy = constants.BAR_GROUP_BY.YEARS;
        }
    }
    return groupBy;
}

const appendDateFields = (groupBy, record) => {
    const time = new Date(record.time);
    if (groupBy === constants.BAR_GROUP_BY.HOURS || groupBy === constants.BAR_GROUP_BY.PAST_ONE_DAY) {
        record.hour = time.getHours();
        record.day = time.getDate();
        record.month = time.getMonth();
        record.year = time.getFullYear();
    } else if (groupBy === constants.BAR_GROUP_BY.DAYS) {
        record.day = time.getDate();
        record.month = time.getMonth();
        record.year = time.getFullYear();
    } else if (groupBy === constants.BAR_GROUP_BY.WEEKS) {
        record.week = utils.getWeek(time);
        record.month = time.getMonth();
        record.year = time.getFullYear();
    } else if (groupBy === constants.BAR_GROUP_BY.MONTHS) {
        record.month = time.getMonth();
        record.year = time.getFullYear();
    } else if (groupBy === constants.BAR_GROUP_BY.YEARS) {
        record.year = time.getFullYear();
    }
    return record;
}

const appendZero = async (reportDto, groupBy) => {
    if (groupBy === constants.BAR_GROUP_BY.HOURS || groupBy === constants.BAR_GROUP_BY.PAST_ONE_DAY) {
        return appendZeroForCertainHours(reportDto.startDate, reportDto.endDate, reportDto.timezone, groupBy);
    } else if (groupBy === constants.BAR_GROUP_BY.DAYS) {
        return appendZeroCountForDailyBarGraph(reportDto.startDate, reportDto.endDate, reportDto.timezone);
    } else if (groupBy === constants.BAR_GROUP_BY.WEEKS) {
        return appendZeroCountForWeeklyBarGraph(reportDto.startDate, reportDto.endDate, reportDto.timezone);
    } else if (groupBy === constants.BAR_GROUP_BY.MONTHS) {
        return appendZeroCountForMonthlyBarGraph(reportDto.startDate, reportDto.endDate, reportDto.timezone);
    } else {
        return appendZeroCountForYearlyBarGraph(reportDto.startDate, reportDto.endDate, reportDto.timezone);
    }
}

module.exports = { getGroupByParameter, appendDateFields, appendZero };