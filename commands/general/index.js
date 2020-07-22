
const dev = require('./dev');
const help = require('./help');
const econ = require('./economy');
const games = require('./games');
const config = require('./config');
const commands = Object.assign(econ, help, dev, games, config);
module.exports = {
    cooldowns: new Discord.Collection(),
	commands: commands,
};