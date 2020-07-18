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
    constructor(channel) {
        this.channel = channel;
        this.autostart = false;
        this.status = 1;
        this.bets = {};
        this.num = Math.floor(Math.random() * 37);
    }
    spin() {
        let winners = [];
        let bets = this.bets;
        this.nummulti = 35;
        this.columnmulti = 3;
        this.dozenmulti = 3;
        this.colormulti = 2;
        this.hlmulti = 2;
        this.eomulti = 2;
        rednums.forEach(i => {
            if (i === this.num) this.color = 'red';
		});
		blacknums.forEach(i => {
            if (i === this.num) this.color = 'black';
		});
        dozens.forEach(i => {
            if (i.indexOf(this.num) !== -1) this.dozen = 'd' + (dozens.indexOf(i) + 1);
		});
        columns.forEach(i => {
            if (i.indexOf(this.num) !== -1) this.column = 'c' + (columns.indexOf(i) + 1);
        });
        //console.log('color is ' + this.color + '\ndozen is ' + this.dozen + '\ncolumn is ' + this.column);
        if(this.num % 2 === 0) this.eo = 'even';
        if(this.num % 2 !== 0) this.eo = 'odd';
        if(this.num > 18) this.hl = 'high';
        if(this.num <= 18) this.hl = 'low';

        Object.keys(bets).forEach(i => { //i=each person
            Object.keys(bets[i]).forEach(u => { //u=each persons bet
                Object.keys(this).forEach(c => { //c = each category
                    if(u === this[c]) {
                        Economy.giveMoney(i, bets[i][u]*this[c + 'multi']);
                    }
                });
            });     
        });
        this.msg = 'the roulette has been spun........ it landed on........' + this.num + '!';
        this.status = 0;
        if(this.autostart === true) {
            setTimeout(() => {
                if(this.status === 0) {
                this.status = 1;
                this.bets = {};
                this.num = Math.floor(Math.random() * 37);
                this.channel.send({
                embed: embeds.startRoulette()
            });
        }
            }, 25000);
            
        }
}
    end(ender) {
            this.channel.send({
                embed: embeds.endRoulette(ender.username)
            });
            this.status = 0;
            let bets = this.bets;
            if(Object.keys(bets).length > 0) {
            Object.keys(bets).forEach(i => { //i=each person
                Object.keys(bets[i]).forEach(u => { //u=each persons bet
                    console.log(i);
                    console.log(bets[i][u]);
                            Economy.giveMoney(i, bets[i][u]);

                });     
            });
        }
        }
};

module.exports = {
    roulette: {
        authreq: 'Dealer',
        channels: ['roulette'], 
        aliases: ['roul'],
        description: 'opens the roulette table for betting, use .roulettetutorial for more info',
        cooldown: 5,
        execute: (message, args) => {
            const roul = message.channel.roul;
            if (roul && roul.status !== 0) {
                return message.channel.send(Config.reponses.gameStarted);
            }
            message.channel.game = new Roulette(message.channel);
            let roulCanvas = message.channel.send({
                embed: embeds.startRoulette()
            });
            message.channel.roulCanvas = roulCanvas;
        },
    },
    roulettebet: {
        channels: ['roulette'], 
        aliases: ['rbet', 'roulbet'],
        description: 'places a bet on the roulette, use .roulettetutorial if you are confused',
        usage: '<option> <amount>',
        cooldown: 3,
        execute: (message, args) => {
            const game = message.channel.game;
            const ante = Number(args[1]);
			let bettingon = args[0];
			let bettingnum = Number(bettingon);
            const betoptions = ['red', 'black', 'high', 'low', 'even,', 'odd',
             'numbers 1-36', 'c1', 'c2', 'c3', 'd1', 'd2', 'd3'];
            if (!game || game.status === 0) {
                return message.channel.send(Config.reponses.noGame);
            }
            if(Casino.validateBet(ante, message) !== true) return;
			if (!game.bets[message.author.id]) game.bets[message.author.id] = {};
            let bet = game.bets[message.author.id];
            if (!isNaN(bettingnum)) {
                if (bettingnum >= 36 || bettingnum <= 0 || !Number.isInteger(bettingnum)) {
                    return message.channel.send('that is not an integer in between 0 and 36');     
                }  
            }
            if (betoptions.indexOf(bettingon) === -1 && isNaN(bettingnum)) {
                return message.channel.send('That is not a category you can bet on.');
            }  else {
                 if(bet[bettingon]) {
                    Economy.giveMoney(message.author.id, bet[bettingon]);
                 }
                bet[bettingon] = bettingnum;
                bet[bettingon] = ante;
            }
			
            Economy.takeMoney(message.author.id, ante);
            message.react('🤑');
            //message.channel.send('heres your full bet: ' + fullbetMsg);
        },
    },
    myroulettebet: {
        channels: ['roulette'],
        aliases: ['myroulbet', 'myrbet'],
        execute(message) {
        let bet = message.channel.game.bets[message.author.id];
        if(!bet) {
            message.channel.send('You haven\'t placed a bet');
        }
        let fullbetMsg = '`Your Roulette Bet\n' +
        '-------------------\n';
            Object.keys(bet).forEach(key => {
                if (key.charAt(key.length - 3) !== 'a') {
					fullbetMsg += key + ': ' + bet[key] + '💰\n';
                }
            });
        message.channel.send(fullbetMsg + '`');    
        },
    },
    roulettespin: {
        aliases: ['rspin', 'roulspin'],
        cooldown: 10,
        execute: async function (message, args) {
            const game = message.channel.game;
            if (!game || !game.status === 0) {
                return message.channel.send(Config.reponses.gameStarted);
            }
            await game.spin();
            let roulCanvas = message.channel.send({
                embed: embeds.spinRoulette(game.msg)
            });
            message.channel.roulCanvas = roulCanvas;
            game.status = 0;
        }
    },
};
