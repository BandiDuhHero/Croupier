let embeds = {
    /*general: {
            color: 0x25435d,
            title: 'General Guide',
            description: 'Basic guide for Croupier',
            fields: [
                {
                    name: 'How To Get ' + Config.currencyName,
                    value: 'You can earn money by gambling and playing minigames, and donating to the server(coming soon)'
                        
                },
                {
                    name: 'Commands',
                    value: '.atm [user](optional) - check the amount of '+ Config.currencyName +' you and other users have \n' +
                           '.transfer [user] - send ' + Config.currencyName + ' to other users \n'+
                           '.shop - view the server shop \n' +
                           '.buy [item]- buy an item from the shop \n'
                           '.inventory [user](optional) - see the items you own \n'+
                },
            ],
        },*/
economy: {
            color: 0x25435d,
            title: 'Economy Guide',
            description: 'Basic guide for understanding Solum\'s economy',
            fields: [
                {
                    name: 'How To Get ' + Config.currencyName,
                    value: 'You can earn money by gambling and playing minigames, and donating to the server(coming soon)'
                        
                },
                {
                    name: 'Commands',
                    value: '.atm [user](optional) - check the amount of '+ Config.currencyName +' you and other users have \n' +
                           '.transfer [user] - send ' + Config.currencyName + ' to other users \n'+
                           '.shop - view the server shop \n' +
                           '.buy [item]- buy an item from the shop \n' +
                           '.inventory [user](optional) - see the items you own \n'
                },
            ],
        },
roulette: {
            color: 0x25435d,
            title: 'Roulette Guide',
            description: 'Everything you need to know about roulette',
            fields: [
                {
                    name: 'How To Play',
                    value: 'Roulette is a player vs house game in which a wheel is spun and players bet on the outcome of what number '+                            'the wheel lands on and the categories they fall into. The categories and their respective payouts are '+ 
                           'payouts are listed below. As you may notice, 0 is not listed in the categories, if the roulette lands '+
                           'on 0 then all bets are losing bets except the ones on 0. '
                        
                },
                {
                    name: 'Commands',
                    value: '.roulettebet [category] [ante] (e.g. .rbet red 1000) | .myroulettebet (view all your bets on the table)\n\n'+
                           'Operators Only: .roulette - opens the roulette table for bets .roulettespin - spins the roulette wheel'
                },
                {
                    name: 'Categories',
                    value: 'Black: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35 \n'+
                           'Red: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36 \n' +
                           'Column 1: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34 \n' +
                           'Column 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35 \n' +
                           'Column 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36 \n' +
                           'Dozens: (1)1-12, (2)13-24, (3)25-36 \n' +
                           'Even & Odd: Self Explanatory \n' +
                           'High: 19-36 | Low: 1-18'

                },
                {
                    name: 'Payouts',
                    value: 'High / Low (1:1) | Even / Odd (1:1) | Black / Red (1:1) | Columns (2:1) | Dozens (2:1) | Numbers (35:1)',
                },
            ],
        },
blackjack: {
            color: 0x25435d,
            title: 'BlackJack Guide',
            description: 'Everything you need to know about BlackJack',
            fields: [
                {
                    name: 'How To Play',
                    value: 'Blackjack is a player vs house game where the goal is to get a better score than the dealer(Croupier) '+ 
                           'or a score of 21. Each player is given 2 cards to start with. There is the decision to hit or stand, ' +
                           'in most cases you should hit with any score of 16 and below. Hitting gives you another card and '+
                           'increases your score by the value of the card (values below). After everyone has either stood or bust '+
                           'the dealer will have its turn, the Dealer will always hit on anything below 17 and stay otherwise. ' +                                  'Everyone with a score above the Dealers or 21 will win if the dealer doesn’t bust If the Dealer busts '+
                           'then anyone who didn’t bust wins. '
                        
                },
                {
                    name: 'Commands',
                    value: 'Use .stand to stand and .hit to hit. | Operators Only: .blackjack (opens blackjack table)'
                },
                {
                    name: 'Payouts',
                    value: 'Payouts are different depending on the outcome of the game. If the Dealer busts the payout is 3:2 ' + 
                            'to everyone who didn’t bust unless they have 21. Otherwise the payout is 2:1 to anyone with a ' +
                            'higher score than the dealer. Regardless of the outcome of the game, if a player gets 21 they ' +
                            'receive a payout of 5:2.'
                },
            ],
        },
    dice: {
            color: 0x25435d,
            title: 'Dice Guide',
            description: 'Everything you need to know about Dice',
            fields: [
                {
                    name: 'How To Play',
                    value: 'Dice is player vs player game where the goal is roll a higher number than your opponent.'      
                },
                {
                    name: 'Commands',
                    value: 'Use .dice [ante] to start a dice game'
                },
                {
                    name: 'Payouts',
                    value: 'The winner of every dice game receives a 1:1 payout'
                },
            ],
        },
    slots: {
            color: 0x25435d,
            title: 'Slots Guide',
            description: 'Everything you need to know about Slots',
            fields: [
                {
                    name: 'How To Play',
                    value: 'Slots is player vs house game where the goal is to get a winning pattern. ' +
                           'Any 3 matching icons(besides watermelon) in any columb or row is a winning pattern. ' +
                           'However there are different payouts depending on the icon, these are listed below. ' +
                           'Chance Per Slot refers to the chance of the icon being picked on every spin of each slot.' +
                           'In other words each spot on the slot machine randomly picks an icon however some icons have ' +
                           'a higher chance, this is reflected in the Chance Per Slot'
                },
                {
                    name: 'Commands',
                    value: 'Use .slots [ante] to use a slot machine'
                },
                {
                    name: 'Payout',
                    value: ':watermelon: - worthless  | Chance Per Slot: 10% \n' +
                           ':melon: - wins ante back | Chance Per Slot: 25% \n' +
                           ':apple: - 1:1 | Chance Per Slot: 20% \n'+
                           ':bell: - 3:1 | Chance Per Slot: 15% \n' +
                           ':tangerine: - 4:1 | Chance Per Slot: 15% \n'+
                           ':cherries: - 20:1 | Chance Per Slot: 10% \n' +
                           ':gem:-  50:1 | Chance Per Slot: 5% \n'+
                           ':flag_lv: - 100:1 | Chance Per Slot: 5% \n'
                    
                },
            ],
        },
    passthebomb: {
            color: 0x25435d,
            title: 'Pass The Bomb Guide',
            description: 'Everything you need to know about PTB',
            fields: [
                {
                    name: 'How To Play',
                    value: 'Pass The Bomb is a player vs player game where the goal is to not hold the bomb when the round ends.'      
                },
                {
                    name: 'Commands',
                    value: 'Use .pass [user] to pass the bomb to someone e.g. .pass @john#2886'
                },
                {
                    name: 'Payouts',
                    value: 'The Winner receives 50 '+Config.currencyName,
                },
            ],
        },
    ambush: {
            color: 0x25435d,
            title: 'Ambush Guide',
            description: 'Everything you need to know about Ambush',
            fields: [
                {
                    name: 'How To Play',
                    value: 'Ambush is a player vs player game where the goal is to survive each round by shooting someone first.' +
                           'The bot will say "FIRE" signaling it is time to shoot someone, if you successfully shoot someone' +
                           '(Croupier will respond with a green check mark) then you are immune for the round. If you shoot ' +
                           'before the bot says fire or at someone not in the game you are eliminated from the game as well.' +
                           'People with faster Wi-Fi have a huge advantage in this game' 
                },
                {
                    name: 'Commands',
                    value: 'Use .shoot [user] to shoot someone e.g. .shoot @john#2886'
                },
                {
                    name: 'Payouts',
                    value: 'The Winner receives 50 '+Config.currencyName,
                },
            ],
        },
};
module.exports = {
    help: {
    description: 'List all of my commands or info about a specific command',
	aliases: ['commands', 'guide'],
	usage: '[command name]',
	cooldown: 10,
	execute(message, args) {    
        if(!args[0]) {
            message.channel.send('I\'ve sent you all of the guides in DMs, to see a specific one use .help [guide name]');
            Object.keys(embeds).forEach(i => {
                message.author.send({
                        embed: embeds[i]
                    });
            });
            return;
        }
        if(Object.keys(embeds).indexOf(args[0]) === -1) {
            return message.channel.send('There is no guide for that. Guide list: ' + Object.keys(embeds).join(', '));
        }
        if(Commands.hasAuth(message, 'Operator')) {
        return message.channel.send({
                        embed: embeds[args[0]]
                    });
    }
        message.channel.send('Check DMs');
        message.author.send({
                        embed: embeds[args[0]]
                    });
    }
    },
};
