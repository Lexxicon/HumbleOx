let Vector = require("./Vector.js");
let Heart = require("./Heart.js");
let Creep = require("./Creep.js");

function GameManager(){
  this.players = [];
  this.creeps = [];
  this.resources = [];
  this.genePool = [];

  this.heart = new Heart();

  this.world = new Vector(500, 500);

  this.gameTime = 0;
}

GameManager.prototype.resourceLimit = 10;
GameManager.prototype.resourceMax = 400;
GameManager.prototype.resourceMin = 300;

GameManager.prototype.mutationRate = 0.01;
GameManager.prototype.baseCullRate = 0.1;
GameManager.prototype.baseSpawnInterval = 300;

// not needed because the AI must learn first
// GameManager.prototype.gracePeriod = 60;

GameManager.prototype.start =  function(players, world){
  this.world = world || this.world;
  this.heart = new Heart(this.world.cpy().mul(0.5), players.length * 4 + 10));
  this.gameTime = 0;
  this.resources = [];
  this.genePool = [new Creep()];
};

GameManager.prototype.cull = function(){
  if(this.genePool.length > 10){
    this.genePool.forEach((val, i, arr)=>{
      let j = Math.floor(Math.random()*arr.length);
      arr[i] = arr[j];
      arr[j] = val;
    });
    let cullAmount = Math.floor(this.genePool.length * this.baseCullRate);
    while(0 < cullAmount--){
      this.genePool.shift();
    }
  }
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
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameManager;
}
