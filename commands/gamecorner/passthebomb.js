const max_players = 10;

const embeds = {
    open: function() {
        const attachment = new Discord.MessageAttachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Pass The Bomb!',
            description: 'we got bombs like the taliban pussy ass nigga dont get blown tf up',
            fields: [{
                name: 'How To Play',
				value: '.pass [user] (e.g. .pass @bandi#4356) to pass the bomb \n' +
				'dont be the last one with the bomb at the end of every round',
            },
            {
                name: 'More Help',
                value: 'use ".help gamecorner" for more information',
            }, ],
            image: {
                url: Config.images.passthebomb,
            },
        };
	},
	
	bomb: function(msg) {
        const attachment = new Discord.MessageAttachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Pass The Bomb!',
			description: msg,
	
            image: {
                url: Config.images.passthebomb,
            },
        };
	},
	winner: function(winner, reward) {
        const attachment = new Discord.MessageAttachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
			title: 'Pass The Bomb!',
			description: 'we got bombs like the taliban pussy nigga dont get blew tf up',  
			fields: [
				{
                name: 'Winner',
				value: winner + ' is the last one standing\n',
			}, 
			{
                name: 'Payout',
                value: 'Congratulations ' + winner + ', you won ' + reward + '$',
			},
		],
            image: {
                url: Config.images.passthebomb,
            },
        };
	},
	end: function() {
        const attachment = new Discord.MessageAttachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Pass The Bomb!',
            description: 'the game has been ended :',
            image: {
                url: Config.images.passthebomb,
            },
        };
    },
	
};

class PTB  {
	constructor(channel, reward) {
		this.players = [];
		this.reward = reward || 5;
		this.channel = channel;
		this.name = 'Pass The Bomb';
		this.status = 1;
		this.players = {};
		this.timer = null;
		this.waitTime = 5000;
	}
	join(user) {
		this.players[user.id] = {
			id: user.id,
			name: user.username,
			mention: user.toString,
		};

	}
	start() {
		if(Object.keys(this.players).length <= 1) return;
		this.status = 2; //inactive bomb
		this.newRound();
	}
	newRound() {
		this.clearTimers();
		this.status = 2;
		let pIds = Object.keys(this.players);
		if (pIds.length < 2) return this.showWinner();
		let playersLeft = [];
		pIds.forEach(p => {		
			playersLeft.push(this.players[p].name);
		});
		this.channel.send('NEW ROUND!!! Players Left: ' + playersLeft.toString());
		this.timer1 = setTimeout(() => {
			this.round();
		}, 5000);
	};
	round() {
		let pIds = Object.keys(this.players);
		if (pIds.length < 2) return this.showWinner();
		this.playerWithBomb = pIds[Math.floor(Math.random() * pIds.length)];
		this.status = 3; //active bomb
		this.channel.send('The bomb is handed to ' + this.players[this.playerWithBomb].name);
		// make it hard to predict when it will blow
		let randomDelay = [2250, 10500, 4750, 6500, 3500, 9250, 7750, 12000, 2500, 5000]; 
		let delay = randomDelay[Math.floor(Math.random()*randomDelay.length)] + 5000;
		this.timer2 = setTimeout(() => {
		this.clearTimers();
		const attachment = new Discord.Discord.MessageAttachment('./img/bomb.gif', 'bomb.gif');
		await this.channel.send(this.players[this.playerWithBomb].name + ' dropped the bomb and is eliminated', attachment);
		delete this.players[this.playerWithBomb];
		this.timer3 = setTimeout(() => {
			this.newRound();
		}, 3000);
		}, delay);
	};
	async showWinner() {
		this.clearTimers();
		this.status = 0;
		setTimeout( async() => {
		
		for(var i in this.players) {
		await this.channel.send(({
			embed: embeds.winner(this.players[i].name, this.reward),
		}));
	}
}, 2000);
	}
	end() {
		//this.clearTimers();
		this.status = 0;
		this.channel.send(({
			embed: embeds.end()
		}));
	}
	clearTimers() {
        if (this.timer1) {
            clearTimeout(this.timer1);
            this.timer1 = null;
        }
        if (this.timer2) {
            clearTimeout(this.timer2);
            this.timer2 = null;
        }
        if (this.timer3) {
            clearTimeout(this.timer3);
            this.timer3 = null;
        }
    }
};
module.exports = {
	passthebomb: {
	authreq: 'Operator',
	channels: ['pass-the-bomb'],
	aliases: ['ptb'],
        cooldown: 5,
        execute: async (message, args) => {
            const game = message.channel.game;
    
            if(game && game.status !== 0) {
                return message.channel.send('theres already a game in progress wait for it to finish lil nicc');
        }
			message.channel.game = new PTB(message.channel);
			let openPTB = await message.channel.send({
                embed: embeds.open()
            });
			message.channel.ptbTimeout = setTimeout(() => {
            	message.channel.game.start();
            	}, 60000);
        },
	},
	passbomb: {
		channels: ['pass-the-bomb'],
		cooldown: 0,
		aliases: ['pass', 'pb'],
		execute(message, args) {
			const game = message.channel.game;
			if(!game || game.status === 0) return message.channel.send('there is no pass the bomb game goin on cuz')
				if (game.status !== 3) return message.channel.send('its not time to pass yet la bruh');
				if (game.playerWithBomb !== message.author.id) return message.channel.send('you dont even got the bomb la bruh');
				const target = message.mentions.users.first();
				if (!target) return message.channel.send('u gotta @ them bro');
				if (!game.players[target.id]) return message.channel.send('how u gonna pass the bomb to a nigga in the stands');
				game.playerWithBomb = target.id;
				message.channel.send(target.username + ' now has the bomb!');

		}
	},
	
};
