let Creep = require("./Creep.js");
let Fitness = require("./Fitness.js");
let Util = require("./Util.js");

function CreepSpawner(gameManager){
  this.genePool = [];
  this.nextGen = [];
  this.gen = 0;
  this.worldtime = 0;
  this.lastSpawnTime = 0;
  this.gameManager = gameManager;
  this.maxFitness = 0;
}

CreepSpawner.prototype.mutationRate = 0.1;
CreepSpawner.prototype.perfectBreedRate = 10;
CreepSpawner.prototype.poolSize = 40;
CreepSpawner.prototype.spawnRate = 0.25;

CreepSpawner.prototype.rank = new Fitness().evaluate;

CreepSpawner.prototype.createNewGeneration = function(){
  let pool = [];
  while(pool.length < this.poolSize){
    pool.push(Util.randomIndex(this.nextGen)|| Creep.random());
  }
  this.gen += 1;
  console.log("Spawned generation " + this.gen +"------------");
  if(this.nextGen.length > 0){
    let avgFit = this.nextGen.map(a=>a.fit).reduce((a,b)=>a+b)/this.nextGen.length;
    let medFit = this.nextGen.map(a=>a.fit).sort((a,b)=>a-b)[Math.floor(this.nextGen.length/2)];
    let minFit = this.nextGen.map(a=>a.fit).reduce((a,b)=>Math.min(a,b));
    let maxFit = this.nextGen.map(a=>a.fit).reduce((a,b)=>Math.max(a,b));
    console.log("  Average: " + avgFit);
    console.log("   Median: " + medFit);
    console.log("  Minimum: " + minFit);
    console.log("  Maximum: " + maxFit);
  }
  this.maxFitness = 0;
  this.genePool = pool;
  this.nextGen = [];
};

CreepSpawner.prototype.update = function(deltaTime){
  this.worldtime += deltaTime;
  if(this.worldtime - this.lastSpawnTime > this.spawnRate){
    this.lastSpawnTime = this.worldtime;
    this.gameManager.creeps.push(this.spawn());
  }
};

CreepSpawner.prototype.addToNextGen = function(creep){
  let fit = this.rank(creep, this.gameManager.heart);
  creep.fit = fit;
  this.maxFitness = Math.max(this.maxFitness, fit);
  let weightedFit = fit * fit * this.perfectBreedRate;
  while(0 < weightedFit--){
    this.nextGen.push(creep);
  }
};

CreepSpawner.prototype.remove = function(creep){
  let i = this.gameManager.creeps.indexOf(creep);
  this.gameManager.creeps.slice(i, 1);
};

CreepSpawner.prototype.spawn = function(){
  if(this.genePool.length == 0){
    this.createNewGeneration();
  }

  let c = Creep.breed(this.genePool.shift(), this.mutationRate);
  c.onDeath(this.addToNextGen.bind(this));
  c.onDeath(Util.remove.bind(this, this.gameManager.creeps));
  return c;
};

CreepSpawner.prototype.mutate = function(creep){

};

if (typeof module !== "undefined" && module.exports) {
  module.exports = CreepSpawner;
}
