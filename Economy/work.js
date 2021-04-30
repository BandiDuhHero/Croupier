class Job {
  constructor(title, wage, shift, message) {
    this.title = title;
    this.wage = wage;
    this.shift = shift;
    this.paymsg = message;
  }
};

exports.ceo = new Job('CEO', 1000, 'weekly', '');

exports.rapper = new Job('Rapper', 1500, 'weekly', '');

exports.programmer = new Job('Programmer', 100, 'daily', '');

exports.drugdealer = new Job('Drug Dealer', 70, 'hourly', '');

exports.doctor = new Job('Doctor', 200, 'daily', '');

exports.botanist = new Job('Botanist', 70, 'daily', '');

exports.cook = new Job('Cook', 60, 'daily', '');

exports.cashier = new Job('Cashier', 60, 'daily', '');

