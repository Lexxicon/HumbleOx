let Vector = require("./Vector.js");
let Heart = require("./Heart.js");
let Creep = require("./Creep.js");
let Fitness = require("./Fitness.js");

function GameManager(){
  this.players = [];
  this.resources = [];
  this.towers = [];
  this.creeps = [];
  this.genePool = [];
  this.nextGen = [];
  this.heart = new Heart();
  this.gen = 1;

  this.world = new Vector(500, 500);

  this.gameTime = 0;
}

GameManager.prototype.resourceLimit = 10;
GameManager.prototype.resourceMax = 400;
GameManager.prototype.resourceMin = 300;

GameManager.prototype.mutationRate = 0.1;
GameManager.prototype.perfectBreedRate = 10;
GameManager.prototype.baseCullSize = 50;
GameManager.prototype.baseSpawnInterval = 300;

// not needed because the AI must learn first
// GameManager.prototype.gracePeriod = 60;

GameManager.prototype.evaluate = new Fitness().evaluate;

GameManager.prototype.start = function(players, world){
  this.world = world || this.world;
  this.heart = new Heart(this.world.cpy().mul(0.5), (players||[]).length * 4 + 40);
  this.gameTime = 0;
  this.resources = [];
  this.genePool = [];
  this.nextGen = [];
  this.creeps = [];
  this.gen = 1;
  for(let i = 0; i < 10; i++){
    this.genePool.push(new Creep());
  }
};

GameManager.prototype.cull = function(){
  let newGen = [];
  for(let i = 0; i < this.baseCullSize; i++){
    newGen.push(this.nextGen[Math.floor(Math.random() * this.nextGen.length)]);
  }
  this.gen += 1;
  console.log("Spawned generation " + this.gen);
  this.genePool = newGen;
  this.nextGen = [];
};

GameManager.prototype.spawnCreep = function () {
  if(this.genePool.length == 0 || Math.random() < this.mutationRate){
    this.creeps.push(Creep.random());
  }else{
    let i = Math.floor(Math.random() * this.genePool.length);
    this.creeps.push(Creep.breed(this.genePool[i], this.world, this.mutationRate));
  }
};

GameManager.prototype.update = function(deltaTime){
  this.gameTime += deltaTime;
  for(let i in this.creeps){
    let crp = this.creeps[i];
    crp.update(deltaTime);
    let hitHeart = crp.pos.distanceSq(this.heart.pos);
    if(!crp.closest || crp.closest > hitHeart){
      crp.closest = hitHeart;
    }
    if(crp.age > crp.timeToLive || hitHeart < 225){
      if(hitHeart < 225){
        this.heart.health--;
      }
      this.creeps.splice(i, 1);
      let fit = this.evaluate(crp, this.heart) * this.perfectBreedRate;
      while(0 < fit--){
        this.nextGen.push(crp);
      }
    }
  }

  if(this.heart.health <= 0){
    this.start(this.players, this.world);
  }
};

GameManager.prototype.getState = function(){
  return {
    players:this.players,
    resources:this.resources,
    towers:this.towers,
    creeps:this.creeps,
    heart:this.heart,
    world:this.world,
    gameTime:this.gameTime,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameManager;
}
