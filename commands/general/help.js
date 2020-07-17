module.exports = {
    help: {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const commands = Commands.commands;
		if (!args.length) {
            data.push('Here\'s a list of all my commands:');

            data.push(Object.keys(commands).join(', '));
			data.push(`\nYou can send \`${Config.prefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}
        
        const name = args[0].toLowerCase();
        let officialname = '';
        let command = commands[name];
        Object.keys(commands).forEach(key => {
            if(commands[key].aliases) {
            if(commands[key].aliases.indexOf(name) !== -1) {
            command = commands[key];
            officialname = key;
            }
            }
            else officialname = name;
        });
		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${officialname}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${Config.prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
    }
},
};
