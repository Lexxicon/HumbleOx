
let Vector = require("./Vector.js");

function Heart(pos, health){
  this.pos = pos || new Vector();
  this.health = health || 10;
  this.color = [255,0,0];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Heart;
}
