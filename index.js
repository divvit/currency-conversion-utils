"use strict";

var async = require('async');
var moment = require('moment');
var fs = require('fs');
var http = require('http');
var AdmZip = require('adm-zip');

module.exports = function() {
   return new CurrencyConverter();
}

var CurrencyConverter = function(options) {
   options = options || {};

   this.options = {
      storageDir: options.storageDir || __dirname
   };
};

CurrencyConverter.prototype.convert = function(currencyValue, conversionDate, fromCurrency, toCurrency, callback) {

   var updateRequired = false;
   var storageDir = this.options.storageDir;
   var feedFilepathZipped = storageDir + '/eurofxref-hist.zip';
   var feedFilepath = storageDir + '/eurofxref-hist.csv';
   var FEED_CSV_SEPARATOR = ',';

   if (parseFloat(currencyValue) != currencyValue)
      return callback('Currency value is not a number');

   async.series([

      // check if the currency rate feed requires updating
      function checkUpdateRequired(callback) {
         fs.stat(feedFilepath, function(err, stats) {
            if (err && err.code === 'ENOENT') {
               // file does not exist -> download
               updateRequired = true;
            } else if (err) {
               return callback(err);
            } else {
               if (!moment(stats.mtime).subtract(1, 'days').isAfter(conversionDate, 'day')) {
                  // file needs updating
                  updateRequired = true;
               }
            }

            callback();
         });
      },

      // update the currency rate feed if outdated or not existing
      function updateFile(callback) {
         if (updateRequired) {
            var file = fs.createWriteStream(feedFilepathZipped);

            var request = http.get('http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.zip', function(response) {
               response.pipe(file);
               file.on('finish', function() {
                  file.close(function(err) {
                     if (err)
                        return callback(err);

                     // unzip file
                     var zip = new AdmZip(feedFilepathZipped);
                     zip.extractEntryTo('eurofxref-hist.csv', storageDir, false, true);

                     callback();
                  });
               });
            }).on('error', function(err) {
               return callback(err);
            });
         } else {
            callback();
         }
      }

      ], function done(err) {
         if (err)
            return callback(err);

         fs.readFile(feedFilepath, 'utf8', function (err, data) {
            if (err)
               return callback(err);

            var array = data.toString().split('\n');

            // first line contains currency codes, ignore first column (date)
            var currencyCodes = array.shift().split(FEED_CSV_SEPARATOR);
            currencyCodes.shift();

            for (var i in array) {
               var line = array[i];
               var conversionRates = line.split(FEED_CSV_SEPARATOR);
               var date = conversionRates.shift();

               // try to find the date. don't only look for exact matches, because weekends do not get data for example.
               // instead, we know that the file is sorted by date DESC and therefore we stop when we find the first date
               // that is before or on (=not after) the date we are looking for
               if (!moment(date).isAfter(conversionDate, 'day')) {
                  // we found our day! now search for currency
                  var fromCurrencyConversion = 1;
                  if (fromCurrency !== 'EUR') {
                     if (currencyCodes.indexOf(fromCurrency) !== -1) {
                        fromCurrencyConversion = conversionRates[currencyCodes.indexOf(fromCurrency)];
                     } else {
                        return callback('Could not find source currency '+fromCurrency);
                     }
                  }

                  var toCurrencyConversion = 1;
                  if (toCurrency !== 'EUR') {
                     if (currencyCodes.indexOf(toCurrency) !== -1) {
                        toCurrencyConversion = conversionRates[currencyCodes.indexOf(toCurrency)];
                     } else {
                        return callback('Could not find target currency '+toCurrency);
                     }
                  }

                  return callback(null, currencyValue / fromCurrencyConversion * toCurrencyConversion);
               }
            }

            callback('Could not find currency data for date ' + conversionDate.format());
         });
      }
   );
};
