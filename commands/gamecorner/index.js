const ambush = require('./ambush');
const ptb = require('./passthebomb');
const commands = Object.assign({}, ambush, ptb);
module.exports = {
    commands: commands,
};