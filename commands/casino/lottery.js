
const embeds = {
    open: function() {
        return {
            color: 0x25435d,
            title: 'Solum Lottery',
            description: 'The Lottery is now open',
            fields: [{
                name: 'How To Play',
                value: '.buy lotteryticket - buy a ticket and wait for the lottery to be drawn',
            },
         ],
            image: {
                url: 'https://www.insideedition.com/sites/default/files/styles/931x523/public/images/2018-09/091418-lottery-1280x720.jpg?h=c673cd1c&itok=W0u-skJc',
            },
        };
    },
};
class Lottery {
    constructor() {
        this.status = 0;
        this.tickets = [];
        this.pot = 0;
    }
    draw(amount) {
        let channel = client.channels.get('666273908638482432');
        let winners = [];
        let tickets = this.tickets;
        let crazyshit = Math.floor(Math.random()*100);
        let potmulti = 1;
        if(crazyshit === 66) {
            return channel.send('No winners were drawn better luck next time');
        }
        if(crazyshit === 77) {
            potmulti = 10;
           channel.send('JACKPOT!!!! all winnings will be multiplied by 10');
        }
        if(crazyshit <= 100 && crazyshit > 90) {// in between 91 and 100
            potmulti = 1.1;
           channel.send('Winnings will be increased by 10%');
        }
        if(crazyshit <= 10 && crazyshit > 1) {// in between 1 and 10
            potmulti = 0.9;
           channel.send('Winnings will be decreased by 10%');
        }
        //add a setTimeout right here later
        for(let i=0; i < amount; i++) { // until the amount of tickets requested are drawn
	        let drawnum = Math.floor(Math.random()*(tickets.length-1));
            let drawnticket = tickets[drawnum];
            Economy.giveMoney(drawnticket.ownerid, Math.floor(this.pot/amount)*potmulti);
            // need to get usernme instead of id of owner
	        winners.push('Owner: ' + drawnticket.ownername + ' ID: ' + drawnticket.ownerid); 
	        tickets.splice(drawnum, 1);
        }  
       channel.send('The Lottery has been drawn! Winners: ' + winners.join(' | '));
        this.status = 0;  
    }
   
};
exports.Lottery = Lottery;

exports.commands = {
    openlottery: {
        authreq: 'Admin',
        channels: ['lottery'],
        aliases: ['lottery'],
        execute (message, args) {
            if(Casino.Lottery.status !== 0) {
                return message.channel.send(Config.responses.gameStarted);
            }
            message.channel.send({
                embed: embeds.open()
            });
            Casino.Lottery.status = 1;
        },
    },
    lotterydraw: {
        authreq: 'Admin',
        aliases: ['drawlottery', 'ldraw'],
        execute (message, args) {
            console.log(args)
            if(args.length < 1) {
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
            if(Casino.Lottery.status !== 1) {
                return message.channel.send('there ain even no lottery to draw from :joy: u tweakin ');
            }
            Casino.Lottery.draw(amount);
        }
    },
    lotteryinfo: {
        channels: ['lottery'],
        aliases: ['lottoinfo', 'lottodetails'],
        execute () {

        },
    },
};