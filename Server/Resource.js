let Vector = require("./Vector.js");

function Resource(x, y, amount){
  this.pos = new Vector(x || 0, y || 0);
  this.amount = amount;
}


if (typeof module !== "undefined" && module.exports) {
  module.exports = Resource;
}
