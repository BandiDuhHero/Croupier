let economy = {};
/* 
restart economy
const list = client.guilds.get("651547995141177355"); list.members.forEach(member => Economy.economy[member.user.id] = new Economy.Member(member.user.id))
*/
class Member {
  constructor(userid) {
    this.userid = userid;
    this.money = 0;
    this.inventory = {};
  }
};

function takeMoney(userid, amount) {
  Economy.economy[userid].money -= amount;
}
function giveMoney(userid, amount) {
  Economy.economy[userid].money += amount;
}
function getBalance(userid) {
  return Economy.economy[userid].money;
}
function getInventory(userid) {
  return Economy.economy[userid].inventory;
}
function checkInventory(userid, item) {
  if (!Economy.economy[userid].inventory[item]) return false;
  return true;
}

//let MongoClient = require('mongodb').MongoClient;
//let url = 'mongodb://localhost:27017/croupier';
let url = 'mongodb+srv://bandi:getrekt@cluster0.mqcd1.mongodb.net/croupier?retryWrites=true&w=majority';

async function load() {
  const MongoClient = require('mongodb').MongoClient(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },);  
  await MongoClient.connect(async function(err, db) {
  if (err) throw err;
  let dbo = db.db('croupier');
 await dbo.collection('economy').find({}).toArray(function(err, result) {
    if (err) throw err;
    //console.log(result);
      result.forEach(i => {
      economy[i.userid] = i;
    });
    //db.close();
  });
});
await MongoClient.close();
return;
};
async function save() {
  const MongoClient = require('mongodb').MongoClient(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },);
  
  await MongoClient.connect(async function(err, db) { 
  if (err) throw err;
  let dbo = db.db('croupier');
  let econdata = [];
    Object.keys(economy).forEach(i => {
      econdata.push(economy[i]);
    });
  await dbo.collection('economy').deleteMany({});
  dbo.collection('economy').insertMany(econdata, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    //db.close();
  });
});
MongoClient.close();
}
exports.economy = economy;

exports.Shop = require('./shop');

exports.Member = Member;

exports.getBalance = getBalance;

exports.getInventory = getInventory;

exports.checkInventory = checkInventory;

exports.takeMoney = takeMoney;

exports.giveMoney = giveMoney;

exports.save = save;

exports.load = load;