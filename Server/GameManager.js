let Vector = require("./Vector.js");
let Heart = require("./Heart.js");
let CreepSpawner = require("./CreepSpawner.js");
let ResourceManager = require("./ResourceManager");

function GameManager(){
  this.world = new Vector(500, 500);

  this.players = [];
  this.resources = [];
  this.towers = [];
  this.creeps = [];
  this.creepSpawners = [new CreepSpawner(this, this.world.cpy().mul(0.5))];

  this.resourceManager = new ResourceManager(this);

  this.heart = new Heart(Vector.random(this.world));
  this.gen = 1;


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
  this.heart = new Heart(Vector.random(this.world));
  this.resourceManager = new ResourceManager(this);
  this.gameTime = 0;
  this.resources = [];
  this.creeps = [];
  this.creepSpawners = [new CreepSpawner(this, this.world.cpy().mul(0.5))];
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
    this.heart = new Heart(Vector.random(this.world));
  }
};

GameManager.prototype.getState = function(){
  return {
    players:this.players,
    resources:this.resources,
    towers:this.towers,
    creeps:this.creeps.map(a=>a.pack()),
    heart:this.heart,
    world:this.world,
    gameTime:this.gameTime,
  };
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = GameManager;
}
