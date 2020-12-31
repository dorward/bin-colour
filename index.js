const getBinSchedule = require('./lib/getBinSchedule');
const createCalendar = require('./lib/ical');
const publishToS3 = require('./lib/publishToS3');

(async function () {
	const schedule = await getBinSchedule();
	const calendar = createCalendar(schedule);
	publishToS3(calendar);
})();
