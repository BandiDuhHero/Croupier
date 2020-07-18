const max_players = 10;

const embeds = {
    open: function() {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Ambush!',
            description: 'dont get caught lackin lil nicc bodies drop everyday outchea',
            fields: [{
                    name: 'How To Play',
                    value: '.shoot [user] (e.g. .shoot @bandi#4356) to shoot a user', 
                },
                {
                    name: 'More Help',
                    value: 'use ".help gamecorner" for more information',
                },
            ],
            image: {
                url: 'https://media.giphy.com/media/QxYv4Y4lThPYNMnlDY/giphy.gif',
            },
        };
    },
    winner: function(winner, reward) {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Ambush!',
            description: 'dont get caught lackin lil nicc bodies drop everyday outchea',
            fields: [{
                    name: 'Winner',
                    value: winner + ' is the last one standing\n',
                },
                {
                    name: 'Payout',
                    value: 'Congratulations ' + winner + ', you won ' + reward + '$',
                },
            ],
            image: {
                url: 'https://media.giphy.com/media/QxYv4Y4lThPYNMnlDY/giphy.gif',
            },
        };
    },
    end: function() {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Ambush!',
            description: 'the game has been ended',
            image: {
                url: 'https://media.giphy.com/media/QxYv4Y4lThPYNMnlDY/giphy.gif',
            },
        };
    },

};

class Ambush {
    constructor(channel, reward) {
        this.players = [];
        this.reward = reward || 5;
        this.channel = channel;
        this.name = 'Ambush';
        this.status = 1; //0- no game 1- signups 2- waiting for "FIRE!!!" 3- time to shoot 
        this.players = {};
        this.timer = null;
        this.waitTime = 17000;
    }
    join(user) {
        this.players[user.id] = {
			id: user.id,
            name: user.username,
			mention: user.toString,
			immunity: false,
        };
    }
    start() {
        if (Object.keys(this.players).length <= 1) return;
        this.status = 2; //waiting for fire
        this.newRound();
    }
    wait() {
        this.status = 2;
        this.timer = setTimeout(this.newRound.bind(this), this.waitTime);
	};

    newRound() {
        this.clearTimers();
        let pIds = Object.keys(this.players);
        if (pIds.length < 2) return this.showWinner();
        let playersLeft = [];
        pIds.forEach(p => {
			playersLeft.push(this.players[p].name);
			this.players[p].immunity = false;
        });
		this.channel.send('NEW ROUND!!!! Players Left: ' + playersLeft.toString());
		setTimeout(() => {
			this.channel.send('wait for it..........');
		
		
		// make it hard to predict when it will say fire
		let randomDelay = [2250, 10500, 4750, 6500, 3500, 9250, 7750, 12000, 2500, 5000]; 
		let delay = randomDelay[Math.floor(Math.random()*randomDelay.length)];
        setTimeout(() => {
            this.status = 3; //time to shoot
            this.channel.send('**FIRE!!!**');
            
		}, delay);
	}, 2000);
		this.wait();
    };
    showWinner() {
        this.clearTimers();
        this.status = 0; //0- no active game
        for (var i in this.players) {
            this.channel.send(({
                embed: embeds.winner(this.players[i].name, this.reward),
            }));
        }
    }
    end() {
        this.clearTimers();
        this.status = 0; // 0- no active game
        this.channel.send(({
            embed: embeds.end()
        }));
    }
    clearTimers() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
};
module.exports = {
    ambush: {
        authreq: 'Operator',
        channels: ['ambush'],
        cooldown: 10,
        execute: (message, args) => {
            const game = message.channel.game;

            if (game && game.status !== 0) {
                return message.channel.send('theres already a game in progress wait for it to finish lil nicc');
            }
            message.channel.game = new Ambush(message.channel);
            let openAmbush = message.channel.send({
                embed: embeds.open()
            });
            message.channel.ambushTimeout = setTimeout(() => {
                message.channel.game.start();
            }, 60000);
        },
    },
    fire: {
        channels: ['ambush'],
        aliases: ['shoot'],
        cooldown: 1,
        execute(message, args) {
            const game = message.channel.game;
            if (!game || game.status === 0) return message.channel.send(Config.reponses.noGame)
            if (game.status !== 3) {
				//message.channel.send('its not time to shoot yet la bruh');
				return message.react('🚫');
			}
            if (Object.keys(game.players).indexOf(message.author.id) === -1) {
                
				//message.channel.send('u not in the game la bruh :joy:');
				return message.react('🚫');
			}
			if(game.players[message.author.id].immunity === true) {
				//message.channel.send('u already shot :joy: yo dumb ahh');
				return message.react('🚫');
			}
            const target = message.mentions.users.first();
            if (!target) return message.channel.send(Config.responses.noMention);
            if (!game.players[target.id] || game.players[target.id].immunity === true) {
				return message.react('🚫');
			}
            game.players[message.author.id].immunity = true;
			delete game.players[target.id];
			//message.channel.send(message.author.username + ' sniped ' + target.username);
			message.react('✅');

        }
    },

};