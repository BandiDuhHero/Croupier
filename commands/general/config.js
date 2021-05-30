module.exports = {
    kpopmode: {
		authreq: 'Admin',
		cooldown: 5,
		execute(message) {
			Config.images.ambush = 'https://media.discordapp.net/attachments/731505018225688648/734877483928911962/jinsoul_ayyyy.gif';
			Config.images.diceBG = './img/kpopdice.png';
            return message.react('✅');
		},
	},
	ghettomode: {
		authreq: 'Admin',
		cooldown: 5,
		execute(message) {
			Config.responses = {
				wrongChannel: 'u not even in the right room for that what u smokin on :joy:',
				needPerm: 'You don\'t have permission to use that command', //no sjw shit but check yo privileges la bruh
				noMention: 'u gotta @ them bro......yo silly ahhh :joy:',
				//games
				noGame: 'u trippin bruh aint even no game goin on :skull:',
				gameStarted: 'the game been started u late af :joy::sob:',
				gameNotStarted: 'The game hasn\'t started yet',
				inGame: 'u already in the game la bruh how u gon join twice :joy:',
				notInGame: 'u not even in the game lol stay in the stands la bruh :joy:',
				notYourTurn: 'u gotta wait yo turn lil nicc',
				//bets
				notEnoughMoney: 'you cant afford that broke ass nigga:joy:',	
				NaN: 'thts not a number la bruh go back to 1st grade:joy:',
				notInteger: 'we not bettin cents out here la bruh tf u think this mcdonalds:sob:',
				noAnte: 'put up sum money den lil nicc',
				negAnte: 'niggas out here betting negative..... wtf u smokin on :sob::joy:',
			};
			return message.react('✅');
		},
	},
};
