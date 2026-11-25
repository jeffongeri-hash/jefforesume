export function normalizeQuote(meta: Record<string, unknown>) {
  const price = meta.regularMarketPrice;
  const time = meta.regularMarketTime;
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0 ||
      typeof time !== 'number' || !Number.isFinite(time) || time <= 0 || meta.currency !== 'USD') {
    throw new Error('Yahoo returned an invalid quote or non-USD currency');
  }
  return { price, time: new Date(time * 1000).toISOString(), currency: 'USD', source: 'Yahoo Finance' };
}

export function validateSymbols(value: unknown): string[] {
  if (!Array.isArray(value) || !value.length || value.length > 60 ||
      value.some(s => typeof s !== 'string' || !/^[A-Z0-9][A-Z0-9.^=-]{0,14}$/.test(s))) {
    throw new Error('Provide 1–60 valid ticker symbols');
  }
  return [...new Set(value)] as string[];
}