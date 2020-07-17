const max_players = 10;

const embeds = {
    open: function() {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
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
                url: 'https://media.giphy.com/media/g2YdApKEna2sg/giphy.gif',
            },
        };
	},
	
	bomb: function(msg) {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Pass The Bomb!',
			description: msg,
	
            image: {
                url: 'https://media.giphy.com/media/g2YdApKEna2sg/giphy.gif',
            },
        };
	},
	winner: function(winner, reward) {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
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
                url: 'https://media.giphy.com/media/g2YdApKEna2sg/giphy.gif',
            },
        };
	},
	end: function() {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Pass The Bomb!',
            description: 'the game has been ended :',
            image: {
                url: 'https://media.giphy.com/media/g2YdApKEna2sg/giphy.gif',
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
		});
		this.channel.send('NEW ROUND!!! Players Left: ' + playersLeft.toString());
		setTimeout(() => {
		this.playerWithBomb = pIds[Math.floor(Math.random() * pIds.length)];
		this.status = 3; //active bomb
		this.channel.send('The bomb is handed to ' + this.players[this.playerWithBomb].name);
		this.timer = setTimeout(this.bomb.bind(this), Math.floor(Math.random() * 8000) + 16000);
		}, 2000);
	};
	bomb() {
		this.clearTimers();
		const attachment = new Discord.Attachment('./img/bomb.gif', 'bomb.gif');
		console.log(this.playerWithBomb);
		this.channel.send(this.players[this.playerWithBomb].name + ' dropped the bomb and is eliminated', attachment);
		delete this.players[this.playerWithBomb];
		this.status = 2;
		this.timer = setTimeout(this.newRound.bind(this), this.waitTime);
	};
	showWinner() {
		this.clearTimers();
		this.status = 0;
		for(var i in this.players) {
		this.channel.send(({
			embed: embeds.winner(this.players[i].name, this.reward),
		}));
	}
	}
	end() {
		this.clearTimers();
		this.status = 0;
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
	passthebomb: {
		authreq: 'Operator',
		channels: ['pass-the-bomb'],
		aliases: ['ptb'],
        cooldown: 5,
        execute: (message, args) => {
            const game = message.channel.game;
    
            if(game && game.status !== 0) {
                return message.channel.send('theres already a game in progress wait for it to finish lil nicc');
        }
			message.channel.game = new PTB(message.channel);
			let openPTB = message.channel.send({
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