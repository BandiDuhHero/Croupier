module.exports = {
    eval: {
		description: 'List all of my commands or info about a specific command.',
		authreq: 'onlydev',
		aliases: ['commands'],
		usage: '[command name]',
		cooldown: 0,
		execute(message, args) {
			const clean = text => {
				if (typeof(text) === "string")
				  return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
				else
					return text;
			  }
			try {
				const code = args.join(" ");
				let evaled = eval(code);
		   
				if (typeof evaled !== "string")
				  evaled = require("util").inspect(evaled);
				if(evaled.length > 2000) {
					console.log(clean(evaled));
					message.channel.send('result too long, logged in console');
				}
				else {
				message.channel.send(clean(evaled), {code:"xl"});
				}
			  } catch (err) {
				message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
			  }
		}
	},
};
