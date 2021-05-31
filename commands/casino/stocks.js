let market = Economy.StockMarket.market;

let Stock = Economy.StockMarket.Stock;


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
  ipo: {
    channels: ['stocks'],
    authreq: ['Admin'],
    usage: '[ticker], [name], [price]',
    aliases: ['addstock'],
    execute: async (message, args) => {
        if(Casino.open === false) {
            return message.channel.send(Config.responses.casinoClosed);
        }
        args = message.content.slice(Config.prefix).split(',');
        let ticker = args[0].split(' ')[1]; 
        let name = args[1]; 
        let price = Number(args[2]); 
        if(args.length > 3) return message.channel.send('Usage: .ipo [ticker], [name], [price]');
        if(market[ticker]) return message.channel.send('There is already a stock with that ticker');
        if(isNaN(price)) return message.channel.send('The stock price must be a number');
        message.react(Config.emotes.check);
        market[ticker] = new Stock(ticker, name, price);
        Economy.StockMarket.save();
}
},
  buystock: {
    channels: ['stocks'],
    usage: '[ticker] [amount of shares]',
    aliases: [''],
    execute: async (message, args) => {
        if(Casino.open === false) {
            return message.channel.send(Config.responses.casinoClosed);
        }
      let stock = args[0];
      let shareamt = args[1];
      let inventory = Economy.getInventory(message.author.id);
      if(!shareamt || isNaN(Number(shareamt))) {
        message.channel.send('Please list the amount of shares you want to purchase');
      }
      if(Object.keys(market).indexOf(stock) === -1) {   
        message.channel.send('That company does not exist use .stocks to see the entire market');
      }
      if (market[stock].price*shareamt > Economy.getBalance(message.author.id)) {
        channel.send(Config.responses.notEnoughMoney);
      }
      message.channel.send('You just purchased ' + shareamt + 'shares of ' + stock + 'stock.');
      Economy.takeMoney(message.author.id, market[stock].price*shareamt);
      if(!inventory[market[stock].name + ' Shares']) {
        return inventory[market[stock].name + ' Shares'] = shareamt;
      }
      inventory[market[stock].name + ' Shares'] += shareamt;
}
},
sellstock: {
  channels: ['stocks'],
  aliases: [''],
  execute: async (message, args) => {
      if(Casino.open === false) {
          return message.channel.send(Config.responses.casinoClosed);
      }
    let stock = args[0];
    let shareamt = args[1];
    let inventory = Economy.getInventory(message.author.id);
    if(Object.keys(market).indexOf(stock) === -1) {   
      message.channel.send('That company does not exist use .stocks to see the entire market');
    }
    if(!inventory[market[stock].name + ' Shares']) {   
      message.channel.send('You don\'t own that company, use .inventory to see your stocks');
    }
    if (shareamt > inventory[market[stock].name + ' Shares']) {
      channel.send('You only have ' + inventory[market[stock].name + ' Shares'] + '  shares of ' + market[stock].name);
    }
    message.channel.send('You just sold ' + shareamt + 'shares of ' + stock + 'stock.');
    Economy.giveMoney(message.author.id, market[stock].price*shareamt);
    inventory[market[stock].name + ' Shares'] -= shareamt;
}
},
 stocks: {
        channels: ['stocks'],
        aliases: ['stockmarket'],
        execute: async (message, args) => {
            if(Casino.open === false) {
                return message.channel.send(Config.responses.casinoClosed);
            }
          let txt = '';
          Object.keys(market).forEach(key => {
              txt += '`' + market[key].name + '('+ market[key].ticker +'): ' + market[key].price + ' ' + Config.currencyName + '`\n'; 
            });
          message.channel.send(txt);
        
    }
 },
 };
