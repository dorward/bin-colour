# bin-colour

A scraping bot for my local council's bin collection days website (which is surprisingly time consuming to use manually).

It outputs iCal and uploads it AWS S3 where it can be subscribed to in Google, Apple Calendar or whatever.

## Installation instructions

- Run `npm install`
- Rename `sample-default.yml` to `default.yml` and populate the fields (you'll need to configure an S3 bucket)
- Run `node index.js`

## License (ISC)

Copyright 2020 David Dorward

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
