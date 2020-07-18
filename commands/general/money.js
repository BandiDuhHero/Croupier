

module.exports = {
atm: {
    aliases: ['gold', 'shekels', 'monies', 'balance', 'pounds', 'coins', 'purse', 'fannypack', 'bal'],
    execute: function (message, args) {
   const target = message.mentions.users.first() || message.author;
   const notacurrency = ['balance', 'atm', 'purse', 'fannypack'];
   let currencyName = message.content.slice(1).split(' ')[0];
   if(notacurrency.indexOf(currencyName) !== -1) currencyName = '💰'; 
   return message.channel.send(`${target.tag} has ${Economy.getBalance(target.id)} ${currencyName}`);
},
},
	inventory: {
        execute: async (message, args) => {
        const target = message.mentions.users.first() || message.author;
        const targetUser = await Users.findOne({
            where: {
                user_id: target.id
            }
        });
        const items = await targetUser.getItems();

        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
    }, 
},
	transfer: {
        aliases: ['transferbucks', 'transfermoney', 'give', 'givemoney', 'givebucks'],
		execute: function(message, args) {
        const currentAmount = Economy.getBalance(message.author.id);
        const transferAmount = Number(args[1]); //args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
        const transferTarget = message.mentions.users.first();
        if (!message.mentions.users) return message.channel.send('Please @ the person you would like to send the money to');
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

        Economy.giveMoney(message.author.id, -transferAmount);
        Economy.giveMoney(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${Economy.getBalance(message.author.id)}💰`);
    } 
    },
    addmoney: {
        aliases: ['transferbucks', 'transfermoney', 'give', 'givemoney', 'givebucks'],
		execute: function(message, args) {
        if(message.author.id !== '186905302245965824') return message.channel.send('only bandi can do tht check yo privileges la bruh');
        const transferAmount = Number(args[1]); //args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
        const transferTarget = message.mentions.users.first();
        if (!transferTarget) return message.channel.send('Please @ the person you would like to send the money to');
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
        if(!Economy.economy[transferTarget.id]) {
            Economy.economy[transferTarget.id] = new Economy.Member(transferTarget.id);
        }
        Economy.giveMoney(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully added money into the economy`);
    } 
    },
    takemoney: {
        aliases: ['transferbucks', 'transfermoney', 'give', 'givemoney', 'givebucks'],
		execute: function(message, args) {
        if(message.author.id !== '186905302245965824') return message.channel.send('only bandi can do tht check yo privileges la bruh');
        const transferAmount = Number(args[1]); //args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
        const transferTarget = message.mentions.users.first();
        if (!transferTarget) return message.channel.send('Please @ the person you would like to send the money to');
        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
        if(!Economy.economy[transferTarget.id]) {
            Economy.economy[transferTarget.id] = new Economy.Member(transferTarget.id);
        }
        Economy.takeMoney(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully taken money out of the economy`);
    } 
    },
	buy: { 
	execute: async (message, args)  => {
        const item = await DB.Shop.findOne({
            where: {
                name: {
                    [Op.like]: args
                }
            }
        });
        if (!item) return message.channel.send(`That item doesn't exist.`);
        if (item.cost > Economy.getBalance(message.author.id)) {
            return message.channel.send(`You currently have ${Economy.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
        }

        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });
        Economy.giveMoney(message.author.id, -item.cost);
        await user.addItem(item);

        message.channel.send(`You've bought: ${item.name}.`);
    }, 
},
    shop: { 
        execute: async (message, args) => {
        const items = await DB.Shop.findAll();
        return message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), {
            code: true
        });
    },
},
    leaderboard: {
        execute: function (message, args) {
            let econ = Economy.economy;
            let econdata = [];
            Object.keys(econ).forEach(i => {
                econdata.push(econ[i]);
            });
            let compare = function(a,b) {
                if (a.money < b.money)
                  return 1;
                if (a.money > b.money)
                  return -1;
                return 0;
              }
            econdata.sort(compare);
                let msg = '';
                let i = 0;
                while(i < 11 && econdata[i]) {
                    let place = i+1;
                    msg += '`(' + place + ') ' + client.users.get(econdata[i].userid).tag + ': ' + econdata[i].money + '💰`\n';
                    i++;
                }
                message.channel.send(msg);
            
        },
    },
	
};