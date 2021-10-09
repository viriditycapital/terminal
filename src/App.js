import React from "react";

import { Chart_d3 } from "./plot/plot.js";
import Options from "./components/Options.js";
import Ticker from "./components/Ticker.js";
import { CURRENCY_TO_SYMBOL } from "./CONST_DATA";

/**
 * This is the highest level of the web app.
 */
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      search_query: "",
      stock_data: {},
      chart_price: null,
      ticker: null,
      currency: "USD",
      is_market_hours: false,
      watcher: null,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let chart_price = new Chart_d3("chart-price", {
      top: 20,
      right: 20,
      bottom: 50,
      left: 70,
    });

    const interval = setInterval(async () => {
      const marketOpen = 9 * 60 + 30; // 9:30 AM
      const marketClosed = 16 * 60; // 4 PM
      let now = new Date();
      let currentTime = now.getHours() * 60 + now.getMinutes();
      let is_market_hours =
        currentTime >= marketOpen && currentTime <= marketClosed;

      if (this.state.is_market_hours !== is_market_hours) {
        this.setState({ is_market_hours: is_market_hours });
      }
    }, 1000);

    this.setState({ chart_price: chart_price, watcher: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.watcher);
  }

  handleSearchChange(event) {
    this.setState({ search_query: event.target.value });
  }

  async handleSearchSubmit(event) {
    event.preventDefault();
    let response = await fetch(`/api/stonks/${this.state.search_query}`);
    let json = await response.json();
    this.setState({ stock_data: json, ticker: this.state.search_query });
  }

  render() {
    let stock_data = this.state.stock_data;
    let quotes = this.state.stock_data?.quotes;
    let historical = this.state.stock_data?.historical;

    if (historical != null) {
      this.state.chart_price.plot_line(
        "price",
        historical,
        "date",
        "close",
        true
      );
    }

    return (
      <div id="main">
        <div id="header">
          <div id="search-bar">
            <form onSubmit={this.handleSearchSubmit}>
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleSearchChange}
              />
              <input type="submit" value="Go!" />
            </form>
          </div>
        </div>
        <div id="main-content">
          {quotes?.longName}
          <div id="market-price">
            <Ticker
              ticker={this.state.ticker}
              is_market_hours={this.state.is_market_hours}
              currency_symbol={CURRENCY_TO_SYMBOL[this.state.currency]}
            />
          </div>
          <div id="bid-ask">
            <div id="bid">{`Bid: $${quotes?.bid} x ${quotes?.bidSize}`}</div>
            <div id="ask">{`Ask: $${quotes?.ask} x ${quotes?.askSize}`}</div>
          </div>
          <div id="chart-wrapper">
            <div id="chart-price"></div>
            <div id="chart-intervals">
              <div className="interval">1d</div>
              <div className="interval">1wk</div>
              <div className="interval">1m</div>
            </div>
          </div>
          <div id="options">
            <h1>Options Chain</h1>
            <Options
              ticker={this.state.ticker}
              is_market_hours={this.state.is_market_hours}
              currency_symbol={CURRENCY_TO_SYMBOL[this.state.currency]}
            />
          </div>
          <div id="news">
            <h1>News</h1>
            <div id="news-articles">
              {stock_data.search?.news.map((news) => (
                <a href={news.link} target="_blank" key={news.title}>
                  {news.title}
                </a>
              ))}
            </div>
          </div>
          <div id="twitter">
            Relevant tweets, scrape from fintwit and walter bloomberg
            (Deltaone), FxHedgers, LiveSquawk
          </div>
        </div>
      </div>
    );
  }
}

export default App;
