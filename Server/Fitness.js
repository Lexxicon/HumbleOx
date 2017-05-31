
function Fitness(){
}

Fitness.prototype.evaluate = function(creep, target){
  let dst = creep.pos.distance(target.pos);
  let startDst = creep.spawnLocation.distance(target.pos);
  if(dst < 15){
    return 1 + (creep.timeToLive - creep.age) / creep.timeToLive;
  }else{
    return (startDst - dst)/startDst;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Fitness;
}
