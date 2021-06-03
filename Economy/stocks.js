let market = {};
class Stock {
    constructor(ticker, name, price) {
        this.ticker = ticker;
        this.name = name;
        this.price = price;
    }
    rpc(price) { //random price change
    let pct = 0;
    let chance1 = Math.floor(Math.random() * 100);
    let chance2 = Math.floor(Math.random() * 100);
    let chance3 = Math.floor(Math.random() * 100);
    if (chance1 > 75) {
        if (chance2 > 50) {
            if (chance3 > 25) {
                pct = 12;
            } else pct = 8;
        } else pct = 4;
    }
    if (chance1 < 25) {
        if (chance2 < 25) {
            if (chance3 > 25) {
                pct = 50;
            } else pct = 25 + Math.floor(Math.random() * 10);
        } else pct = 10;
    }

    let updown = Math.floor(Math.random() * 100);
    if (chance1 <= 10) {
        updown = 51;
        pct = 100;
        if (chance1 > 5) {
            pct = 500;
        }
        if (chance1 === 1) {
            pct = 1000;
        }
    }

    if (updown > 50) {
        price += Math.floor((pct / 100) * price);
        return price;
    }
    price -= Math.floor((pct / 100) * price);
    return price;
}
};

function rpc(price) { //random price change
    let pct = 0;
    let chance1 = Math.floor(Math.random() * 100);
    let chance2 = Math.floor(Math.random() * 100);
    let chance3 = Math.floor(Math.random() * 100);
    if (chance1 > 75) {
        if (chance2 > 50) {
            if (chance3 > 25) {
                pct = 12;
            } else pct = 8;
        } else pct = 4;
    }
    if (chance1 < 25) {
        if (chance2 < 25) {
            if (chance3 > 25) {
                pct = 50;
            } else pct = 25 + Math.floor(Math.random() * 10);
        } else pct = 10;
    }

    let updown = Math.floor(Math.random() * 100);
    if (chance1 <= 10) {
        updown = 51;
        pct = 100;
        if (chance1 > 5) {
            pct = 500;
        }
        if (chance1 === 1) {
            pct = 1000;
        }
    }

    if (updown > 50) {
        price += Math.floor((pct / 100) * price);
        return price;
    }
    price -= Math.floor((pct / 100) * price);
    return price;
}

function Movement() {
    Object.keys(market).forEach(i => {
        market[i].price = rpc(market[i].price);
    });
};
let url = 'mongodb+srv://bandi:getrekt@cluster0.mqcd1.mongodb.net/croupier?retryWrites=true&w=majority';
async function save() {
    const MongoClient = require('mongodb').MongoClient(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }, );

    await MongoClient.connect(async function(err, db) {
        if (err) throw err;
        let dbo = db.db('croupier');
        let data = [];
        Object.keys(market).forEach(i => {
            data.push(market[i]);
        });
        await dbo.collection('stockmarket').deleteMany({});
        dbo.collection('stockmarket').insertMany(data, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            //db.close();
        });
    });
    MongoClient.close();
};
async function load() {
    const MongoClient = require('mongodb').MongoClient(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }, );
    await MongoClient.connect(async function(err, db) {
        if (err) throw err;
        let dbo = db.db('croupier');
        await dbo.collection('stockmarket').find({}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            result.forEach(i => {
                market[i.ticker] = i;
            });
            //db.close();
        });
    });
    await MongoClient.close();
};
/*const tickers = {
AT: 'Adryen\'s Traphouse',
SC: 'Six\'s Commissions',
BS: 'Bandi\'s Studio',
AH: 'Ara\'s Halal',
NW: 'Nacho\'s Whorehouse',
TM: 'Thylan\'s Manufacturing',
KS: 'KingBillu\'s Suites',
SD: 'Sleaze\'s Dealership'
};*/
exports.save = save;
exports.load = load;
exports.Movement = Movement;
exports.Stock = Stock;

exports.market = market;
