
class hangman /*extends GameCorner.Game*/ {
	constructor(channel, players, status) {
		//super(players, status);
		this.channel = channel;
		this.name = 'hangman';
		this.word = '';
		this.correctGuesses = [];
		this.wrongGuesses = [];
	}
	generateWord() {

	}
	display() {
		let shown = '';
		let lplaces = [];
		for (u = 0; u < this.correctGuesses.length; u++) {
			lplaces.push(this.word.indexOf(this.correctGuesses[u]));
		}	//find places of correct guesses and add them to an array
		for (i = 0; i < this.word.length; i++) {
			if(lplaces.indexOf(i) > -1) {
				shown += ' ' + this.word.chartAt(lplaces[lplaces.indexOf(i)]) + ' ';
			}
			else {
				shown += ' _ '
			}
			this.channel.send(shown);
		};
	}
	guess(guess, userid) {
		if(guess.length === 1) {
			if(guess === this.word) {
				this.channel.send(':face_with_monocle: hmmm..... it appears "' + guess + '" is apart of the word');
				this.correctGuesses.push(guess);
			}
			else {
				this.channel.send('Nope, no ' + guess + '\'s');
				this.wrongGuesses.push(guess);
			}
		}
		else {
			if(guess === this.word) {
				this.channel.send(this.players[userid].mention + ' has guessed the word!');
				this.displayWinner(userid);
			}
			else {
				this.channel.send('Nope ' + guess +  ' aint the word');
				this.wrongGuesses.push(guess);
			}
		}
	}
};
module.exports = {
	guessletter: {
		cooldown: 10,
		aliases: ['gl', 'guessl'],
		execute: (message, args) => {
			const game = message.channel.game;
			if(!game || !game.name === 'Hangman') {
				return message.channel.send('this aint even a hangman room..... what u smokin on :thinking::joy:');
			}

			if(game.status === 0 || game.status === 1) {
				return message.channel.send('the hangman hasnt started yet broski');
			}
			if(!args) {
				return message.channel.send('what letter :thinking::joy:');
			}
			args = args.toLowerCase()
			if(!args.length > 1) {
				return message.channel.send('one letter bruh :joy:');
			}
			if(/^[a-z]+$/g.test(args) === false) {
				return message.channel.send('gotta be a letter bro');
			}
			game.guess(args, message.author.id);
	}
},
};