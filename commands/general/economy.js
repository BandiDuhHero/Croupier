module.exports = {
    opencasino: {
        description: 'Opens the Casino',
        authreq: 'Admin',
        cooldown: 0,
        execute: async (message) => {
            Casino.open = true;
            message.channel.send('Casino is now open');
        },
    },
    closecasino: {
        description: 'Closes the Casino',
        authreq: 'Admin',
        cooldown: 0,
        execute: async (message) => {
            Casino.open = false;
            message.channel.send('Casino is now closed');
        },
    },
    opengamecorner: {
        description: 'Opens the Game Corner',
        authreq: 'Admin',
        aliases: ['opengc'],
        cooldown: 0,
        execute: async (message) => {
            GameCorner.open = true;
            message.channel.send('Game Corner is now open');
        },
    },
    closegamecorner: {
        description: 'Closes the Game Corner',
        authreq: 'Admin',
        aliases: ['closegc'],
        cooldown: 0,
        execute: async (message) => {
            GameCorner.open = true;
            message.channel.send('Game Corner is now closed');
        },
    },
    addmoney: {
        authreq: 'Admin',
        aliases: ['amoney'],
        cooldown: 0,
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
    removemoney: {
        authreq: 'Admin',
        aliases: ['rmoney'],
        cooldown: 0,
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
    atm: {
        aliases: [Config.currencyName, 'purse', 'wallet', 'balance', 'bal', 'bank'],
        execute: async (message) => {
            const target = message.mentions.users.first() || message.author;
            return message.channel.send(`${target.tag} has ${Economy.getBalance(target.id)} ${Config.currencyName}`);
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
        aliases: ['transfer' + Config.currencyName, 'give', 'give' + Config.currencyName],
        execute: async (message, args) => {
            const currentAmount = Economy.getBalance(message.author.id);
            const transferAmount = Number(args[1]); //args.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
            const transferTarget = message.mentions.users.first();
            if (!message.mentions.users) return message.channel.send('Please @ the person you would like to send the ' + Config.currencyName + ' to');
            if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
            if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
            if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

            await Economy.giveMoney(message.author.id, -transferAmount);
            await Economy.giveMoney(transferTarget.id, transferAmount);

            return message.channel.send(`Successfully transferred ${transferAmount}${Config.currencyName} to ${transferTarget.tag}. Your current balance is ${Economy.getBalance(message.author.id)}${Config.currencyName}`);
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
                inventory[item.name] = 0;
            }
            inventory[item.name] += 1;
            await client.channels.cache.get(Config.shopservice).send(message.author.tag + ' just bought ' + item.name);
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
   /* apply: {
        execute: async (message, args) => {
            let job = Economy.economy[message.author.id].job;
            let chance = Math.floor(Math.random() * 100);
            if (job) {
                return await message.channel.send('You already have a job.');
            }
            if (chance < 10) {
                return await message.channel.send('');
            }
            if (chance > 75) {
                return await message.channel.send('');
            }

        },
    },
    work: {
        execute: async (message, args) => {
            let job = Economy.economy[message.author.id].job;
            let chance = Math.floor(Math.random() * 100);
            if (!job) {
                return await message.channel.send('You don\'t have a job, use .apply to try to get one');
            }
            if (job.done) {
                return await message.channel.send('Your job is already done, come back tommorrow to work again');
            }
            if (chance < 10) {
                return await message.channel.send('There was a accident on the freeway and u missed your shift, come again tommorrow');
            }
            if (chance > 75) {
                return await message.channel.send('You got a bonus!');
            }
            else {
                
                return await setTimeout(message.channel.send(job.paymessage), );
            }

        },
    },*/
    daily: {
        execute: async (message, args) => {
            let lastDaily = Economy.economy[message.author.id].lastDaily;
            if (!lastDaily) lastDaily = Date.now();
            let timeElapsed = Date.now() - lastDaily;
            let chance = Math.floor(Math.random() * 10);
            let pay = Math.floor(Math.random()*1000);
            
            if (timeElapsed < 1000*60*60*24) {
                await Economy.giveMoney(message.author.id, pay);
                await message.channel.send('Daily Payment: ' + pay +  ' ' + Config.currencyName);
                Economy.economy[message.author.id].lastDaily = Date.now();
            }
            
            else {
               return await message.channel.send('You already received your payment today');
            }
        }
    },
    weekly: {
        execute: async (message, args) => {
            let lastWeekly = Economy.economy[message.author.id].lastWeekly;
            if(!lastWeekly) lastWeekly = Date.now();
            let timeElapsed = Date.now() - lastWeekly;
            let chance = Math.floor(Math.random() * 100);
            let pay = Math.floor(Math.random()*1000);
            
            if (!lastWeekly || timeElapsed < 1000*60*60*24*7) {
                await Economy.giveMoney(message.author.id, pay);
                await message.channel.send('Weekly Payment: ' + pay +  ' ' + Config.currencyName);
                Economy.economy[message.author.id].lastWeekly = Date.now();
            }
            
            else {
               return await message.channel.send('You already received your payment this week');
            }
        }
    },
};
