const { app } = require('@azure/functions');
const holiday_jp = require('@holiday-jp/holiday_jp');
const moment = require('moment');
const { Parser } = require('json2csv');

app.http('Get-Calendar', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const startDate = moment().subtract(6, 'months').startOf('month');
        const endDate = moment().add(2, 'years').endOf('month');
        const dates = [];

        for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
            const date = m.toDate();
            const isHoliday = holiday_jp.isHoliday(date) || m.day() === 0 || m.day() === 6;
            dates.push({ date: m.format('YYYY-MM-DD'), isHoliday });
        }

        const parser = new Parser();
        const csv = parser.parse(dates);

        return { body: csv };
    }
});