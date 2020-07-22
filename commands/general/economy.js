module.exports = {
    atm: {
        aliases: ['gold', 'shekels', 'monies', 'balance', 'pounds', 'coins', 'purse', 'fannypack', 'bal'],
        execute: async function(message) {
            const target = message.mentions.users.first() || message.author;
            const notacurrency = ['balance', 'atm', 'purse', 'fannypack'];
            let currencyName = message.content.slice(1).split(' ')[0];
            if (notacurrency.indexOf(currencyName.toLowerCase) !== -1) currencyName = '💰';
            return message.channel.send(`${target.tag} has ${Economy.getBalance(target.id)} ${currencyName}`);
        },
    },
    inventory: {
        execute: async (message, args) => {
            const target = message.mentions.users.first() || message.author;
            const inventory = Economy.getInventory(message.author.id);
            if (Object.keys(inventory).length < 1) {
                return message.channel.send(`${target.tag} has no items in their inventory`);
            }
            let msg = '`' + target.username + '\'s Inventory\n' + '-------------------------------------\n\n';
            Object.keys(inventory).forEach(i => {
                msg += i + '- ' + inventory[i] + '\n';
            });
            return message.channel.send(msg += '`');
        },
    },
    transfer: {
        aliases: ['transferbucks', 'transfermoney', 'give', 'givemoney', 'givebucks'],
        execute: async function(message, args) {
            const currentAmount = Economy.getBalance(message.author.id);
            const transferAmount = Number(args[1]); //args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
            const transferTarget = message.mentions.users.first();
            if (!message.mentions.users) return message.channel.send('Please @ the person you would like to send the money to');
            if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
            if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
            if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

            await Economy.giveMoney(message.author.id, -transferAmount);
            await Economy.giveMoney(transferTarget.id, transferAmount);

            return message.channel.send(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${Economy.getBalance(message.author.id)}💰`);
        }
    },
    addmoney: {
        authreq: 'Admin',
        aliases: ['amoney'],
        execute: async (message, args) => {
            //if(message.author.id !== '186905302245965824') return message.channel.send('only bandi can do tht check yo privileges la bruh');
            const transferAmount = Number(args[1]); //args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
            const transferTarget = message.mentions.users.first();
            if (!transferTarget) return message.channel.send('Please @ the person you would like to send the money to');
            if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
            if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
            if (!Economy.economy[transferTarget.id]) {
                Economy.economy[transferTarget.id] = new Economy.Member(transferTarget.id);
            }
            Economy.giveMoney(transferTarget.id, transferAmount);

            return message.react(Config.emotes.check);
        }
    },
    takemoney: {
        authreq: 'Admin',
        aliases: [],
        execute: async (message, args) => {
            //if(message.author.id !== '186905302245965824') return message.channel.send('only bandi can do tht check yo privileges la bruh');
            const transferAmount = Number(args[1]); //args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
            const transferTarget = message.mentions.users.first();
            if (!transferTarget) return message.channel.send('Please @ the person you would like to send the money to');
            if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
            if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
            if (!Economy.economy[transferTarget.id]) {
                Economy.economy[transferTarget.id] = new Economy.Member(transferTarget.id);
            }
            Economy.takeMoney(transferTarget.id, transferAmount);

            return await message.react(Config.emotes.check);
        }
    },
    buy: {
        execute: async (message, args) => {
            const inventory = Economy.economy[message.author.id].inventory;
            const item = Economy.Shop[args[0].toLowerCase().replace(/\s/g, '')]
            if (!item) return message.channel.send(`I can't identify that item. (only enter letters)`);
            if (Economy.getBalance(message.author.id) < item.price) {
                return await message.channel.send(Config.responses.notEnoughMoney);
            }
            if (Object.keys(inventory).indexOf(item.name) !== -1 && item.limitOne) {
                return await message.channel.send('You already own `' + item.name + '`, you can only have one');
            }
            if (item.execute && await item.execute(message) === false) return;
            Economy.takeMoney(message.author.id, item.price);
            if (Object.keys(inventory).indexOf(item.name) === -1) {
                Economy.economy[message.author.id].inventory[item.name] = 0;
            }
            inventory[item.name] += 1;
            await client.channels.get(Config.shopservice).send(message.author.tag + ' just bought ' + item.name);
            //return message.channel.send('Your purchase of `' + item.name + '` has been finalized');
            await message.react(Config.emotes.check);
        },
    },
    shop: {
        execute: async (message, args) => {
            let shop = Economy.Shop;
            let msg = '```    Solum Shop - MBA = "Must Be Approved" L1 = (Limit One)\n';
            msg += '-----------------------------------------------------------------\n\n';
            msg += 'Format: Item | Name | Description \n\n';
            Object.keys(shop).forEach(i => {
                msg += shop[i].name + ' | ';
                msg += shop[i].price + ' | ';
                msg += shop[i].description + '\n\n';
            });
            msg += '```';
            return message.channel.send(msg);
        },
    },
    leaderboard: {
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

        },
    },

};