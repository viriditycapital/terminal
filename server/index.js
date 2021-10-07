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
  const search = await yahooFinance.search(req.params.ticker);
  const quotes = await yahooFinance.quote(req.params.ticker);

  res.send({
    search,
    quotes,
  });
});

app.listen(port, function () {
  console.log("App listening on port: " + port);
});
