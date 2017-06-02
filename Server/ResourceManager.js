let Resource = require("./Resource.js");

function ResourceManager(gameManager){
  this.gameManager = gameManager;
  this.gameTime = 0;
  this.lastSpawnTime = 0;
}

ResourceManager.prototype.maxResourceNodes = 5;
ResourceManager.prototype.resourceVariance = 100;
ResourceManager.prototype.baseResource = 50;
ResourceManager.prototype.respawnTime = 20;
ResourceManager.prototype.decayRate = 5;

ResourceManager.prototype.update = function(deltaTime){
  this.gameTime += deltaTime;
  if(this.gameManager.resources.length < this.maxResourceNodes && this.gameTime - this.lastSpawnTime > this.respawnTime){
    this.createNewResource();
  }
  for(let i in this.gameManager.resources){
    let r = this.gameManager.resources[i];

    r.amount -= this.decayRate * deltaTime;
    if(r.amount <= 0){
      this.gameManager.resources.slice(i,1);
    }
  }
};

ResourceManager.prototype.createNewResource = function () {
  this.gameManager.resources.push(
    new Resource(
      Math.random() * this.gameManager.world.x,
      Math.random() * this.gameManager.world.y,
      Math.random() * this.resourceVariance + this.baseResource));
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ResourceManager;
}
