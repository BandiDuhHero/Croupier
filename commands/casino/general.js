

module.exports = {
    /*scratchoff: {
        channels: ['scratchoff'],
        aliases: ['scratch'],
        execute: async (message, args) => {
            if(Economy.hasItem(message.author.id, 'Scratch-Off')) {
                return message.channel.send('You don\'t own any Scratch-Offs');
            }
            Economy.economy[userid].inventory['Scratch-Off'] -= 1;
            if(Economy.economy[userid].inventory['Scratch-Off'] === 0) {
                delete Economy.economy[userid].inventory['Scratch-Off'];
            }
            let chance = Math.floor(Math.random()*100)
            if(chance > 95) {
               await message.channel.send('You win '+);
            }
            message.channel.send();
        },
    },*/
    slots: {
        channels: ['slots'],
        execute: async (message, args) => {
        const author = message.author.id;;
        let ante = Number(args[0]);
        let winnings = 0;
        if(args.length < 1) {
            ante = 1
        }
        if(Casino.validateBet(ante, message) !== true) return;
        else{
            winnings -= ante;
            const jackpot = ante * 25;
            const triple7s = ante * 15;
            const double7s = ante * 9;
            const single7 = ante * 2;
            const secondPrize = ante * 4;
            const firstPrize = ante * 2;
    
            const slotsObj = {
                'slots':{
                    0:':flag_lv:',
                    1:':melon:',
                    2:':apple:',
                    3:':watermelon:',
                    4:':tangerine:',
                    5:':bell:',
                    6:':cherries:',
                    7:':gem:',
                },
            };
    
            const msg = await message.channel.send('**Slot [:slot_machine:] Machine**\n');
    
            const n = [];
            const l = [];
            const weight = [0, 1, 1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7];
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
            if(l[3] == l[4] && l[3] == l[5]) {
                const wmsg = await message.channel.send('You Win!!!');
    
                if(n[3] == 7) {
                    winnings += jackpot;
                    wmsg.edit(`**${message.author.username}**, You Win ${jackpot} 💰!!`);
                }
                else if(n[3] == 6) {
                    winnings += triple7s;
                    wmsg.edit(`**${message.author.username}**, You win ${triple7s} 💰!!`);
                }
                else if(n[3] == 4) {
                    winnings += firstPrize;
                    wmsg.edit(`**${message.author.username}**, You Win ${firstPrize} 💰!!`);
                }
                else if(n[3] != 0) {
                    winnings += secondPrize;
                    wmsg.edit(`**${message.author.username}**, You Win ${secondPrize} 💰!!`);
                }
            }
            else if(l[3] == l[4] && n[4] == 6 || l[4] == l[5] && n[4] == 6) {
                const wmsg = await message.channel.send('You Win!!!');
                winnings += double7s;
                wmsg.edit(`**${message.author.username}**, You Win ${double7s} 💰!!`);
            }
            else if(n[3] == 6 || n[4] == 6 || n[5] == 6) {
                winnings += single7;
                message.channel.send(`**${message.author.username}**, You Win ${single7} 💰!!`);
    
            }
            else{
                message.channel.send(`**${message.author.username}** You lost :(`);
    
            }
            Economy.giveMoney(message.author.id, winnings);
        }
    },
}
    
};