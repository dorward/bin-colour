# bin-colour

A scraping bot for my local council's bin collection days website (which is surprisingly time consuming to use manually).

It outputs iCal and uploads it AWS S3 where it can be subscribed to in Google, Apple Calendar or whatever.

## Installation instructions

- Run `npm install`
- Rename `sample-default.yml` to `default.yml` and populate the fields (you'll need to configure an S3 bucket)
- Run `node index.js`

## LICENSE

See [LICENSE.md](LICENSE.md).
