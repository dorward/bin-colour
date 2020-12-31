const puppeteer = require('puppeteer');
const config = require('config');

const address = config.get('address');

const url = 'https://www.tmbc.gov.uk/do-it-online/miscellaneous-forms/refuse-and-recycling-collection-dates';

const cookieButton = '#gdpr-cookie-accept';
const postcodeBox = '#spcode';
const searchButton = '#addresslookup';
const errorMessage = '#queryerror';
const nowSelectMessage = '#addresslistlabel > div > p';
const addressSelect = '#addresslist';
const resultsTable = '#collection_schedule_details';

const handleCookiePrompt = async page => {
	await page.waitForTimeout(2000);
	const cookies = await page.$(cookieButton);
	if (cookies) {
		await page.waitForSelector(cookieButton);
		await page.click(cookieButton);
		await page.waitForTimeout(2000);
	}
	return page;
};

const enterPostCode = async page => {
	await page.type(postcodeBox, address.postcode, { delay: 100 });
	await page.waitForTimeout(1500);
	await page.click(searchButton);
	await page.waitForTimeout(3000);
};

const checkForErrorState = async page => {
	const error = await page.$(errorMessage);
	if (error) {
		const message = await error.getProperty('textContent');
		if (/There was a problem with your query/.test(message)) {
			return false;
		}
	}
	return true;
};

const confirmOK = async page => {
	const ok = await page.$(nowSelectMessage);
	const okMessage = await ok.getProperty('textContent');
	if (!/Now select your address/.test(okMessage)) {
		console.log('' + ok);
		throw new Error('Could not find error message or prompt to select address');
	}
};

const pickAddress = async page => {
	const options = await page.$$(`${addressSelect} option`);

	let value = null;
	for (let i = 0; i < options.length; i++) {
		const opt = options[i];
		const text = '' + (await opt.getProperty('textContent'));
		const search = new RegExp(address.street);
		if (search.test(text)) {
			value = '' + (await (await opt.getProperty('value')).jsonValue());
			break;
		}
	}
	if (!value) throw new Error('Could not find address in list');

	await page.select(addressSelect, value);
};

const getData = async page => {
	await page.waitForSelector(resultsTable);
	const data = await page.$eval(resultsTable, table => {
		const data = [];
		const rows = table.rows;
		for (var r = 0; r < rows.length; r++) {
			const row = rows[r];
			const cells = row.cells;
			const row_data = [];
			data.push(row_data);
			for (var c = 0; c < cells.length; c++) {
				const cell = row.cells[c];
				row_data.push(cell.innerText);
			}
		}
		return data;
	});
	return data;
};

const query = async page => {
	await handleCookiePrompt(page);
	await enterPostCode(page);
	const success = await checkForErrorState(page);
	if (!success) {
		await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
		return query(page);
	}
	await confirmOK(page);
	await pickAddress(page);
	const data = await getData(page);
	return data;
};

const getBinSchedule = async () => {
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.goto(url);
		const data = await query(page);
		await browser.close();
		return data;
	} catch (e) {
		process.stderr.write(`There was an unexpected error:\n\n\t${e}\n\n`);
		process.exit(1);
	}
};

module.exports = getBinSchedule;
