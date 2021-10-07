const express = require("express");
const yahooFinance = require("yahoo-finance2").default; // NOTE the .default

const app = express();
const port = process.env.PORT || 3000;
const mockResponse = {
  foo: "bar",
  bar: "foo",
};

app.get("/api", (req, res) => {
  res.send(mockResponse);
});

app.get("/api/stonks/:ticker", async (req, res) => {
  let date = new Date();
  date.setDate(date.getDate() - 30);
  const search = await yahooFinance.search(req.params.ticker);
  const quotes = await yahooFinance.quote(req.params.ticker);

  const historical = await yahooFinance.historical(req.params.ticker, {
    period1: date,
    period2: new Date(),
    interval: '1d'
  });
  console.log(date, new Date());

  res.send({
    search,
    quotes,
    historical
  });
});

app.listen(port, function () {
  console.log("App listening on port: " + port);
});
