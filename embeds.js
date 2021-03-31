module.exports = {
    welcome: function(user) {
        return {
            color: #8a3fbf,
            title: 'Welcome!',
            description: 'Hello ' + user + ' welcome to Solum! We hope you enjoy your stay here, we will surely enjoy having you :)',
            image: {
		        url: 'https://i.imgur.com/T1BjY0E.png',
        	},
            fields: [
                {
                name: 'Verify',
                value: 'React in rules to gain access to the server',
            },
                {
                name: 'How to Play',
                value: 'Use .help to learn how to use Croupier',
            }, ],
        };
    },

   
    
};
