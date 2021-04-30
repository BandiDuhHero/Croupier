
module.exports = {
 moneyladder: {
        aliases: ['richestusers', 'richestuser'],
        execute: function(message, args) {
            let econ = Economy.economy;
            let econdata = [];
            Object.keys(econ).forEach(i => {
                if (client.users.get(i)) {
                    econdata.push(econ[i]);
                }
            });
            let compare = function(a, b) {
                if (a.money < b.money)
                    return 1;
                if (a.money > b.money)
                    return -1;
                return 0;
            }
            econdata.sort(compare);
            let msg = '';
            let i = 0;
            while (i < 11 && econdata[i]) {
                let place = i + 1;
                msg += '`(' + place + ') ' + client.users.get(econdata[i].userid).tag + ': ' + econdata[i].money + '💰`\n';
                i++;
            }
            message.channel.send(msg);

        }
    },
};
