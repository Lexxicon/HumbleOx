let xOffset;
let yOffset;

let socket;
let world = {};
let id;

let ready = false;
let name = "-";
var nameInput, connectButton, namePrompt;

function setup() {
  frameRate(60);

  nameInput = createInput();
  nameInput.position(20, 65);
  nameInput.elt.focus();
  nameInput.value(readCookie("username") || "");

  connectButton = createButton("connect");
  connectButton.position(nameInput.x + nameInput.width, 65);
  connectButton.mousePressed(connect);

  namePrompt = createElement("h2", "what is your name?");
  namePrompt.position(20, 5);

  textAlign(CENTER);
  textSize(50);
  ellipseMode(CENTER);
}

function keyReleased(){
  if(!ready && keyCode == ENTER){
    connect();
    socket.emit("spawn", {});
  }
  if(ready){
    socket.emit("spawn", {});
  }
}

function connect(){
  name = nameInput.value();
  createCookie("username",name, 10);
  socket = io.connect("http://lexxicon.crabdance.com:3000");
  socket.emit("start", {name:name}, a=>{
    console.log("callback " + a);
    console.log(a);
    createCanvas(a.world.x, a.world.y);
  });

  socket.on("heartbeat", (data)=>{
    world = data;
  });
  connectButton.remove();
  nameInput.remove();
  namePrompt.remove();
  noStroke();
  ready=true;
}

function mouseMoved(){
  if(mouseIsPressed){
    xOffset -= mouseX - pmouseX;
    yOffset -= mouseY - pmouseY;
  }
}

function render(player){
  fill(Math.floor(player.color[0]),Math.floor(player.color[1]),Math.floor(player.color[2]));
  ellipse(player.pos.x, player.pos.y, 10, 10);
  textAlign(CENTER);
  textSize(14);
  // text(player.name||"-", player.pos.x, player.pos.y + 24);
}

function draw() {
  if(ready){
    translate(width/4, height/4);
    background(0);

    if(world && world.heart){
      world.heart.color[0] *= world.heart.health/40;
      render(world.heart);
    }
    // render({name:name, x:mouseX, y:mouseY});
    //
    for(let i in world.creeps){
      render(world.creeps[i]);
    }
    //
    // socket.emit('update', {name: name, x:mouseX, y:mouseY});
  }
}
