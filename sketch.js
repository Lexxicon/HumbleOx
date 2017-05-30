let xOffset;
let yOffset;

let socket;
let world = {};
let id;

let ready = false;
let name = "-";
var nameInput, connectButton, namePrompt;

function setup() {
  socket = io.connect('http://lexxicon.crabdance.com:3000');
  frameRate(60);

  nameInput = createInput();
  nameInput.position(20, 65);
  nameInput.elt.focus();
  nameInput.value(readCookie("username") || "");

  connectButton = createButton('connect');
  connectButton.position(nameInput.x + nameInput.width, 65);
  connectButton.mousePressed(connect);

  namePrompt = createElement('h2', 'what is your name?');
  namePrompt.position(20, 5);

  textAlign(CENTER);
  textSize(50);
}

function keyReleased(){
    if(!ready && keyCode == ENTER){
      connect();
    }
}

function connect(){
  createCanvas(800,400);
  name = nameInput.value();
  createCookie("username",name, 10);
  socket.emit('start', {name:name});

  socket.on('heartbeat', (data)=>{
    world = data.filter(a=> socket.id != a.id);
  });
  connectButton.remove();
  nameInput.remove();
  namePrompt.remove();
  noCursor();
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
  fill(255);
  ellipse(player.x, player.y, 10, 10);
  textAlign(CENTER);
  textSize(14);
  text(player.name||"-", player.x, player.y + 24);
}

function draw() {
  if(ready){
    background(0);

    render({name:name, x:mouseX, y:mouseY});

    for(let i in world){
      render(world[i]);
    }

    socket.emit('update', {name: name, x:mouseX, y:mouseY});
  }
}
