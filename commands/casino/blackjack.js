
const embeds = {
    open: function() {
        return {
            color: 0x25435d,
            title: 'BlackJack',
            description: 'The BlackJack table is now open',
            fields: [{
                name: 'How To Play',
                value: '.j [ante] to join, .stand to stand, and .hit to hit (.guide blackjack for more information)',
            },
         ],
            image: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/BlackJack6.jpg',
            },
        };
    },
    start: function() {
        return {
            color: 0x25435d,
            title: 'BlackJack',
            description: 'The game has started!',
            fields: [{
                name: 'How To Play',
                value: '.j [ante] to join, .stand to stand, and .hit to hit (.guide blackjack for more information)',
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
    constructor(channel) {
        this.autostart = false;
        this.joinable = true;
        this.joinante = true;
        this.channel = channel;
		this.status = 1;
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
    join(player, ante) {
        this.players[player.id] = {
            name: player.username,
			hand: [this.deck.pop(), this.deck.pop()],
            ante: ante,
        };
        let hand = this.players[player.id].hand;
        this.players[player.id].score = hand[0].weight + hand[1].weight;
        if(player.id === 'dealer') return;
        Economy.giveMoney(player.id, -ante);
        if (Object.keys(this.players).length === 10) this.start();
	}
    start() {
        clearTimeout(this.channel.gameTimeout);
       /* if(Object.keys(this.players).length === 0) {
            this.channel.gameTimeout = setTimeout(() => {
                message.channel.game.start();
            }, 60000);
            return;
        }*/
        if(this.status === 2) return;
        this.status = 2;
		let players = this.players;
		this.joinable = false;
		this.turncount = 0;
        this.turns = [];
        let startmsg = '';
		Object.keys(players).forEach(i => {
            this.turns.push(i);	    
        });
        this.join({id: 'dealer', name: 'dealer'});
        this.channel.send({
            embed: embeds.start(),
        });
        this.nextTurn();
	}
	nextTurn() {
        let channel = this.channel;
        if(this.turnTimer) clearTimeout(this.turnTimer);
		if(this.turncount === this.turns.length) {
            this.turn = {id: 'dealer'};
            return this.payout();
        }
        this.turn = client.users.get(this.turns[this.turncount]);
        this.turncount += 1;
        const phand = this.players[this.turn.id].hand;
        const hand = phand[0].num + phand[0].suit + ', ' + phand[1].num + phand[1].suit; 
        const score = phand[0].weight + phand[1].weight;
        this.channel.send(this.turn.toString() + ' it is now your turn, heres your hand: ' + hand + '. score: ' + score);
       /* this.turnTimer = setTimeout(function() {
        this.channel.send(this.turn.username + ' didn\'t make a move fast enough, they were automaticaly disqualified.');
        this.disqualify(this.turn.id);
        },1000*60*1);*/
    }
    disqualify(playerid) {
        delete this.players[playerid]
        if(this.turn.id === playerid) this.nextTurn();
        if(this.turns.indexOf(playerid) !== -1) this.turns.splice(this.turns.indexOf(playerid), this.turns.length-1);
    }
	hit(playerid) {
		let player = this.players[playerid];
		let card = this.deck.pop();
        player.hand.push(card);
        player.score += card.weight;
        let hitmsg = this.turn.toString() + ' you got a ' + card.num + card.suit + ', ';
        if(player.score === 21) {
			this.channel.send(hitmsg + ' you now have 21 you have been added to the winner list');
            //this.nextTurn();
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
        if(this.turnTimer) clearTimeout(this.turnTimer);
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
            if(players[i].score === 21) {
                    this.winners.push(players[i].name);
                    Economy.giveMoney(i, Math.round(players[i].ante*2.5));
                }
            else if(dealer.score> 21) {
                if(!players[i].inActive) {
                    this.winners.push(players[i].name);
                    Economy.giveMoney(i, Math.round(players[i].ante*1.5));
                }
            }
            else if(players[i].score < 21 && players[i].score > dscore)  {
                this.winners.push(players[i].name);
                Economy.giveMoney(i, Math.round(Math.round(players[i].ante*2)));
            }
        });
        this.status = 0;
        payoutmsg += '\n winners: ' + this.winners.join(', ');
        //if(this.winners.length === 0) payoutmsg = 'there we';
        
        this.channel.send({
            embed: embeds.winners(payoutmsg)
        });
        if(this.autostart === true) {
            setTimeout(() => {
                if(this.status === 0) {
                    this.status = 1;
                    this.deck = [];
                    this.newDeck();
                    this.winners = [];
                    this.players = {};
                    this.channel.send({
                        embed: embeds.open(),
                    });
        }
            }, 25000);
            
        }
	}
}
module.exports = {
    blackjack: {
        authreq: 'Operator',
        channels: ['blackjack'],
        aliases: ['bj'],
        cooldown: 5,
        execute: (message, args) => {
            if(Casino.open === false) {
                return message.channel.send(Config.responses.casinoClosed);
            }
            let bj = message.channel.game;
            if(bj) {
                if (bj.status === 1) {
                return message.channel.send(Config.responses.gameNotStarted);
            }
                if (bj.status === 2) {
                return message.channel.send('theres already a game in progress wait for it to finish lil nicc');
            }
            if(bj.autostart === true) {
                return message.channel.send(Config.responses.autoStart);
            }
        }
			message.channel.game = new Blackjack(message.channel);
            let embed = message.channel.send({
                embed: embeds.open(),
            });
			message.channel.gameTimeout = setTimeout(() => {
               if(bj.status !== 0 && bj.autostart) {
                message.channel.game.start();
               }
            }, 60000);
        },
    },
    hit: {
        channels: ['blackjack'],
        cooldown: 1,
        execute: (message, args) => {
            const bj = message.channel.game;
            if (!bj || bj.status === 0) {
                return message.channel.send(Config.responses.noGame);
            }
            if (Object.keys(bj.players).indexOf(message.author.id) === -1) {
                return message.channel.send(Config.responses.notInGame);
            }
            if (bj.status === 1) {
                return message.channel.send(Config.responses.gameNotStarted);
            }
            if (bj.turn.id !== message.author.id) {
                return message.channel.send(Config.responses.notYourTurn);
            }
            bj.hit(message.author.id);
        },
    },
    stand: {
        channels: ['blackjack'],
        aliases: ['stay'],
        cooldown: 10,
        execute: (message, args) => {
            const bj = message.channel.game;
            if (!bj || bj.status === 0) {
                return message.channel.send(Config.responses.noGame);
            }
            if (Object.keys(bj.players).indexOf(message.author.id) === -1) {
                return message.channel.send(Config.responses.notInGame);
            }
            if (bj.status === 1) {
                return message.channel.send(Config.responses.gameNotStarted);
            }
            if (bj.turn.id !== message.author.id) {
                return message.channel.send(Config.responses.notYourTurn);
            }
            message.channel.send(message.author.tag + ' has stood at ' + bj.players[message.author.id].score);
            bj.nextTurn();
        },
    },
};
