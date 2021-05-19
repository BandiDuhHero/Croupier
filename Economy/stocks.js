class Stock {
  constructor(name, ticker, price) {
    this.name = name;;
    this.ticker = ticker;
    this.price = price;
  }
};

let market = {};

const tickers = {
AT: 'Adryen\'s Traphouse',
SC: 'Six\'s Commissions',
BS: 'Bandi\'s Studio',
AH: 'Ara\'s Halal',
NW: 'Nacho\'s Whorehouse',
TM: 'Thylan\'s Manufacturing',
KS: 'KingBillu\'s Suites',
SD: 'Sleaze\'s Dealership'
};

exports.Stock = Stock

exports.market = market

exports.tickers = tickers;
