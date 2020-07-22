global.fs = require('fs');
global.uniqid = require('uniqid');
global.Discord = require('discord.js');
global.Economy = require('./Economy/economy')
global.Config = require('./config');
global.Commands = require('./commands/index');
global.GameCorner = require('./commands/gamecorner/index');
global.Casino = require('./commands/casino/index');
global.Canvas = require('canvas');
global.Embeds = require('./embeds');

global.client = new Discord.Client();
const PREFIX = Config.prefix; 

client.login('NjUxNTQ4NjI0ODE5NDUzOTcy.Xeb24Q.ZrrlfT-cp6QpN_-3HhnUyvkLNmM');

client.once('ready', async () => {	
	/*for (var i in client.channels) {
		if(client.channels[i].parentID === '651547995703083073') {
			client.channels[i].game = {};
		}
	}*/
	await Economy.load();
    console.info('la bruhs ready');
});


client.on('message', async message => {
	if (message.author.bot) return;
	//if(message.content === '!join')	client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
	/*if(!Economy.economy[message.author.id]) {
		Economy.economy[message.author.id] = new Economy.Member(message.author.id);
	}*/
	//Economy.economy[message.author.id].money += 1;
	let commands = Commands.commands;
    Commands.parse(message);
    /*try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }*/ 
});
client.on("guildMemberAdd", (member) => {
	if(!Economy.economy[member.id]) {
		Economy.economy[member.id] = new Economy.Member(member.id);
	}
  });

client.on("messageDelete", (messageDelete) => {
	if(messageDelete.author.bot) return;
	client.channels.get(Config.modlog).send(`The message : "${messageDelete.content}" by ${messageDelete.author.tag} was deleted.`);
	});
client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.author.bot) return;
	client.channels.get(Config.modlog).send(`The message : "${oldMessage.content}" by ${oldMessage.author.tag} was changed to "${newMessage.content}"`);
	});
client.on('error', console.log);

client.once('disconnect', async () => {
	clearInterval(saveEconomy);
	await Economy.save();
	console.log('la bruh dc\'d money and shit got saved tho');
});

let saveEconomy = setInterval(() => {
	Economy.save();
}, 1000*60*20);

process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging here
});