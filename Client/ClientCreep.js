function ClientCreep(data){
  //could be int?
  this.moveSpeed = data.moveSpeed;
  //send as angle?
  angleMode(DEGREES);
  this.movementVelocity = data.vel.map(a => p5.Vector.fromAngle(a));
  //could be int?
  this.maxHealth = data.maxHealth;
  //could be int
  this.heath = data.heath;
  this.timeTolive = data.timeToLive;
  //[100,100,100] -> angle?
  this.color = decode(data.color);
  this.spawnTime = data.spawnTime;
  //could reference the spawner id instead?
  this.spawnLocation = data.spawnLocation;
}

function encode(x,y,z){
  return ((x & 0xFF) << 16) + ((y & 0xFF) << 8) + ((z & 0xFF));
}
function decode(a){
  return [
    (a & 0xFF0000) >> 16,
    (a & 0x00FF00) >> 8,
    (a & 0x0000FF),
  ];
}
