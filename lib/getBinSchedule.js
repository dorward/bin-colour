const puppeteer = require('puppeteer');
const config = require('config');

const address = config.get('address');

const url = 'https://www.tmbc.gov.uk/bins-waste/waste-collection-dates';

const cookieButton = '#cookiescript_reject';
const postcodeBox = '#q752eec300b2ffef2757e4536b77b07061842041a_0_0';
const searchButton = '.btn--lookup';

const handleCookiePrompt = async page => {
	console.log('Handling cookie prompt');
	await page.waitForTimeout(2000);
	const cookies = await page.$(cookieButton);
	if (cookies) {
		console.log('Clicking Decline All button');
		await page.waitForSelector(cookieButton);
		await page.click(cookieButton);
		await page.waitForTimeout(2000);
	}
	return page;
};

const enterPostCode = async page => {
	console.log('Entering post code');
	await page.type(postcodeBox, address.postcode, { delay: 100 });
	await page.click(searchButton);
	await page.waitForTimeout(3000);
};

const pickAddress = async page => {
	console.log('Picking address');
	const xpath = `//option[contains(., '${address.street}')]`;
	const options = await page.$x(xpath);
	const opt = options[0];
	if (!opt) throw new Error('Could not find address in list');
	const value = await (await opt.getProperty('value')).jsonValue();
	if (!value) throw new Error('Could not find address in list');
	const addressElement = await opt.getProperty('parentNode');
	const addressSelector = await (await addressElement.getProperty('id')).jsonValue();
	await page.select(`#${addressSelector}`, value);
};

const clickNext = async page => {
	console.log('Clicking Next');
	const xpath = "//button[contains(., 'Next')]";
	const buttons = await page.$x(xpath);
	const button = buttons[0];
	if (!button) throw new Error('Could not find Next button');
	await button.click();
	return;
};

const getData = async page => {
	console.log('Getting data');
	const resultsTableSelector = '.data-table.waste-collections-table';
	// await new Promise(r => setTimeout(r, 5000));
	await page.waitForSelector(resultsTableSelector);
	const data = await page.$eval(resultsTableSelector, table => {
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
	console.log('Querying');
	await handleCookiePrompt(page);
	await enterPostCode(page);
	await pickAddress(page);
	await clickNext(page);
	const data = await getData(page);
	return data;
};

const getBinSchedule = async () => {
	try {
		const browser = await puppeteer.launch({ devtools: false });
		const page = await browser.newPage();
		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
		);
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
