let embeds = {
    startRoulette: function() {
        const attachment = new Discord.Attachment('./img/', 'sample.png');
        return {
            color: 0x25435d,
            title: 'Roulette',
            description: 'a roulette has been started bet quickly lil nicc ',
            fields: [{
                name: 'How To Bet',
                value: '.rbet [category] [ante] (e.g. .rbet red 1000)',
            },
            {
                name: 'Categories',
                value: 'High / Low (1:1) | Even / Odd (1:1) | Black / Red (1:1) | Columns (2:1) | Dozens (2:1) | Numbers (35:1)',
            },
            {
                name: 'More Help',
                value: 'use ".help casino" for more information',
            }, ],
            image: {
                url: 'https://www.casinoveritas.com/images/table-layout.gif',
            },
        };
    },
    spinRoulette: function(msg) {
        return {
            color: 0x25435d,
            title: 'Roulette',
            description: msg,
            image: {
                url: 'https://www.casinoveritas.com/images/table-layout.gif',
            },
        };
    },
    endRoulette: function() {
        return {
            color: 0x25435d,
            title: 'Roulette',
            description: 'the roulette has been ended',
        };
    },
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
        this.status = 0;
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
        if(this.num % 2 === 0) this.eo = 'even';
        if(this.num % 2 !== 0) this.eo = 'odd';
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
        this.status = 0;
    }
    end(ender) {
            const timeElapsed = this.startTime - Date.now();
            this.channel.roulCanvas.edit({
                embed: embeds.endRoulette(ender.username)
            });
			this.status = 0;
			Object.keys(this.bets).forEach(i => {
				let bet = this.bets[i];
			Object.keys(bet).forEach(key => {
                if (key.charAt(key.length - 3) === 'a') Economy.giveMoney(i, bet[key]);
			});
		});
        }
};

module.exports = {
    roulette: {
        authreq: 'Dealer',
        aliases: ['roul'],
        description: 'opens the roulette table for betting, use .roulettetutorial for more info',
        cooldown: 5,
        execute: (message, args) => {
            const roul = message.channel.roul;
            if (roul && roul.status !== 0) {
                return message.channel.send('one game at a time g');
            }
            if(message.channel.name !== 'roulette') {
                return message.channel.send('u trippin this ain even the roulette room :skull:');
            }
            message.channel.game = new Roulette();
            let roulCanvas = message.channel.send({
                embed: embeds.startRoulette()
            });
            message.channel.roulCanvas = roulCanvas;
        },
    },
    roulettebet: {
        aliases: ['rbet', 'roulbet'],
        description: 'places a bet on the roulette, use .roulettetutorial if you are confused',
        usage: '<option> <amount>',
        cooldown: 3,
        execute: (message, args) => {
            const game = message.channel.game;
            const amount = Number(args[1]);
			let bettingon = args[0];
			let bettingnum = Number(bettingon);
            const betoptions = ['eo', 'number', 'num', 'dozen', 'column', 'col', 'color'];
            if (!game || game.status === 0) {
                return message.channel.send('mans tryna bet in the air the roulette table aint even out la bruh');
            }
            if(Casino.validateBet(amount, message) !== true) return;
			if (!game.bets[message.author.id]) game.bets[message.author.id] = {};
			let bet = game.bets[message.author.id];
            if (bettingon === 'odd' || bettingon === 'even') {
                if (bet.eo) Economy.giveMoney(message.author.id, bet.eoamt);
                bet.eo = bettingon;
                bet.eoamt = amount;
            } else if (bettingon === 'red' || bettingon === 'black') {
                if (bet.color) Economy.giveMoney(message.author.id, bet.coloramt);
                bet.color = bettingon;
                bet.coloramt = amount;
            }  else if (bettingon === 'high' || bettingon === 'low') {
                if (bet.hl) Economy.giveMoney(message.author.id, bet.coloramt);
                bet.hl = bettingon;
                bet.hlamt = amount;
            } else if (bettingon.charAt(0) === 'c') {
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
        aliases: ['rspin', 'roulspin'],
        cooldown: 10,
        execute: (message, args) => {
            const game = message.channel.game;
            if (!game || !game.status === 0) {
                return message.channel.send('how you gon spin a wheel tht doesnt exist l0l');
            }
            game.spin();
            let roulCanvas = message.channel.send({
                embed: embeds.spinRoulette(game.msg)
            });
            message.channel.roulCanvas = roulCanvas;
            game.status = 0;
        }
    },
};
/*<div class="content: " ";="" display:="" table;="" clear:="" both;"="">
  <div style="float:left; width: 50%;">
<p>twitter:&nbsp;<a href="https://twitter.com/revmak"></a><a href="https://twitter.com/revmak">@revmak</a><br><br>instagram:&nbsp;<a href="https://instagram.com/makbandele">@makbandele</a><br><br>facebook:&nbsp;<a href="https://facebook.com/makbandele">makalani bandele</a></p></div>
  <div style="float: left; width: 50%;">Book makalani as a speaker, reader, or workshop facilitator through his contact form. Inquiries on publications, writings, and poems are welcome and appreciated. In keeping with his busy schedule, allow a reasonable time for response.</div>
</div>*/