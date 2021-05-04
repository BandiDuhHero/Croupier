module.exports = {
    join: {
        aliases: ['j'],
        cooldown: 0,
        execute: (message, args) => {
            const game = message.channel.game;
            if (!game || game.status === 0) {
                return message.channel.send(Config.responses.noGame);
            }
            if (!game.join) {
                return message.channel.send('it aint as simple as .j la bruh u gotta learn how to play the game u feel me check out .help ' + game.name);
            } else if (game.status !== 1) {
                return message.channel.send(Config.responses.gameStarted);
            } else if (game.players && Object.keys(game.players).indexOf(message.author.id) !== -1) {
                return message.channel.send(Config.responses.inGame);
            }
            if (game.ante) {
                if (game.ante > Economy.getBalance(message.author.id)) {
                    return message.channel.send(Config.responses.notEnoughMoney);
                }
            }
            if (game.joinante) {
                if (!args) {
                    return message.channel.send(Config.responses.noAnte);
                }
                let ante = Number(args[0]);
                if (Casino.validateBet(ante, message) !== true) { 
                        return;
                }
                else {
                    if (game.join(message.author, ante) !== false) {
                        return message.react(Config.emotes.check);
                    }
                }
            }
            if (game.join(message.author) !== false) {
                return message.react(Config.emotes.check);
            }
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
				else if(!game.disqualify) {
					return message.channel.send('you can\'t leave this game, use ".end" if you want to end the game');
				}
				game.disqualify(message.author.id);
				message.channel.send(message.author.tag + ' has left ' + game.name);
			},
    },
    disqualify: {
        aliases: ['dq'],
			cooldown: 10,
			execute: (message) => {
                const game = message.channel.game;
                const target = message.mentions.users.first();
                if (!target) return message.channel.send('Please @ the person you want to disqualify');
                if (!game || game.status === 0 || !game.start) {
                    return message.channel.send(Config.responses.noGame);
                }
                if (game.status === 1 ) {
                    return message.channel.send(Config.responses.gameNotStarted);
                }
                if(!game.disqualify) {
                    return message.channel.send('There is no disqualification in this game');
                }
                if(!game.players[target.id]) {
                    return message.channel.send('That user is not in the game');
                }
                game.disqualify(target.id);
                return message.channel.send(target.tag + '  has been disqualified');
            },
    },
    players: {
        cooldown: 20,
        execute: (message) => {
            const game = message.channel.game;
            if (!game || game.status === 0) {
                return message.channel.send(Config.responses.noGame);
            }
            if (game.players) message.channel.send('`Players: ' + Object.keys(game.players) + '`');
            else message.channel.send('This game doesn\'t have a players command');

        }
    },
    start: {
        authreq: 'Operator',
        cooldown: 10,
        execute: async (message) => {
            const game = message.channel.game;

            if (!game || game.status === 0 || !game.start) {
                return message.channel.send(Config.responses.noGame);
            } else if (game.status !== 1) {
                return message.channel.send('the game already started.....');
            }
            await game.start(message.author.id);
        },
    },
    autostart: {
        authreq: 'Operator',
        cooldown: 10,
        execute: (message) => {
            const game = message.channel.game;

            if (!game || !game.start) {
                return message.channel.send('do u see a game to autostart dumb bitch??? what i thought');
            }
            if (game.autostart === false) {
                game.autostart = true;
                return message.channel.send('autostart in this channel is now set to: on');
            } else {
                game.autostart = false;
                return message.channel.send('autostart in this channel is now set to: off');
            }

        },
    },
    end: {
        cooldown: 10,
        authreq: 'Operator',
        execute: async (message) => {
            const game = message.channel.game;
            if (!game || game.status === 0) {
                return message.channel.send(Config.responses.noGame);
            }
            if (game.startTime) {
                const timeElapsed = game.startTime - Date.now();
            }
            if (!game || game.status === 0 || !game.end) {
                return message.channel.send(Config.responses.noGame);
            }
            await game.end(message);
        },
    },
};