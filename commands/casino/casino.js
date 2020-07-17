class Dice {
    constructor(amount, host) {
        this.p1 = {
            name: host.username,
            id: host.id,
            roll: Math.floor(Math.random() * 6) + 1,
        }
        this.started = true;
        this.startTime = Date.now();
        this.amount = amount;

    }
    join(joiner, channel) {
        this.p2 = {
            name: joiner.username,
            id: joiner.id,
            roll: Math.floor(Math.random() * 6) + 1,
        }
        let winner = this.p1;
        let loser = this.p2;
        let tiebreak = 1;
        if (this.p1.roll === this.p2.roll) {
            if (this.p1.roll === 6) tiebreak = -1;
            let tie = [this.p1, this.p2];
            tie[Math.floor(Math.random() * 2)].roll += tiebreak;
        }
        if (this.p2.roll > this.p1.roll) {
            winner = this.p2;
            loser = this.p1;
        }
        Economy.giveMoney(winner.id, this.amount);
        Economy.giveMoney(loser.id, -this.amount);
        this.winner = winner;
        this.loser = loser;
        return;
    }
};
const columns = [
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
];
const dozens = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
];
const rednums = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const blacknums = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
class Roulette {
    constructor() {
        this.started = true;
        this.bets = {};
        this.num = Math.floor(Math.random() * 37);
    }
    spin() {
        let winners = [];
        let bets = this.bets;
        rednums.forEach(i => {
            if (i === this.num) this.color = 'red';
		});
		blacknums.forEach(i => {
            if (i === this.num) this.color = 'black';
		});
        dozens.forEach(i => {
            if (i.indexOf(this.num) !== -1) this.dozen = dozens.indexOf(i);
		});
        columns.forEach(i => {
            if (i.indexOf(this.num) !== -1) this.column = columns.indexOf(i);
        });
        console.log('color is ' + this.color + '\ndozen is ' + this.dozen + '\ncolumn is ' + this.column);
        if(this.num % 2 === 0) this.eo = even;
        if(this.num % 2 !== 0) this.eo = odd;
        if(this.num > 18) this.hl = 'high';
        if(this.num <= 18) this.hl = 'low';
        Object.keys(bets).forEach(i => {
            if (this.num === 0) {
                if (bets[i].num === this.num) {
                   return Economy.giveMoney(bets[i].id, bets[i].numamt * 35);
                }
            }
            if (bets[i].num === this.num) {
                Economy.giveMoney(i, bets[i].numamt * 35);
            }
            if (bets[i].column === this.column) {
                Economy.giveMoney(i, bets[i].columnamt * 3);
            }
            if (bets[i].dozen === this.dozen) {
                Economy.giveMoney(i, bets[i].dozenamt * 3);
            }
            if (bets[i].color === this.color) {
				Economy.giveMoney(i, bets[i].coloramt * 2);
            }
            if (bets[i].hl === this.hl) {
				Economy.giveMoney(i, bets[i].hlamt * 2);
            }
            if (bets[i].eo === this.eo) {
                Economy.giveMoney(i, bets[i].eoamt * 2);
            }
        });
        this.msg = 'the roulette has been spun........ it landed on........' + this.num + '!';
    }
};
const suits = ['♠', '♥', '♦', '♣'];
const cardnums = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
class Blackjack {
    constructor(ante, channel) {
        this.ante = ante;
        this.channel = channel;
		this.started = true;
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
        if(Object.keys(this.players).length === 10) this.start();
	}
    start() {
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
            embed: Embeds.startBlackjack(),
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
			this.channel(hitmsg + ' you now have 21 you have been added to the winner list');
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
        this.started = false;
        payoutmsg += '\n winners: ' + this.winners.join(', ');
        return this.channel.send({
            embed: Embeds.getBlackjackWinners(payoutmsg)
        });
	}
}
module.exports = {
    startdice: {
        aliases: ['sdice', 'sd'],
        description: 'starts a dice game',
        usage: '[amount]',
        cooldown: 1,
        execute:  (message, args) => {
            const amount = Number(args);
            const dice = message.channel.dice;
            if (dice && dice.started) {
                return message.channel.send('one game at a time g');
            }
            if (isNaN(amount)) {
                return message.channel.send('ets not a number la bruh go back to 1st grade:joy:');
            }
            if (amount === 0) {
                return message.channel.send('put up sum money den lil nicc');
            }
            if (!Number.isInteger(amount)) {
                return message.channel.send('we not betting cents out here la bruh fuck does this look like');
            }

            if (amount > Currency.getBalance(message.author.id)) {
                return message.channel.send('u cant afford tht broke ass nigga:joy:');
            }
            message.channel.dice = new Dice(amount, message.author);
            message.channel.send({
                embed: Embeds.startDice(message.author.username, amount)
            });
            Economy.giveMoney(message.author.id, -amount);
        }
    },
    joindice: {
        aliases: ['jdice', 'jd'],
        description: 'joins a dice game',
        cooldown: 1,
        execute: (message, args) => {
            const dice = message.channel.dice;
            if (!dice || !dice.started) {
                return message.channel.send('do u see a game to join dumb bitch??? what i thot');
            }
            if (dice.p1.id === message.author.id) {
                return message.channel.send('how u gon join your own game......smh');
            }
            if (dice.amount > Currency.getBalance(message.author.id)) {
                return message.channel.send('you cant afford that broke ass nigga:joy:');
            }
            Economy.giveMoney(dice.p1.id, dice.amount);
            dice.join(message.author);
            message.channel.send({embed: Embeds.joinDice(dice.p1, dice.p2, dice.winner, dice.loser, dice.amount)});
            dice.started = false;
        }
    },
    enddice: {
        aliases: ['edice'],
        description: 'ends a dice game',
        cooldown: 5,
        execute: (message, args) => {
            const dice = message.channel.dice;
            if (!dice || !dice.started) {
                return message.channel.send('do u see a game to end dumb bitch??? what i thot');
            }
            const timeElapsed = dice.startTime - Date.now();
            if (dice.p1.id !== message.author.id && timeElapsed / 1000 < 30) {
                return message.channel.send('why you tryna end la bruhs game so fast???');
            }
            message.channel.send({embed: Embeds.endDice(message.author.username)});
            Economy.giveMoney(message.author.id, dice.amount);
            dice.started = false;
    },
},
    roulettestart: {
        aliases: ['startroul', 'roulstart', 'roul', 'startroulette'],
        description: 'opens the roulette table for betting, use .roulettetutorial for more info',
        cooldown: 5,
        execute: (message, args) => {
            const roul = message.channel.roul;
            if (roul && roul.started) {
                return message.channel.send('one game at a time g');
            }
            message.channel.roul = new Roulette();
            let roulCanvas = message.channel.send({
                embed: Embeds.startRoulette()
            });
            message.channel.roulCanvas = roulCanvas;
        },
    },
    roulettebet: {
        aliases: ['roulbet', 'roulbet', 'roulb', 'broul'],
        description: 'places a bet on the roulette, use .roulettetutorial if you are confused',
        usage: '<option> <amount>',
        cooldown: 3,
        execute: (message, args) => {
            const roul = message.channel.roul;
            const amount = Number(args[1]);
			let bettingon = args[0];
			let bettingnum = Number(bettingon);
            const betoptions = ['eo', 'number', 'num', 'dozen', 'column', 'col', 'color'];
            if (!roul || !roul.started) {
                return message.channel.send('mans tryna bet in the air the roulette table aint even out la bruh');
			}
            if (amount > Currency.getBalance(message.author.id)) {
                return message.channel.send('you cant afford that broke ass nigga:joy:');
            }
            if (!amount || amount === 0) {
                return message.channel.send('put up sum money den lil nicc');
            }
            if (isNaN(amount)) {
                return message.channel.send('ets not a number la bruh go back to 1st grade:joy:');
            }
            if (!Number.isInteger(amount)) {
                return message.channel.send('we not betting cents out here la bruh fuck does this look like');
            }

            if (amount > Currency.getBalance(message.author.id)) {
                return message.channel.send('u cant afford tht broke ass nigga:joy:');
            }
			if (!roul.bets[message.author.id]) roul.bets[message.author.id] = {};
			let bet = roul.bets[message.author.id];
            if (bettingon === 'odd' || bettingon === 'even') {
                if (bet.eo) Economy.giveMoney(message.author.id, bet.eoamt);
                bet.eo = bettingon;
                bet.eoamt = amount;
            } else if (bettingon === 'red' || bettingon === 'black') {
                if (bet.color) Economy.giveMoney(message.author.id, bet.coloramt);
                bet.color = bettingon;
                bet.coloramt = amount;
            }  else if (bettingon.charAt(0) === 'c') {
                let c = Number(bettingon.charAt(1));
                if (c <= 3 && c > 0) {
                    if (bet.column) Economy.giveMoney(message.author.id, bet.columnamt);
                    bet.column = columns[c - 1];
                    bet.columnamt = amount;
                } else return message.channel.send('that is not a column(1, 2 or 3)');
            } else if (bettingon.charAt(0) === 'd') {
                let d = Number(bettingon.charAt(1));
                if (d <= 3 && d > 0) {
                    if (bet.dozen) Economy.giveMoney(message.author.id, bet.dozenamt);
                    bet.dozen = dozens[d - 1];
                    bet.dozenamt = amount;
                } else return message.channel.send('that is not a dozen(1, 2 or 3)');
			} else if (!isNaN(bettingnum)) {
                if (bettingnum <= 36 && bettingnum >= 0 && Number.isInteger(bettingnum)) {
					if (bet.num) Economy.giveMoney(message.author.id, bet.numamt);
                    bet.num = bettingnum;
                    bet.numamt = amount;
                } else return message.channel.send('that is not an integer in between 0 and 36');
            } else return message.channel.send('mans betting on stuff that doesnt exist');

			let fullbetMsg = '';
            Object.keys(bet).forEach(key => {
                if (key.charAt(key.length - 3) !== 'a') {
					fullbetMsg += bet[key] + ': ' + bet[key+'amt'] + ' ';
                }
            });
            Economy.giveMoney(message.author.id, -amount);
            message.channel.send('heres your full bet: ' + fullbetMsg);
        }
    },
    roulettespin: {
        aliases: ['roulspin', 'spinroulette', 'spinroul'],
        cooldown: 10,
        execute: (message, args) => {
            const roul = message.channel.roul;
            if (!roul || !roul.started) {
                return message.channel.send('how you gon spin a wheel tht doesnt exist l0l');
            }
            roul.spin();
            let roulCanvas = message.channel.send({
                embed: Embeds.spinRoulette(roul.msg)
            });
            message.channel.roulCanvas = roulCanvas;
            roul.started = false;
        }
    },
    endroul: {
        aliases: ['eroul', 'endroul', 'roulend', 'endroulette'],
        cooldown: 10,
        execute: (message, args) => {
            const roul = message.channel.roul;
            const timeElapsed = roul.startTime - Date.now();
            if (!roul || !roul.started) {
                return message.channel.send('mans seeing things aint no roulette to end');
			}
            message.channel.roulCanvas.edit({
                embed: Embeds.endRoulette(message.author.username)
            });
			roul.started = false;
			Object.keys(roul.bets).forEach(i => {
				let bet = roul.bets[i];
			Object.keys(bet).forEach(key => {
                if (key.charAt(key.length - 3) === 'a') Economy.giveMoney(i, bet[key]);
			});
		});
        }
    },
    openblackjack: {
        cooldown: 5,
		aliases: ['openbj', 'obj', 'blackjackopen', 'oblackjack', 'blackjacko'],
        execute: (message, args) => {
            let bj = message.channel.blackjack;
            if(bj) {
            if (bj.started && bj.joinable) {
                return message.channel.send('theres already a game use .jbj to join');
            }
            if (bj.started && !bj.joinable) {
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
			message.channel.blackjack = new Blackjack(ante, message.channel);
            let embed = message.channel.send({
                embed: Embeds.openBlackjack(ante),
            });
			message.channel.bjTimeout = setTimeout(() => {
                message.channel.blackjack.start();
            }, 60000);
        },
    },
    joinblackjack: {
        aliases: ['joinbj', 'jbj', 'bjjoin', 'jblackjack', 'blackjackj'],
        cooldown: 5,
        execute: (message, args) => {
            const bj = message.channel.blackjack;
            if (!bj || !bj.started) {
                return message.channel.send('do u see a game to join dumb bitch??? what i thot');
            }
            if (!bj.joinable) {
                return message.channel.send('the game already started wait for another one or join another blackjack room');
            }
            if (Object.keys(bj.players).indexOf(message.author.id) !== -1) {
                return message.channel.send('ur already in the game la bruh :joy:');
            }
            if (bj.ante > Currency.getBalance(message.author.id)) {
                return message.channel.send('you cant afford that broke ass nigga:joy:');
            }
            Economy.giveMoney(message.author.id, -bj.ante);
            bj.join(message.author);
            message.channel.send(message.author.tag + ' has now joined the blackjack');
        },
    },
    startblackjack: {
        aliases: ['startbj', 'sbj', 'bjstart', 'sblackjack', 'blackjackj'],
        cooldown: 10,
        execute: (message, args) => {
            const bj = message.channel.blackjack;
            if (!bj || !bj.started) {
                return message.channel.send('the blackjack table aint even open la bruh');
            }
            if (!bj.joinable) {
                return message.channel.send('the game already started wait for another one or join another blackjack room');
            }
            bj.start();
            clearTimeout(message.channel.bjTimeout);
        },
    },
    hit: {
        cooldown: 1,
		aliases: ['bjhit', 'hitbj', 'hbj', 'bjh', 'blackjackhit', 'hitblackjack'],
        execute: (message, args) => {
            const bj = message.channel.blackjack;
            if (!bj || !bj.started) {
                return message.channel.send('theres no blackjack game.....');
            }
            if (Object.keys(bj.players).indexOf(message.author.id) === -1) {
                return message.channel.send('u not even in the game la bruh :joy:');
            }
            if (bj.joinable) {
                return message.channel.send('the game aint even start.....');
            }
            if (!bj.turn.id === message.author.id) {
                return message.channel.send('its not yo turn la bruh');
            }
            bj.hit(message.author.id);
        },
    },
    stay: {
        aliases: ['stand', 'bjstay', 'sbj', 'bjs', 'blackjackstay', 'stayblackjack'],
        cooldown: 5,
        execute: (message, args) => {
            const bj = message.channel.blackjack;
            if (!bj || !bj.started) {
                return message.channel.send('theres no blackjack game.....');
            }
            if (Object.keys(bj.players).indexOf(message.author.id) === -1) {
                return message.channel.send('u not even in the game la bruh :joy:');
            }
            if (bj.joinable) {
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