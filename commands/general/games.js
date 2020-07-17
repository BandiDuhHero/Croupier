

module.exports = {
    join: {
		aliases: ['j'],
		cooldown: 5,
		execute: (message) => {
			const game = message.channel.game;
			if (!game|| game.status === 0) {
				return message.channel.send('do u see a game to join dumb bitch??? what i thot');
			}
			if (!game.join) {
				return message.channel.send('it aint as simple as .j la bruh u gotta learn how to play the game u feel me check out .help ' + game.name);
			}
			else if (game.status !== 1) {
				return message.channel.send('the game already started wait for another one');
			}
			else if (game.players && Object.keys(game.players).indexOf(message.author.id) !== -1) {
				return message.channel.send('ur already in the game la bruh :joy:');
			}
			if(game.ante) {
				if (game.ante > Economy.getBalance(message.author.id)) {
					return message.channel.send('you cant afford that broke ass nigga:joy:');
				}
		}
			game.join(message.author);
			message.react('🤑');
		},
	},
		leave: {
			aliases: ['l'],
			cooldown: 30,
			execute: (message) => {
				const game = message.channel.game;
				if (!game|| game.status === 0) {
					return message.channel.send('do u see a game to leave dumb bitch??? what i thot');
				}
				else if (!Object.keys(game.players).indexOf(message.author.id) !== -1) {
					return message.channel.send('u not even in the game la bruh :joy:');
				}
				else if(game.notLeavable) {
					return message.channel.send('you can\'t leave this game, use ".end" if you want to end the game');
				}
				game.leave(message.author);
				message.channel.send(message.author.tag + ' has left ' + game.name);
			},
	},
	/*players: {
		cooldown: 20,
		execute: (message) => {
			if (!game|| game.status === 0) {
				return message.channel.send('there ain even a active game idk wat u smokin on cuz :joy:');
			}
			message.channel.send(message.author.tag + ' has left ' + game.name);
		}
	},*/
	start: {
		authreq: 'Operator',
		cooldown: 10,
		execute: (message) => {
			const game = message.channel.game;
	
			if (!game || game.status === 0 || !game.start) {
				return message.channel.send('do u see a game to start dumb bitch??? what i thought');
			}
			else if (game.status !== 1) {
				return message.channel.send('the game already started.....');
			}
			game.start(message.author.id);
		},
	},
	autostart: {
		authreq: 'Operator',
		cooldown: 10,
		execute: (message) => {
			const game = message.channel.game;
	
			if (!game || game.status === 0 || !game.start) {
				return message.channel.send('do u see a game to autostart dumb bitch??? what i thought');
			}
			else if (game.autostartable === false) {
				return message.channel.send('you can\'t autostart this game');
			}
			if(game.autostart === false) {
				game.autostart = true;
				return message.channel.send('autostart in this channel is now set to: on');	
			} 
			else {
			game.autostart = false;
			return message.channel.send('autostart in this channel is now set to: off');
			}

		},
	},
	end: {
		cooldown: 10,
		authreq: 'Operator',
		execute: (message) => {
			const game = message.channel.game;
			const timeElapsed = game.startTime - Date.now();
			if (!game || game.status === 0 || !game.end) {
				return message.channel.send('do u see a game to end dumb bitch??? what i thot');
			}
			game.end(message.author);
		},
	},
};
