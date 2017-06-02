let Vector = require("./Vector.js");
let Heart = require("./Heart.js");
let Creep = require("./Creep.js");
let CreepSpawner = require("./CreepSpawner.js");
let ResourceManager = require("./ResourceManager");

function GameManager(){
  this.players = [];
  this.resources = [];
  this.towers = [];
  this.creeps = [];
  this.genePool = [];
  this.nextGen = [];
  this.creepSpawners = [new CreepSpawner(this)];

  this.resourceManager = new ResourceManager(this);

  this.heart = new Heart();
  this.gen = 1;

  this.world = new Vector(500, 500);

  this.gameTime = 0;
}

GameManager.prototype.resourceLimit = 10;
GameManager.prototype.resourceMax = 400;
GameManager.prototype.resourceMin = 300;
GameManager.prototype.baseSpawnInterval = 300;

// not needed because the AI must learn first
// GameManager.prototype.gracePeriod = 60;

GameManager.prototype.start = function(players, world){
  this.world = world || this.world;
  this.heart = new Heart(this.world.cpy().mul(0.5));
  this.resourceManager = new ResourceManager(this);
  this.gameTime = 0;
  this.resources = [];
  this.genePool = [];
  this.nextGen = [];
  this.creeps = [];
  this.creepSpawners = [new CreepSpawner(this)];
  this.gen = 1;
  for(let i = 0; i < 10; i++){
    this.genePool.push(new Creep());
  }
};

GameManager.prototype.update = function(deltaTime){
  this.gameTime += deltaTime;
  this.resourceManager.update(deltaTime);

  for(let i in this.creepSpawners){
    this.creepSpawners[i].update(deltaTime);
  }
  for(let i in this.creeps){
    let crp = this.creeps[i];
    crp.update(deltaTime);
    let hitHeart = crp.pos.distanceSq(this.heart.pos);
    if(!crp.closest || crp.closest > hitHeart){
      crp.closest = hitHeart;
    }
    if(hitHeart < 225){
      if(hitHeart < 225){
        this.heart.health--;
      }
      crp.handleDeath();
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
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = GameManager;
}
