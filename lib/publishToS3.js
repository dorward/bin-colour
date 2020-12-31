const AWS = require('aws-sdk');
const config = require('config');

const publishToS3 = calendar => {
	const s3 = new AWS.S3(config.get('aws.credentials'));
	const params = {
		Body: calendar,
		...config.get('aws.destination'),
	};

	s3.upload(params, function (err, data) {
		if (err) {
			throw err;
		}
		console.log(`File uploaded successfully. ${data.Location}`);
	});
};

module.exports = publishToS3;
