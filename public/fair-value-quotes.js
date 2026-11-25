// Imported watchlist integration; all quotes are transient, never saved as manual closes.
if (window === window.parent) {
  window.location.replace('/fair-value-monitor');
} else {
  const refreshButton = document.getElementById('refresh');
  const quoteStatus = document.getElementById('quote-status');
  let timeout;
  function finish(message) {
    clearTimeout(timeout);
    refreshButton.disabled = false;
    quoteStatus.textContent = message;
  }
  function refreshQuotes() {
    if (refreshButton.disabled || !stocks.length) return;
    refreshButton.disabled = true;
    quoteStatus.textContent = 'Checking Yahoo Finance…';
    window.parent.postMessage({ type: 'fair-value-quotes', symbols: stocks.map(r => r.ticker) }, window.location.origin);
    timeout = setTimeout(() => finish('Quotes unavailable: request timed out. Stored prices remain.'), 90000);
  }
  window.addEventListener('message', event => {
    if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'fair-value-quotes-result') return;
    const { quotes = {}, errors = {}, error } = event.data;
    stocks.forEach(r => {
      if (quotes[r.ticker]) r.yahoo = quotes[r.ticker];
      r.quoteError = error || errors[r.ticker] || '';
    });
    render(); choose(); reviewSummary();
    const count = Object.keys(quotes).length;
    finish(error ? `Yahoo prices unavailable: ${error}. Stored prices remain.` : `${count}/${stocks.length} Yahoo quotes · checked ${new Date().toLocaleTimeString()}${Object.keys(errors).length ? ' · some unavailable' : ''}`);
  });
  // Do not carry old provider quotes into a fresh browser session or CSV closes.
  stocks.forEach(r => { delete r.yahoo; delete r.quoteError; });
  refreshButton.onclick = refreshQuotes;
  refreshQuotes();
  setInterval(() => { if (!document.hidden) refreshQuotes(); }, 300000);
}