
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
/*const commandFiles = fs.readdirSync('./').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	if(file != 'index.js')
	const commandfile = require(`./${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	const commands = Object.assign({}, commandfile);
}*/
const BlackJack = require('./blackjack');
const Roulette = require('./roulette');
const general = require('./general');
const Dice = require('./dice');
const Lottery = require('./lottery');
const stocks = require('./stocks');
const commands = Object.assign({}, BlackJack, Roulette, Dice, general, Lottery.commands, stocks);
module.exports = {
	Lottery: new Lottery.Lottery(),
	commands: commands,
	validateBet: validateBet,
};
