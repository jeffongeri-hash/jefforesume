import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQuote, validateSymbols } from '../supabase/functions/yahoo-prices/quote';

test('Yahoo USD market quote retains price and provider timestamp', () => {
  assert.deepEqual(normalizeQuote({ regularMarketPrice: 123.45, regularMarketTime: 1700000000, currency: 'USD' }), {
    price: 123.45, time: '2023-11-14T22:13:20.000Z', currency: 'USD', source: 'Yahoo Finance',
  });
});
test('reject invalid prices and non-USD quotes instead of misleading dollar amounts', () => {
  for (const price of [0, -10, NaN, undefined]) assert.throws(() => normalizeQuote({ regularMarketPrice: price, regularMarketTime: 1700000000, currency: 'USD' }));
  assert.throws(() => normalizeQuote({ regularMarketPrice: 10, regularMarketTime: 1700000000, currency: 'EUR' }));
});
test('validate and deduplicate requested Yahoo tickers', () => {
  assert.deepEqual(validateSymbols(['AAPL', 'BRK-B', 'AAPL']), ['AAPL', 'BRK-B']);
  for (const value of [[], ['../../'], Array(61).fill('AAPL'), ['aapl'], 'AAPL']) assert.throws(() => validateSymbols(value));
});