const embeds = {
    open: function(ante) {
        return {
            color: 0x25435d,
            title: 'BlackJack',
            description: 'A new Blackjack game has been started for ' + ante + '💰\ntype .jbj to join ',
            fields: [{
                name: 'How To Play',
                value: '.stay to stay and .hit to hit',
            },
         ],
            image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/BlackJack6.jpg',
            },
        };
    },
    start: function(ante) {
        return {
            color: 0x25435d,
            title: 'BlackJack',
            description: 'the game has now started',
            fields: [{
                name: 'How To Play',
                value: '.stay to stay and .hit to hit',
            }, 
        ],
            image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/BlackJack6.jpg',
            },
        };
    },
    winners: function(msg) {
        return {
            color: 0x25435d,
            title: 'BlackJack',
            description: msg,
            image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/BlackJack6.jpg',
            },
        };
    },
};

const suits = ['♠', '♥', '♦', '♣'];
const cardnums = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
class Blackjack {
    constructor(ante, channel) {
        this.ante = ante;
        this.channel = channel;
		this.status = 1;
		this.joinable = true;
		this.deck = [];
        this.newDeck();
        this.winners = [];
		this.players = {};
    }
    newDeck() {
        cardnums.forEach(i => {
            suits.forEach(x => {
                let weight = parseInt(i);
                if (i == 'J' || i == 'Q' || i == 'K') weight = 10;

                if (i == 'A') weight = 11;

                let card = {
                    num: i,
                    suit: x,
                    weight: weight
                };
                this.deck.push(card);
            });
        });
        this.shuffleDeck();
    }
    shuffleDeck() {
        for (let i = 0; i < 1000; i++) {
            let location1 = Math.floor((Math.random() * this.deck.length));
            let location2 = Math.floor((Math.random() * this.deck.length));
            let tmp = this.deck[location1];

            this.deck[location1] = this.deck[location2];
            this.deck[location2] = tmp;
        }
    }
    join(player) {
        this.players[player.id] = {
            name: player.username,
			hand: [this.deck.pop(), this.deck.pop()],
        };
        let hand = this.players[player.id].hand;
        this.players[player.id].score = hand[0].weight + hand[1].weight;
        //if (Object.keys(this.players).length === 10) this.start();
        if(player.id === 'dealer') return;
        Economy.giveMoney(player.id, -this.ante);
	}
    start() {
        clearTimeout(this.channel.bjTimeout);
        this.status = '2'
		let players = this.players;
		this.joinable = false;
		this.turncount = 0;
        this.turns = [];
        let startmsg = '';
		Object.keys(players).forEach(i => {
            this.turns.push(i);	    
        });
        this.join({id: 'dealer', username: 'dealer'});
        this.channel.send({
            embed: embeds.start(),
        });
        this.nextTurn();
	}
	nextTurn() {
		if(this.turncount === this.turns.length) return this.payout();
        this.turn = client.users.get(this.turns[this.turncount]);
        this.turncount += 1;
        const phand = this.players[this.turn.id].hand;
        const hand = phand[0].num + phand[0].suit + ', ' + phand[1].num + phand[1].suit; 
        const score = phand[0].weight + phand[1].weight;
		this.channel.send(this.turn.toString() + ' it is now your turn, heres your hand: ' + hand + '. score: ' + score);
	}
	hit(playerid) {
		let player = this.players[playerid];
		let card = this.deck.pop();
        player.hand.push(card);
        player.score += card.weight;
        let hitmsg = this.turn.toString() + ' you got a ' + card.num + card.suit + ', ';
        if(player.score === 21) {
			this.channel.send(hitmsg + ' you now have 21 you have been added to the winner list');
            this.nextTurn();
        }
		if(player.score < 21) {
		    this.channel.send(hitmsg + ' you now have ' + player.score);
		}
	    if(player.score > 21) {
            this.channel.send(hitmsg + 'you busted with ' + player.score);
            player.inActive = true;
            this.nextTurn();
		}
        
	}
	payout() {
        let dealer = this.players['dealer'];
        let players = this.players;
        let payoutmsg = 'the dealer has ' + dealer.score;
        if(this.turns.length === 0) payoutmsg = 'nobody joined the game :(';
        while(dealer.score <= 17) {
            let card = this.deck.pop();
            dealer.hand.push(card);
            dealer.score += card.weight;
            payoutmsg += '\nthe dealer hits........\n he got a ' + card.num + card.suit + ', his score is now ' + dealer.score;
        }
        if(dealer.score > 21) {
             payoutmsg += '\nthe dealer busted with ' + dealer.score;
        }
        if (dealer.score < 21) payoutmsg += '\n the dealer stands with ' + dealer.score;
        if (dealer.score === 21) payoutmsg += '\nthe dealer now has 21';
        let dscore = dealer.score;
        delete players['dealer'];
        Object.keys(players).forEach(i => {
            if(dealer.score> 21) {
                if(!players[i].inActive) {
                    this.winners.push(players[i].name);
                    Economy.giveMoney(i, this.ante*1.5);
                }
            }
            else if(players[i].score < 21 && players[i].score > dscore || players[i].score === 21) {
                this.winners.push(players[i].name);
                Economy.giveMoney(i, Math.round(this.ante*2.5));
            }
        });
        this.status = 0;
        payoutmsg += '\n winners: ' + this.winners.join(', ');
        //if(this.winners.length === 0) payoutmsg = 'there we';
        return this.channel.send({
            embed: embeds.winners(payoutmsg)
        });
	}
}
module.exports = {
    blackjack: {
        authreq: 'Operator',
        channels: ['blackjack'],
        aliases: ['bj'],
        cooldown: 5,
        execute: (message, args) => {
            let bj = message.channel.game;
            if(bj) {
                if(!message.channel.name === 'blackjack') {
                    return message.channel.send('u trippin this ain even the blackjack room :skull:');
                }
                if (bj.status === 1) {
                return message.channel.send('theres already a game use .j to join');
            }
                if (bj.status === 2) {
                return message.channel.send('theres already a game in progress wait for it to finish lil nicc');
            }
        }
			if(!args) return message.channel.send('what is the ante?');
			let ante = Number(args)
			if (isNaN(ante)) {
                return message.channel.send('ets not a number la bruh go back to 1st grade:joy:');
            }
            if (ante === 0) {
                return message.channel.send('put up sum money den lil nicc');
            }
            if (!Number.isInteger(ante)) {
                return message.channel.send('we not betting cents out here la bruh fuck does this look like');
			}
			message.channel.game = new Blackjack(ante, message.channel);
            let embed = message.channel.send({
                embed: embeds.open(ante),
            });
			message.channel.bjTimeout = setTimeout(() => {
                message.channel.game.start();
            }, 60000);
        },
    },
    hit: {
        cooldown: 1,
        execute: (message, args) => {
            const bj = message.channel.game;
            if (!bj || !bj.status === 0) {
                return message.channel.send('theres no blackjack game.....');
            }
            if (Object.keys(bj.players).indexOf(message.author.id) === -1) {
                return message.channel.send('u not even in the game la bruh :joy:');
            }
            if (bj.status === 1) {
                return message.channel.send('the game aint even start.....');
            }
            if (!bj.turn.id === message.author.id) {
                return message.channel.send('its not yo turn la bruh');
            }
            bj.hit(message.author.id);
        },
    },
    stay: {
        aliases: ['stand'],
        cooldown: 10,
        execute: (message, args) => {
            const bj = message.channel.game;
            if (!bj || !bj.status === 0) {
                return message.channel.send('theres no blackjack game.....');
            }
            if (Object.keys(bj.players).indexOf(message.author.id) === -1) {
                return message.channel.send('u not even in the game la bruh :joy:');
            }
            if (bj.status === 1) {
                return message.channel.send('the game aint even start.....');
            }
            if (!bj.turn.id === message.author.id) {
                return message.channel.send('its not yo turn la bruh');
            }
            message.channel.send(message.author.toString() + ' has stood at ' + bj.players[message.author.id].score);
            bj.nextTurn();
        },
    },
};