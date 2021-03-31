class Job {
  constructor(title, wage, shift, message) {
    this.title = title;
    this.wage = wage;
    this.shift = shift;
    this.message = message;
  }
};

exports.programmer = new Job('Programmer', 100, 'daily', 'to-do')
