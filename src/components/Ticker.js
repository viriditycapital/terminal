import React, { useState, useEffect } from "react";

export default function Ticker({ ticker, currency_symbol }) {
  const [price, setPrice] = useState();

  useEffect(() => {
    console.log("ticker setup", ticker);
    const interval = setInterval(async () => {
      if (ticker != null && ticker.length > 0) {
        let response = await fetch(`/api/stonks/quote/${ticker}`);
        let json = await response.json();
        setPrice(json.quotes.regularMarketPrice);
        console.log(
          "run interval",
          json.quotes,
          json.quotes.regularMarketPrice
        );
      }
      console.log("run interval do nothing", ticker);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [ticker]);

  return <div>{price != null ? `${currency_symbol}${price}` : null}</div>;
}
