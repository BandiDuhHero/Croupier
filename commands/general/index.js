
const dev = require('./dev');
const help = require('./help');
const money = require('./money');
const games = require('./games');
const commands = Object.assign(money, help, dev, games);
module.exports = {
    cooldowns: new Discord.Collection(),
	commands: commands,
};