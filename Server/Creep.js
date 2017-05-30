let Vector = require("./Vector.js");

function Creep(parent){
  if(!parent){
    this.movements = [Vector.random()];
    this.moveSpeed = 2;
    this.health = 5;
    this.spawnLocation = new Vector(0,0);
    this.timeToLive = 30;
  }else{
    this.movements = parent.movements.map(p=>p.cpy());
    this.moveSpeed = parent.moveSpeed;
    this.health = parent.health;
    this.spawnLocation = parent.spawnLocation.cpy();
    this.timeToLive = parent.timeToLive;
  }

  this.age = 0;
  this.damageTaken = 0;
  this.pos = this.spawnLocation.cpy();
}

Creep.prototype.update = function(deltaTime){
  this.age += deltaTime;
  if(this.age > this.timeToLive){
    //die
  }else{
    let movementIndex = Math.floor((this.age/this.timeToLive) * movements.length);
    this.pos.add(this.movements[movementIndex] * this.moveSpeed);
  }
};

Creep.prototype.copy = function(){
  return new Creep(this);
}

function mutate(value, amount, rate){
  if(Math.random() < rate){
    value += randomRange(amount);
  }
  return value;
}

function randomRange(max){
  return (Math.random() * 2 - 1) * max;
}

Creep.random = function(){
  return new Creep();
};

Creep.breed = function(parent, world, mutationRate){
  let mutant = parent.copy();
  mutationRate = mutationRate || 0.01;

  mutant.moveSpeed = mutate(mutant.moveSpeed, 1, mutationRate);
  mutant.health = mutate(mutant.health, .5, mutationRate);
  mutant.timeToLive = mutate(mutant.timeToLive, 4, mutationRate);

  if(Math.random() < mutationRate){
    mutant.spawnLocation = moveAlongRect(mutant.spawnLocation, randomRange(10), world);
  }

  for(let i = 0; i < mutant.movements.length; i++){
    if(Math.random() < (mutationRate / mutant.movements.length)){
      mutant.movements[i].rotate(randomRange(Math.PI/2));
    }
  }

  let baby = new Creep(mutant);
  return baby;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Creep;
}
