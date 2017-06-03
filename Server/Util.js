function Util(){

}
Util.remove = function(value, array){
  return array.splice(array.indexOf(value), 1);
};

Util.randomInt = function(max){
  return Math.floor(Math.random() *  max);
};

Util.randomIndex = function(array){
  return array[Util.randomInt(array.length)];
};

Util.clamp = function (val, min, max) {
  return Math.min(Math.max(val, min), max);
};

Util.mutate = function (value, amount, rate){
  if(Math.random() < rate){
    value += Util.randomRange(amount);
  }
  return value;
};

Util.randomRange = function (max){
  return (Math.random() * 2 - 1) * max;
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = Util;
}
