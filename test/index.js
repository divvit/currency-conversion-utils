var should = require('chai').should();
var expect = require('chai').expect;
var converter = require('../index')();
var moment = require('moment');

describe('#CurrencyConverter', function() {

   it('should convert from USD to EUR', function(done) {
      this.timeout(10000);
      converter.convert(10, moment('2015-01-01'), 'USD', 'EUR', function(err, convertedValue) {
         should.not.exist(err);

         expect(convertedValue).to.be.within(8,9);
         done();
      });

   });

   it('should convert from USD to SEK and back', function(done) {
      this.timeout(10000);
      var originalValue = 15;

      converter.convert(originalValue, moment('2015-01-01'), 'USD', 'SEK', function(err, convertedValue) {
         should.not.exist(err);

         converter.convert(convertedValue, moment('2015-01-01'), 'SEK', 'USD', function(err, backConvertedValue) {
            should.not.exist(err);

            expect(Math.round(backConvertedValue)).to.equal(originalValue);
            done();
         });

      });

   });

   it('should use different exchange rates on different days', function(done) {
      this.timeout(10000);
      var originalValue = 15;

      converter.convert(originalValue, moment('2015-01-01'), 'USD', 'SEK', function(err, convertedValue2015) {
         should.not.exist(err);

         converter.convert(originalValue, moment('2016-01-01'), 'USD', 'SEK', function(err, convertedValue2016) {
            should.not.exist(err);

            expect(convertedValue2015).to.not.equal(convertedValue2016);
            done();
         });

      });

   });

   it('should throw an error for unknown currencies', function(done) {
      this.timeout(10000);
      converter.convert(16, moment('2015-01-01'), 'USD', 'XYZ', function(err, convertedValue) {
         should.exist(err);
         done();
      });
   });

   it('should throw an error for empty date', function(done) {
      this.timeout(10000);
      converter.convert(16, null, 'USD', 'XYZ', function(err, convertedValue) {
         should.exist(err);
         done();
      });
   });

   it('should throw an error for NaN', function(done) {
      this.timeout(10000);
      converter.convert('not a number', moment('2015-01-01'), 'USD', 'EUR', function(err, convertedValue) {
         should.exist(err);
         done();
      });
   });

});

