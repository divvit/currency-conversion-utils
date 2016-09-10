Currency Converter
=========

A small library to convert currencies according to the EZB exchange rates.

## Installation

  npm install @divvit/currency-converter --save

## Usage

```JavaScript
  var converter = require('@divvit/currency-converter')();
  // if you want to change the storage path, call the script like that:
  // var converter = require('@divvit/currency-converter')({ storageDir: '/some/other/path' });
  // the default path is process.env.TMPDIR

  var moment = require('moment');

  var eurValue = 10;
  var conversionDate = moment('2015-01-01');
  converter.convert(eurValue, conversionDate, 'EUR', 'USD', function(err, usdResult) {
    if (err)
      return callback(err);

    console.log('Converted ' + eurValue + ' EUR to ' + usdResult.value + ' USD, according to FX rate of ' . usdResult.usedDate.format('DD.MM.YYYY') );
  });
```

## Important Notes:

- If the queried day exists in the cache then the library uses the queried day for conversion. 
- If the queried day does not exit the library will try to use the nearst day before.

## Tests

  npm test

## Contributing

Nino Ulsamer, Divvit AB

## Release History
* 2.0.0 Fix currency file updates. 
* 2.0.0 Uses data in-memory and binary-search and includes and enriched response.  
* 1.0.3 Fixed issue #1: round currency conversion results to max 2 digits
* 1.0.2 Changed default working directory to __dirname
* 1.0.1 Improved README formatting
* 1.0.0 Initial release
