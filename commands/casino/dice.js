
let startDice = async (channel, name) => {
    const canvas = Canvas.createCanvas(1000, 350);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./img/whitebg.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 20;
	ctx.strokeStyle = '#24678d';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '36px arial';
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

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(attachment);
}
class Dice {
    constructor(ante, host, channel) {
        this.p1 = {
            name: host.username,
            id: host.id,
            roll: Math.floor(Math.random() * 6) + 1,
        }
        this.channel = channel
        this.status = 1;
        this.startTime = Date.now();
        this.ante = ante;

    }
    join(joiner, channel) {
        if (this.p1.id === joiner.id) {
            return this.channel.send('how u gon join your own game......smh, you know damn well u cant do that:joy:');
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
        this.channel.send({embed: Embeds.joinDice(this.p1, this.p2, this.winner, this.loser, this.ante)});
        this.started = false;
        return;
    }
    end(ender) {
        const timeElapsed = this.startTime - Date.now();
        if (this.p1.id !== this.author.id && timeElapsed / 1000 < 30) {
            return this.channel.send('why you tryna end la bruhs game so fast???');
        }
        this.channel.send({embed: Embeds.endDice(ender.username)});
        Economy.giveMoney(this.p1.id, this.ante);
        this.started = false;
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
            const ante = Number(args);
            const game = message.channel.game;
            if (game && game.status === 1) {
                return message.channel.send(Config.reponses.gameStarted);
            }
            if(Casino.validateBet(ante, message) !== true) return; 
            message.channel.game = new Dice(ante, message.author, message.channel);
            startDice(message.channel, message.author.username);
            Economy.giveMoney(message.author.id, -ante);
        }
    },
};