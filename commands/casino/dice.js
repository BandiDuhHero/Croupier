
let startDice = async (channel, name) => {
    const canvas = Canvas.createCanvas(1000, 350);
	const ctx = canvas.getContext('2d');
    //if(name.length > 20) name =
	const background = await Canvas.loadImage(Config.images.diceBG);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 20;
	ctx.strokeStyle = '#24678d';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '35px arial';
    ctx.fillStyle = '#24678d'; //navyish blue
    let text = name + ' has started a dice game for......';
    let textWidth = ctx.measureText(text +  '$' + channel.game.ante).width; 
    ctx.fillText(text, (canvas.width/2) - (textWidth/2), 175);
    ctx.fillStyle = '#F70400'; //red
    ctx.fillText('$' + channel.game.ante, ((canvas.width/2) - (textWidth/2)) + ctx.measureText(text).width + 10, 175);
    
	const dice = await Canvas.loadImage('./img/dice.png');
    ctx.drawImage(dice, 25, 25, 100, 100);
    ctx.drawImage(dice, 875, 25, 100, 100);
    ctx.drawImage(dice, 25, 225, 100, 100);
    ctx.drawImage(dice, 875, 225, 100, 100);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'dice.png');

	channel.send(attachment);
}
let joinDice = async (channel, p1, p2, r1, r2, winner) => {
    const canvas = Canvas.createCanvas(1000, 350);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage(Config.images.diceBG);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 20;
	ctx.strokeStyle = '#24678d';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '33px arial';
    ctx.fillStyle = '#24678d'; //navyish blue
    let text1 = p1 + ' has rolled a ';
    let text1Width = ctx.measureText(text1 + r2).width; 
    ctx.fillText(text1, (canvas.width/2) - (text1Width/2) - 20, 125);
    let text2 = p2 + ' has rolled a ';
    let text2Width = ctx.measureText(text2 + r2).width; 
    ctx.fillText(text2, (canvas.width/2) - (text2Width/2) - 20, 200);
    //black
    ctx.fillStyle = '#000000'; //black
    ctx.fillText(r1, ((canvas.width/2) - (text1Width/2)) + ctx.measureText(text1).width - 15, 125);
    ctx.fillText(r2, ((canvas.width/2) - (text2Width/2)) + ctx.measureText(text2).width - 15, 200);
    ctx.fillStyle = '#24678d'; //navyish blue
    let text3 = winner + ' has won ';
    let text3Width = ctx.measureText(text3 +  '$' + channel.game.ante).width;
    ctx.fillText(text3, (canvas.width/2) - (text3Width/2) - 20, 275); 
    ctx.fillStyle = '#F70400'; //red
    ctx.fillText('$' + channel.game.ante, ((canvas.width/2) - (text3Width/2)) + ctx.measureText(text3).width - 15, 275);
    
	const dice = await Canvas.loadImage('./img/dice.png');
    ctx.drawImage(dice, 25, 25, 100, 100);
    ctx.drawImage(dice, 875, 25, 100, 100);
    ctx.drawImage(dice, 25, 225, 100, 100);
    ctx.drawImage(dice, 875, 225, 100, 100);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'joindice.png');

	channel.send(attachment);
}
let endDice = async (channel, name) => {
    const canvas = Canvas.createCanvas(1000, 350);
	const ctx = canvas.getContext('2d');
    //if(name.length > 20) name =
	const background = await Canvas.loadImage(Config.images.diceBG);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 20;
	ctx.strokeStyle = '#24678d';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '35px arial';
    ctx.fillStyle = '#000000'; //black
    let text = name + ' has ended the dice game';
    let textWidth = ctx.measureText(text).width; 
    ctx.fillText(text, (canvas.width/2) - (textWidth/2), 175);
    
	const dice = await Canvas.loadImage('./img/dice.png');
    ctx.drawImage(dice, 25, 25, 100, 100);
    ctx.drawImage(dice, 875, 25, 100, 100);
    ctx.drawImage(dice, 25, 225, 100, 100);
    ctx.drawImage(dice, 875, 225, 100, 100);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'dice.png');

	channel.send(attachment);
}
class Dice {
    constructor(ante, host, channel) {
        this.p1 = {
            name: host.username,
            id: host.id,
            roll: Math.floor(Math.random() * 6) + 1,
        }
        this.channel = channel;
        this.status = 1;
        this.startTime = Date.now();
        this.ante = ante;

    }
    join(joiner, channel) {
        if (this.p1.id === joiner.id) {
            this.channel.send('how u gon join your own game......smh, you know damn well u cant do that:joy:');
            return false;
        }
        Economy.giveMoney(this.p1.id, this.ante);
        
        this.p2 = {
            name: joiner.username,
            id: joiner.id,
            roll: Math.floor(Math.random() * 6) + 1,
        }
        let winner = this.p1;
        let loser = this.p2;
        let tiebreak = 1;
        if (this.p1.roll === this.p2.roll) {
            if (this.p1.roll === 6) tiebreak = -1;
            let tie = [this.p1, this.p2];
            tie[Math.floor(Math.random() * 2)].roll += tiebreak;
        }
        if (this.p2.roll > this.p1.roll) {
            winner = this.p2;
            loser = this.p1;
        }
        Economy.giveMoney(winner.id, this.ante);
        Economy.giveMoney(loser.id, -this.ante);
        this.winner = winner;
        this.loser = loser;
        joinDice(this.channel, this.p1.name, this.p2.name, this.p1.roll, this.p2.roll, winner.name);
        this.status = 0;
        return;
    }
    end(message) {
        const timeElapsed = this.startTime - Date.now();
        if (this.p1.id !== message.author.id && timeElapsed / 1000 < 30) {
            return this.channel.send('why you tryna end la bruhs game so fast???');
        }

        Economy.giveMoney(this.p1.id, this.ante);
        endDice(message.channel, message.author.username)
        this.status = 0;
    }
};

module.exports = {
    dice: {
        channels: ['dice-1', 'dice-2', 'dice-3'],
        aliases: ['sd'],
        description: 'starts a dice game',
        usage: '[amount]',
        cooldown: 1,
        execute:  (message, args) => {
            if(Casino.open === false) {
                return message.channel.send(Config.responses.casinoClosed);
            }
            const ante = Number(args);
            const game = message.channel.game;
            if (game && game.status === 1) {
                return message.channel.send(Config.responses.gameStarted);
            }
            if(Casino.validateBet(ante, message) !== true) return; 
            message.channel.game = new Dice(ante, message.author, message.channel);
            startDice(message.channel, message.author.username);
            Economy.giveMoney(message.author.id, -ante);
        }
    },
};
