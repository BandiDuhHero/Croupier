class Item {
  constructor(name, price, description) {
      this.name = name;
      this.price = price;
      this.description = description;
      this.limitOne = false;
  }
  async buy(message) {

  }
};

let vip = new Item('VIP', 5000, 'Unlocks VIP privileges for 30 days.');

let command = new Item('Command', 5000, 'Your own unique command for the bot (MBA)');

command.limitOne = true;

let customrole = new Item('Custom Role', 1000, 'Your own unique role with any name and color you choose (MBA)');

customrole.limitOne = true;

let lotteryticket = new Item('Lottery Ticket', 10, 'A ticket with a chance to be drawn in the Solum Lottery');

lotteryticket.execute = function(message) {
  if (Casino.Lottery.status === 0) {
      message.channel.send('The Solum Lottery is not open right now');
      return false;
  }
  Casino.Lottery.tickets.push({
      num: uniqid(),
      ownerid: message.author.id,
      ownername: message.author.username,
  });
};


let scratchoff = new Item('Scratch-Off', 5, 'Card with a chance to reward you when scratched');

//scratchoff.execute = Casino.ScratchOffs.buy;

module.exports = {
  vip: vip,
  command: command,
  customrole: customrole,
  lotteryticket: lotteryticket,
  //scratchoff: scratchoff,
};