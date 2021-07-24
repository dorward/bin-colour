const ical = require('ical-generator');
const config = require('config');
const { parse, isPast, addYears, addMinutes } = require('date-fns');

const referenceDate = addMinutes(new Date(), 10);
const createCalendar = schedule => {
	const cal = ical({
		domain: config.get('ical.domain'),
		name: config.get('ical.name'),
	});

	schedule.forEach(([dateString, service]) => {
		if (dateString === 'Next collection date') return;

		const parsed = parse(dateString, 'EEE d LLLL', referenceDate);
		const date = isPast(parsed) ? addYears(parsed, 1) : parsed;

		const event = cal.createEvent({
			start: date.toISOString(),
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
