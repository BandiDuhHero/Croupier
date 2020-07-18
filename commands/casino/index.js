
function validateBet (amount, message) {
	let channel = message.channel;
	if (!amount || amount === 0) {
		return channel.send(Config.reponses.noAnte);
	}
	if(amount < 0) {
		return channel.send(Confi.negAnte);
	} 
	if (isNaN(amount)) {
		return channel.send(Config.reponses.NaN);
	}
	if (!Number.isInteger(amount)) {
		return channel.send(Config.reponses.notInteger);
	}
	if (amount > Economy.getBalance(message.author.id)) {
		return channel.send(Config.reponses.notEnoughMoney);
	}
	else {
		return true;
	}
}

const blackjack = require('./blackjack');
const roulette = require('./roulette');
const dice = require('./dice');
const commands = Object.assign({}, blackjack, roulette, dice);
module.exports = {
	commands: commands,
	validateBet: validateBet,
};