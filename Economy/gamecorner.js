
class Game {
  constructor(channel) {
      this.channel = channel;
      this.players = {};
      this.status = 0; //0-inactive, 1-signups, 2-started
      this.timer = null;
      this.waitTime = 5000;
  }
  join(user) {
    this.players[user.id] = {
      name: user.username,
      mention: user.toString,
    };
    this.channel.send(this.username + ' has joined ' + this.name);
  }
  leave(user) {
      delete this.players[user.id];
      this.channel.send(this.username + ' has left ' + this.name);
  }
}