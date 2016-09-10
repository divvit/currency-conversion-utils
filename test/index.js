var should = require('chai').should();
var expect = require('chai').expect;
var Converter = require('../index');
var moment = require('moment');
const assert = require('chai').assert;

function makeTests(converter, description) {
   describe(description, function () {

      it('should convert from USD to EUR', function (done) {
         this.timeout(10000);
         converter.convert(10, moment('2015-01-01'), 'USD', 'EUR', function (err, result) {
            should.not.exist(err);
            expect(result.value).to.be.within(8, 9);
            done();
         });

      });

      it('should convert from USD to USD', function (done) {
         converter.convert(10, moment('2015-01-01'), 'USD', 'USD', function (err, result) {
            should.not.exist(err);
            assert.equal(result.usedDate, null);
            expect(result.value).equals(10);
            done();
         });

      });

      it('should convert from USD to SEK and back', function (done) {
         this.timeout(10000);
         var originalValue = 15;

         converter.convert(originalValue, moment('2015-01-01'), 'USD', 'SEK', function (err, result) {
            should.not.exist(err);

            converter.convert(result.value, moment('2015-01-01'), 'SEK', 'USD', function (err, backConverted) {
               should.not.exist(err);
               expect(Math.round(backConverted.value)).to.equal(originalValue);
               done();
            });

         });

      });

      it('should use different exchange rates on different days', function (done) {
         this.timeout(10000);
         var originalValue = 15;

         converter.convert(originalValue, moment('2015-01-01'), 'USD', 'SEK', function (err, result2015) {
            should.not.exist(err);
            converter.convert(result2015.value, moment('2016-01-01'), 'USD', 'SEK', function (err, result2016) {
               should.not.exist(err);
               expect(result2015.value).to.not.equal(result2016.value);
               done();
            });

         });

      });

      it('should throw an error for unknown currencies', function (done) {
         this.timeout(10000);
         converter.convert(16, moment('2015-01-01'), 'USD', 'XYZ', function (err, result) {
            should.exist(err);
            done();
         });
      });

      it('should throw an error for empty date', function (done) {
         this.timeout(10000);
         converter.convert(16, null, 'USD', 'XYZ', function (err, convertedValue) {
            should.exist(err);
            done();
         });
      });

      it('should throw an error for NaN', function (done) {
         this.timeout(10000);
         converter.convert('not a number', moment('2015-01-01'), 'USD', 'EUR', function (err, result) {
            should.exist(err);
            done();
         });
      });

      it('should round conversion result', function (done) {
         this.timeout(10000);
         var originalValue = 15;

         converter.convert(originalValue, moment('2015-01-01'), 'USD', 'SEK', function (err, result) {
            should.not.exist(err);
            result.value.should.equal(Math.round(result.value * 100) / 100);
            done();
         });

      });
      it('test weekday', function (done) {
         this.timeout(10000);
         converter.convert(15, moment('2016-09-05'), 'USD', 'SEK', function (err, result) {
            should.not.exist(err);
            assert.equal(result.usedDate, '2016-09-05');
            done();
         });
      });
      it('test saturday', function (done) {
         this.timeout(10000);
         converter.convert(15, moment('2016-09-03'), 'USD', 'SEK', function (err, result) {
            should.not.exist(err);
            assert.equal(result.usedDate, '2016-09-02');
            done();
         });
      });
      it('test sunday', function (done) {
         this.timeout(10000);
         converter.convert(15, moment('2016-09-04'), 'USD', 'SEK', function (err, result) {
            should.not.exist(err);
            assert.equal(result.usedDate, '2016-09-02');
            done();
         });
      });
      it('test holiday', function (done) {
         this.timeout(10000);
         converter.convert(15, moment('2016-01-01'), 'USD', 'SEK', function (err, result) {
            should.not.exist(err);
            assert.equal(result.usedDate, '2015-12-31');
            done();
         });
      });

      // NOTE: this test simulates a real-time situation where we use the rates of the day before.
      it('test realtime usage!', function (done) {
         this.timeout(10000);
         var now = moment();
         converter.convert(15, now, 'USD', 'SEK', function (err, result) {
            should.not.exist(err);
            assert.ok(now.isAfter(moment(result.usedDate)));
            done();
         });
      });
   });
}

makeTests(new Converter(false, null), '#CurrencyConverter - BinarySearch only.');
makeTests(new Converter(true, null), '#CurrencyConverter - Use extra map.');
makeTests(Converter.getDefaultInstance(), '#CurrencyConverter - Singleton.');
