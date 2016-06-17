/* eslint no-console: 0 */
console.log('Tesing EcmaScript 2015 features.');
console.log('View source: /assets/js/modules/es6.test.js');

var evens = [
  1, 5, 6, 7
];

var odds = evens.map((v) => {
  return v + 1;
});
var nums = evens.map((v, i) => v + i);

console.log(odds);
console.log(nums);

// Statement bodies
var fives = [];
nums.forEach((v) => {
  if (v % 5 === 0) {
    fives.push(v);
  }
});

// string
var customer = {name: 'Foo'};
var card = {amount: 7, product: 'Bar', unitprice: 42};
var message = `Hello ${customer.name},
want to buy ${card.amount} ${card.product} for
a total of ${card.amount * card.unitprice} bucks?`;
console.log(message);

// class
class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Monster extends Character {
  constructor(x, y, name) {
    super(x, y);
    this.name = name;
    this.health_ = 100;
  }

  attack(character) {
    super.attack(character);
    this.health_ += 10;
  }

  get isAlive() {
    return this.health_ > 0;
  }
  get health() {
    return this.health_;
  }
  set health(value) {
    if (value < 0) {
      throw new Error('Health must be non-negative.');
    }
    this.health_ = value;
  }
}
var myMonster = new Monster(5, 1, 'arrrg');
console.log(myMonster);
