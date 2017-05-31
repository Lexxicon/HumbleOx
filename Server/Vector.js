function Vector(x, y){
  this.x = x || 0;
  this.y = y || 0;
}

Vector.random = function(){
  return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1).norm();
};

Vector.prototype.norm = function(){
    let m = this.mag();
    if(m > 0){
      this.div(m);
    }
    return this;
}

Vector.prototype.distance = function(target){
  return Math.sqrt(Math.pow((this.x - target.x), 2) + Math.pow((this.y - target.y), 2));
};

Vector.prototype.add = function(x){
  if(typeof x == 'number'){
    this.x += x;
    this.y += x;
  }else{
    this.x += x.x;
    this.y += x.y;
  }
  return this;
};

Vector.prototype.mul = function(x){
  if(typeof x == 'number'){
    this.x *= x;
    this.y *= x;
  }else{
    this.x *= x.x;
    this.y *= x.y;
  }
  return this;
};

Vector.prototype.div = function(x){
  if(typeof x == 'number'){
    this.x /= x;
    this.y /= x;
  }else{
    this.x /= x.x;
    this.y /= x.y;
  }
  return this;
};

Vector.prototype.mag = function(){
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.heading = function(){
  return Math.atan2(this.y, this.x);
};

Vector.prototype.rotate = function(a){
  let newHeading = this.heading() + a;
  let mag = this.mag();
  this.x = Math.cos(newHeading) * mag;
  this.y = Math.sin(newHeading) * mag;
  return this;
};

Vector.prototype.cpy = function(){
  return new Vector(this.x, this.y);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Vector;
}
