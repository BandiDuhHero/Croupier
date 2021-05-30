

module.exports = {
    coinflip: {
        channels: ['flip'],
        aliases: ['scratch'],
        execute: async (message, args) => {
            if(Casino.open === false) {
                return message.channel.send(Config.responses.casinoClosed);
            }
        const author = message.author.id;;
        let ante = Number(args[0]);
        let winnings = -ante;
        let random = Math.floor(Math.random()*10);
        if(args.length < 1) {
            ante = 1
        }
        if(Casino.validateBet(ante, message) !== true) return;
        if(random > 5) {
            winnings = ante;
            message.channel.send('You won ' + ante + ' ' + Config.currencyName);
        }
        else {
            message.channel.send('You lost ' + ante + ' ' + Config.currencyName);
        }
            return Economy.addmoney(message.author.id, winnings);
        }
    },
    scratchoff: {
        channels: ['scratchoff'],
        aliases: ['scratch'],
        execute: async (message, args) => {
             if(Casino.open === false) {
                return message.channel.send(Config.responses.casinoClosed);
            }
            let scratchoffs = Economy.checkInventory(message.author.id, 'Scratch-Offs');
            let inventory = Economy.economy[message.author.id].inventory;
            if(!scratchoffs || scratchoffs === 0) {
                return message.channel.send('You don\'t own any Scratch-Offs');
            }
            inventory['Scratch-Offs'] -= 1;
            /*if(Economy.economy[userid].inventory['Scratch-Off'] === 0) {
                delete Economy.economy[userid].inventory['Scratch-Off'];
            }*/
            let chance = Math.floor(Math.random()*100)
            let winnings = 0;
            if(chance > 40) {
              if(chance < 60) {
                winnings += 20;
              }
              if(chance > 60 && chance < 70) {
                winnings += 20;
            }
            if(chance > 70 && chance < 80) {
                winnings += 20;
            }
            if(chance > 80 && chance < 85) {
                winnings += 20;
            }
            if(chance > 85 && chance < 90) {
                winnings += 20;
            }
            if(chance > 90 && chance < 95) {
                winnings += 20;
            }
            if(chance > 95 && chance < 98) {
                winnings += 20;
            }
            if(chance > 98) {
                winnings += 1000;
            }
              message.channel.send('You have won ' + winnings + ' ' + Config.currencyName + '!!!!'  );
            }
            else {
                await message.channel.send('Awwww, you didn\'t win anything.....');
            }
            Economy.giveMoney(message.author.id, winnings);

        },
    },
    slots: {
        channels: ['slots'],
        cooldown: 5,
        execute: async (message, args) => {
            if(Casino.open === false) {
                return message.channel.send(Config.responses.casinoClosed);
            }
        const author = message.author.id;;
        let ante = Number(args[0]);
        let winnings = 0;
        if(args.length < 1) {
            ante = 1
        }
        if(Casino.validateBet(ante, message) !== true) return;
        else{
            const jackpot = ante * 100;
            const triple7s = ante * 50;
            const triple5s = ante * 21;
            const firstPrize = ante * 5;
            const secondPrize = ante * 4;
            const double = ante * 2;
            const moneyBack = ante;
    
            const slotsObj = {
                'slots':{
                    0:':flag_lv:',
                    1:':melon:',
                    2:':apple:',
                    3:':bell:',
                    4:':tangerine:',
                    5:':cherries:',
                    6:':watermelon:',
                    7:':gem:',
                },
            };
    
            const msg = await message.channel.send('**Slot [:slot_machine:] Machine**\n');
    
            const n = [];
            const l = [];
            const weight = [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7];
            let output = '';
            const slotsProps = slotsObj['slots'];
            for(let i = 0; i < 5; i++) {
                for(let e = 0; e < 9; e++) {
                    n[e] = await weight[Math.round(Math.random()*weight.length)];
                    for(const prop in slotsProps) {
                        if(n[e] == prop) l[e] = slotsProps[prop];
                    }
                    if((e + 1) % 3 == 0) {
    
                        output += l[e];
                        output += '\n';
                    }
                    else{
                        output += l[e];
                        output += '|';
                    }
    
                }
                await msg.edit(`**Slot Machine [:slot_machine:] Ante: ${ante}**\n ${output}`);
                output = '';
    
            }
            //console.log(n[0] + n[1] + n[2] + n[3] + n[4] + n[5]);
            let r1 = l[0] == l[1] && l[0] == l[2];
            let r2 = l[3] == l[4] && l[3] == l[5];
            let r3 = l[6] == l[7] && l[6] == l[8];
            let c1 = l[0] == l[3] && l[0] == l[6];
            let c2 = l[1] == l[4] && l[1] == l[7];
            let c3 = l[2] == l[5] && l[2] == l[8];
            let match = 'nonexistant';
             if(r1 || c2) match = n[1]
                if(r2 || c1) match = n[3]
             if(r3 || c3) match = n[8]
                if(match === 'nonexistant') {
                    Economy.giveMoney(message.author.id, -ante);
                    return message.channel.send(`**${message.author.username}** You lost :(`);
                }
                
                if(match == 1) {
                    message.channel.send(`**${message.author.username}**, You got your ante back`);
                }
                else if(match == 2) {
                    winnings += double;
                    message.channel.send(`**${message.author.username}**, You win ${double} ${Config.currencyName} !!`);
                }
                else if(match == 3) {
                    winnings += secondPrize;
                    message.channel.send(`**${message.author.username}**, You win ${secondPrize} ${Config.currencyName} !!`);
                }
                else if(match == 4) {
                    winnings += firstPrize;
                   message.channel.send(`**${message.author.username}**, You win ${firstPrize} ${Config.currencyName} !!`);
                }
                else if(match == 5) {
                    winnings += triple5s;
                    message.channel.send(`**${message.author.username}**, You win ${triple5s} ${Config.currencyName} !!`);
                }
                else if(match == 7) {
                    winnings += triple7s;
                    message.channel.send(`**${message.author.username}**, You win ${triple7s} ${Config.currencyName} !!`);
                }
                else if(match == 0) {
                    winnings += jackpot;
                    message.channel.send(`**${message.author.username}**, You win ${jackpot} ${Config.currencyName} !!`);
                }
            Economy.giveMoney(message.author.id, winnings);
        }
    },
},
    
};