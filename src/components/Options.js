import React, { useState, useEffect } from "react";

export default function Options({ ticker, is_market_hours, currency_symbol }) {
  const [optionsData, setOptionsData] = useState();

  const fetchAndUpdateOptionsData = async (ticker) => {
    if (ticker != null && ticker.length > 0) {
      let response = await fetch(`/api/stonks/options/${ticker}`);
      let json = await response.json();
      setOptionsData(json.options);
    }
  };

  useEffect(() => {
    if (is_market_hours) {
      const interval = setInterval(async () => {
        fetchAndUpdateOptionsData(ticker);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      fetchAndUpdateOptionsData(ticker);
    }
  }, [ticker]);

  // Build options chain table
  let optionsTableData = {};

  const buildOptionsTable = () => {
    optionsData.options[0].calls.map((strike) => {
      if (!optionsTableData[strike.strike]) {
        optionsTableData[strike.strike] = {
          calls: {},
          puts: {},
        };
      }

      optionsTableData[strike.strike]["calls"] = {
        ask: strike.ask,
        bid: strike.bid,
        lastPrice: strike.lastPrice,
        volume: strike.volume,
      };
    });

    optionsData.options[0].puts.map((strike) => {
      if (!optionsTableData[strike.strike]) {
        optionsTableData[strike.strike] = {
          calls: {},
          puts: {},
        };
      }

      optionsTableData[strike.strike]["puts"] = {
        ask: strike.ask,
        bid: strike.bid,
        lastPrice: strike.lastPrice,
        volume: strike.volume,
      };
    });

    return optionsData.strikes.map((strike_price) => (
      <div className="options-row">
        <div className="put cell">
          {optionsTableData[strike_price]["puts"]["lastPrice"]}
        </div>
        <div className="strike cell">
          {strike_price}
        </div>
        <div className="call cell">
          {optionsTableData[strike_price]["calls"]["lastPrice"]}
        </div>
      </div>
    ));
  };

  return optionsData != null ? (
    <div id="options-chain">
      <div id="expiration-dates">
        {optionsData.expirationDates.map((date) => (
          <div className="opex-date" key={date}>
            {new Date(date).toISOString().substring(0, 10)}
          </div>
        ))}
      </div>
      <div id="options-prices">
        <div className="options-row">
          <div className="put cell">
            Puts
          </div>
          <div className="strike cell">
            Strike
          </div>
          <div className="call cell">
            Calls
          </div>
        </div>
        {buildOptionsTable()}</div>
    </div>
  ) : (
    <div>Query something!</div>
  );
}
