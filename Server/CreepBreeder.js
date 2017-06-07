let Creep = require("./Creep.js");
let Util = require("./Util.js");
let Vector = require("./Vector.js");

function CreepBreeder() {

}

CreepBreeder.prototype.breed = function(parent, mutationRate){
  parent = parent || new Creep();
  let mutant = parent.copy();
  mutationRate = mutationRate || 0.01;

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
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = CreepBreeder;
}
