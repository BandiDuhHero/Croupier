module.exports = {
    startDice: function(host, amount) {
        return {
            color: 0x25435d,
            description: host + ' has started a dice game for ' + amount + '💰\ntype .joindice to join unless u scared or sum',
            thumbnail: {
                url: 'http://bestanimations.com/Games/Dice/rolling-dice-gif-3.gif',
            },
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
                name: 'use .startdice (insert amount here to start a new game)',
                value: 'slatt',
            }, ],
        };
    },
   
    
};