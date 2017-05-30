
let Vector = require("./Vector.js");

function Heart(pos, health){
  this.pos = pos || new Vector();
  this.health = health || 10;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Heart;
}
