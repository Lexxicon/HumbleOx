let Creep = require("./Creep.js");
let Fitness = require("./Fitness.js");

function CreepSpawner(gameManager){
  this.genePool = [];
  this.nextGen = [];
  this.gen = 0;
  this.worldtime = 0;
  this.lastSpawnTime = 0;
  this.gameManager = gameManager;
}

CreepSpawner.prototype.mutationRate = 0.1;
CreepSpawner.prototype.perfectBreedRate = 10;
CreepSpawner.prototype.poolSize = 20;
CreepSpawner.prototype.spawnRate = 0.5;

CreepSpawner.prototype.rank = new Fitness().evaluate;

CreepSpawner.prototype.createNewGeneration = function(){
  let pool = [];
  while(pool.length < this.poolSize){
    pool.push(this.nextGen[Math.floor(Math.random() * this.nextGen.length)] || Creep.random());
  }
  this.gen += 1;
  console.log("Spawned generation " + this.gen);
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
  let fit = this.rank(creep, this.gameManager.heart) * this.perfectBreedRate;
  while(0 < fit--){
    this.nextGen.push(creep);
  }
};

CreepSpawner.prototype.spawn = function(){
  if(this.genePool.length == 0){
    this.createNewGeneration();
  }

  let c = Creep.breed(this.genePool.shift(), this.mutationRate);
  c.onDeath(this.addToNextGen.bind(this));

  return c;
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = CreepSpawner;
}
