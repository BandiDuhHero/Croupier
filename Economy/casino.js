function validateBet (amount, channel) {
	
	if (!amount || amount === 0) {
		channel.send('put up sum money den lil nicc');
	}	
	if (isNaN(amount)) {
		channel.send('ets not a number la bruh go back to 1st grade:joy:');
	}
	if (!Number.isInteger(amount)) {
		channel.send('we not betting cents out here la bruh fuck does this look like');
	}
	if (amount > Economy.getBalance(message.author.id)) {
		channel.send('you cant afford that broke ass nigga:joy:');
	}
	else {
		return false;
	}
}


