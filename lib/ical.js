const ical = require('ical-generator');
const config = require('config');
const { DateTime } = require('luxon');

const createCalendar = schedule => {
	const cal = ical({
		domain: config.get('ical.domain'),
		name: config.get('ical.name'),
	});

	schedule.forEach(([date, service]) => {
		if (date === 'DATE') return;
		const day = DateTime.fromFormat(date, 'dd/MM/yyyy');
		const event = cal.createEvent({
			start: day.toString(),
			allDay: true,
			summary: service,
			location: config.get('ical.location'),
			url: config.get('ical.source'),
		});
		event.createAlarm({ type: 'display', trigger: 60 * 60 * 8 }); // Alarm 8 hours before
	});

	return cal.toString();
};

module.exports = createCalendar;
