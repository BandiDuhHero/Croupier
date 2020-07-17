
function validateBet (amount, message) {
	let channel = message.channel;
	if (!amount || amount === 0) {
		return channel.send('put up sum money den lil nicc');
	}

	if (isNaN(amount)) {
		return channel.send('ets not a number la bruh go back to 1st grade:joy:');
	}
	if (!Number.isInteger(amount)) {
		return channel.send('we not betting cents out here la bruh fuck does this look like');
	}
	if (amount > Economy.getBalance(message.author.id)) {
		return channel.send('you cant afford that broke ass nigga:joy:');
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