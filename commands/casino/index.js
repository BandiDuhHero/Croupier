
function validateBet (amount, message) {
	let channel = message.channel;
	if (!amount || amount === 0) {
		return channel.send(Config.responses.noAnte);
	}
	if(amount < 0) {
		return channel.send(Config.negAnte);
	} 
	if (isNaN(amount)) {
		return channel.send(Config.responses.NaN);
	}
	if (!Number.isInteger(amount)) {
		return channel.send(Config.responses.notInteger);
	}
	if (amount > Economy.getBalance(message.author.id)) {
		return channel.send(Config.responses.notEnoughMoney);
	}
	else {
		return true;
	}
}

const BlackJack = require('./blackjack');
const Roulette = require('./roulette');
const general = require('./general');
const Dice = require('./dice');
const Lottery = require('./lottery');
const commands = Object.assign({}, BlackJack, Roulette, Dice, general, Lottery.commands);
module.exports = {
	Lottery: new Lottery.Lottery(),
	commands: commands,
	validateBet: validateBet,
};