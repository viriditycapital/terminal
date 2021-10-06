const express = require('express');
const yahooFinance = require('yahoo-finance2').default; // NOTE the .default

const app = express();
const port = process.env.PORT || 3000;
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};

app.get('/api', (req, res) => {
  res.send(mockResponse);
});

app.get('/api/stonks', async (req, res) => {
  const results = await yahooFinance.search('AAPL');

  res.send(results);
});

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});