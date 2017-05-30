let Vector = require("./Vector.js");
let Heart = require("./Heart.js");

function GameManager(){
  this.players = [];
  this.creeps = [];
  this.resources = [];

  this.heart = new Heart();

  this.world = new Vector(500, 500);

  this.gameTime = 0;
}

GameManager.prototype.resourceLimit = 10;
GameManager.prototype.resourceMax = 400;
GameManager.prototype.resourceMin = 300;

// not needed because the AI must learn first
// GameManager.prototype.gracePeriod = 60;

GameManager.prototype.start =  function(players, world){
  this.world = world || this.world;
  this.heart = new Heart(this.world.cpy().mul(0.5), players.length * 4 + 10));
  this.gameTime = 0;
  this.resources = [];
};

GameManager.prototype.update = function(deltaTime){
  this.gameTime += deltaTime;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameManager;
}
