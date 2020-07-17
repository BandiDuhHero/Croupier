
const embeds = {
    open: function() {
        return {
            color: 0x25435d,
            title: 'Solum Lottery',
            description: 'The Lottery is now open',
            fields: [{
                name: 'How To Play',
                value: '.buy ticket - buy a ticket and wait for the lottery to be drawn',
            },
         ],
            image: {
                url: 'https://www.insideedition.com/sites/default/files/styles/931x523/public/images/2018-09/091418-lottery-1280x720.jpg?h=c673cd1c&itok=W0u-skJc',
            },
        };
    },
};
class Lottery {
    constructor(channel) {
        this.channel = channel;
        this.status = 0;
        this.tickets = [];
        this.pot = 0;
    }
    draw(amount) {
        let winners = [];
        let tickets = this.tickets;
        let crazyshit = Math.floor(Math.random()*100);
        let potmulti = 1;
        if(crazyshit === 66) {
            return this.channel.send('No winners were drawn better luck next time');
        }
        if(crazyshit === 77) {
            potmulti = 10;
            this.channel.send('JACKPOT!!!! all winnings will be multiplied by 10');
        }
        if(crazyshit <= 100 && crazyshit > 90) {// in between 91 and 100
            potmulti = 1.1;
            this.channel.send('Winnings will be increased by 10%');
        }
        if(crazyshit <= 10 && crazyshit > 1) {// in between 1 and 10
            potmulti = 0.9;
            this.channel.send('Winnings will be decreased by 10%');
        }
        //add a setTimeout right here later
        for(i = 0; i < amount; i++) {
	        let drawnum = Math.floor(Math.random()*(tickets.length-1));
            let drawnticket = tickets[drawnum];
            if(jackpot)
            Economy.giveMoney(drawnticket.owner, Math.floor(pot/amount)*potmulti);
            // need to get usernme instead of id of owner
	        winners.push('Owner: ' + drawnticket.owner + ' Num: ' + drawnticket.num); 
	        tickets.splice(drawnum, 1);
        }  
        this.channel.send('The Lottery has been drawn! Winners: ' + winners.join(' | '));
        this.status = 0;  
    }
};
class Ticket {
    constructor(owner, num) {
        this.owner = owner;
        this.num = num;
    }
};
module.exports = {
    lottery: {
        authreq: 'Admin',
        execute (message, args) {
            if(!Casino.Lottery.status !== 0) {
                return message.channel.send('there ain even no lottery to draw from :joy: u tweakin ');
            }
        }
    },
    draw: {
        authreq: 'Admin',
        execute (message, args) {
            if(!args) {
                return message.channel.send('How many tickets we drawing? yo dumb ahh yo head ahh');
            }
            let amount = Number(args[0]);
            if (isNaN(amount)) {
                return message.channel.send('ets not a number la bruh go back to 1st grade:joy:');
            }
            if (!Number.isInteger(amount)) {
                return message.channel.send('gotta be a whole number l0l how we gon draw a piece of a ticket yo dumb ahh:joy::sob:');
            }
            if(amount === 0) {
                return message.channel.send('how we gon draw 0 tickets??? :joy:'); 
            }
            if(!Casino.Lottery.status !== 1) {
                return message.channel.send('there ain even no lottery to draw from :joy: u tweakin ');
            }
            Casino.Lottery.draw(amount);
        }
    },
    lotteryinfo: {
        aliases: ['lottoinfo', 'lottodetails'],
        execute () {

        },
    },
};