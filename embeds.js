module.exports = {
    welcome: function(user) {
        return {
            color: 0x25435d,
            description: 'Hello ' + user + ' welcome to **{server}**! We hope you enjoy your stay here, we will sure enjoy having you :)'
            thumbnail: {
                url: 'https://imgur.com/a/0IHV7J3',
            },
            fields: [{
                name: 'How to Play',
                value: 'Use .help to learn how to use Croupier',
            }, ],
        };
    },
    joinDice: function(p1, p2, winner, loser, amount) {
        return {
            color: 0x25435d,
            description: p2.name + ' joined cuz he aint no bitch\n\n\n' + p1.name + ' rolled a ' + p1.roll +
                '\n\n' + p2.name + ' rolled a ' + p2.roll + '\n\n' + winner.name + ' has won ' + amount + ' from ' + loser.name,
            thumbnail: {
                url: 'http://bestanimations.com/Games/Dice/rolling-dice-gif-3.gif',
            },
        };
    },
    endDice: function(ender) {
        return {
            color: 0x25435d,
            description: ender + ' has ended the dice he prob was too scared to join:joy:',
            thumbnail: {
                url: 'http://bestanimations.com/Games/Dice/rolling-dice-gif-3.gif',
            },
            fields: [{
                name: 'How to Play',
                value: 'Use .help to learn how to use Croupier',
            }, ],
        };
    },
   
    
};
