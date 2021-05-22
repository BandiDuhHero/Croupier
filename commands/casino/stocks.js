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

module.exports = { 
 stocks: {
        channels: ['stocks'],
        aliases: ['stockmarket'],
        execute: async (message, args) => {
            if(Casino.open === false) {
                return message.channel.send(Config.responses.casinoClosed);
            }
          let txt = '`';
          Object.keys(market).forEach(key => {
              txt += market[key].name + '('+ market[key].ticker +'): ' + market[key].price + ' ' + Config.currencyName; 
            });
          message.channel.send(txt + '`');
        
    }
 }.
 };
