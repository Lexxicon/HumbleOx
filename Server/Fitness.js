
function Fitness(){
}

Fitness.prototype.evaluate = function(creep, target){
  let dst = creep.closest;
  let startDst = creep.spawnLocation.distanceSq(target.pos);
  if(dst < 225){
    return 1 + (creep.timeToLive - creep.age) / creep.timeToLive;
  }else{
    return (startDst - dst)/startDst;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Fitness;
}
