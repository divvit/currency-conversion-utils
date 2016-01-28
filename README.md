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
  converter.convert(eurValue, conversionDate, 'EUR', 'USD', function(err, usdValue) {
    if (err)
      return callback(err);

    console.log('Converted ' + eurValue + ' EUR to ' + usdValue + ' USD, according to FX rate of ' . conversionDate.format('DD.MM.YYYY') );
  });
```

## Tests

  npm test

## Contributing

Nino Ulsamer, Divvit AB

## Release History

* 1.0.0 Initial release
