let Vector = require("./Vector.js");
let Util = require("./Util.js");

function Creep(parent){
  if(!parent){
    this.movements = [];
    for(let i = 0; i < 10; i++){
      this.movements.push(Vector.random());
    }
    this.moveSpeed = 70;
    this.health = 5;
    this.spawnLocation = new Vector(15,15);
    this.timeToLive = 8;
    this.color =[Math.floor(Math.random()*100),100,Math.floor(Math.random()*50)+50];
  }else{
    this.movements = parent.movements.map(p=>p.cpy());
    this.moveSpeed = parent.moveSpeed;
    this.health = parent.health;
    this.spawnLocation = parent.spawnLocation.cpy();
    this.timeToLive = parent.timeToLive;
    this.color = parent.color.map(c=>c);
  }

  this.age = 0;
  this.damageTaken = 0;
  this.pos = this.spawnLocation.cpy();
  this.vel = new Vector(0,0);
  this.deathHndls = [];
}

Creep.random = function(){
  return new Creep();
};

Creep.prototype.copy = function(){
  return new Creep(this);
};

Creep.prototype.onDeath = function(hndl){
  this.deathHndls.push(hndl);
  return this;
};

Creep.prototype.handleDeath = function(){
  for(let i = 0; i < this.deathHndls.length; i++){
    this.deathHndls[i](this);
  }
};

Creep.prototype.update = function(deltaTime){
  this.age += deltaTime;
  if(this.age > this.timeToLive){
    this.handleDeath();
  }else{
    let movementIndex = Math.floor((this.age/this.timeToLive) * this.movements.length);
    this.vel.add(this.movements[movementIndex].cpy().mul(this.moveSpeed*deltaTime));
    this.pos.add(this.vel.cpy().mul(deltaTime));
  }
};

Creep.prototype.pack = function(){
  return {
    color:this.color,
    pos:this.pos,
  };
};

Creep.breed = function(parent, mutationRate){
  parent = parent || new Creep();
  let mutant = parent.copy();
  mutationRate = mutationRate || 0.01;
  if(Math.random() < mutationRate){
    return Creep.random();
  }

  mutant.moveSpeed = Util.mutate(mutant.moveSpeed, 1, mutationRate);
  mutant.health = Util.mutate(mutant.health, .5, mutationRate);
  mutant.timeToLive = Util.mutate(mutant.timeToLive, 4, mutationRate);
  for(let i = 0; i < mutant.color.length; i++){
    mutant.color[i] = Util.clamp(Util.mutate(mutant.color[i], 20, mutationRate), 0, 100);
  }

  if(Math.random() < mutationRate){
    let luckyIndex = Math.floor(Math.random() * mutant.movements.length);
    if(mutant.movements.length > 1 && Math.random() < 0.5){
      mutant.movements.splice(luckyIndex, 1);
    }else{
      mutant.movements.splice(luckyIndex, 0, Vector.random());
    }
  }

  if(Math.random() < mutationRate){
    Util.randomIndex(mutant.movements).rotate(Util.randomRange(Math.PI/4));
  }

  let baby = new Creep(mutant);
  return baby;
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = Creep;
}
