const casino = require('./casino/index');
const general = require('./general/index');
const gamecorner = require('./gamecorner/index');
const commands = Object.assign(gamecorner.commands, casino.commands, general.commands);

function hasAuth(message, req) {
    if (Config.devs.indexOf(message.author.id) > -1) {
        return true;
    }
    let admin = message.member.roles.cache.find(r => r.name === 'Admin');
    let mod = message.member.roles.cache.find(r => r.name === 'Mod');
    let operator = message.member.roles.cache.find(r => r.name === 'Operator');
    if (req === 'Operator') {
        if (admin || mod || operator) return true;
    }
    if (req === 'Mod') {
        if (admin || mod) return true;
    }
    if (req === 'Admin') {
        if (admin) return true;
    }
    return false;
};
async function parse(message) {
    const PREFIX = Config.prefix;
    if (!message.content.startsWith(PREFIX)) return;
    const input = message.content.slice(PREFIX.length).trim();
    if (!input.length) return;
    const args = message.content.slice(PREFIX.length).split(' ');
    const commandName = args.shift().toLowerCase();
    let command = commands[commandName];
    Object.keys(commands).forEach(key => {
        if (commands[key].aliases) {
            if (commands[key].aliases.indexOf(commandName) !== -1) command = commands[key];
        }
    });


    if (!command) return;
    if (command.authreq && !hasAuth(message, command.authreq)) {
        return message.channel.send(Config.responses.needPerm);
    } 
    /*if (command.channels && command.channels.indexOf(message.channel.name) === -1) {
        return message.channel.send(Config.responses.wrongChannel + ' (try ' +  
        message.guild.channels.cache.find(channel => channel.name === command.channels[0]).toString() + ')');
    }*/
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }
    let cooldowns = Commands.cooldowns;
    Object.keys(commands).forEach(key => {
        commands[key].name = key;
    });
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    await command.execute(message, args);
};


module.exports = {
    hasAuth: hasAuth,
    cooldowns: new Discord.Collection(),
    commands: commands,
    parse: parse,
};
