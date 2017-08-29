let socket;
let world = {};

let ready = false;
var nameInput, connectButton, namePrompt;

/* exported setup */
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
  colorMode(HSB, 100);
}

/* exported keyReleased */
function keyReleased() {
  if (!ready && keyCode == ENTER) {
    connect();
  }
}

function connect() {
  let name = nameInput.value();
  createCookie("username", name, 10);
  socket = io.connect("http://localhost:3000");
  socket.emit("start", { name: name }, a => {
    console.log("callback ");
    console.log(a);
  });

  socket.on("heartbeat", (data) => {
    if (!ready) {

      ready = true;
      createCanvas(data.world.x, data.world.y);
      background(255);
    }
    world = data;
  });
  connectButton.remove();
  nameInput.remove();
  namePrompt.remove();
  noStroke();
}

/* exported mouseMoved */
function mouseMoved() {
}

function render(player) {
  fill(Math.floor(player.color[0]), Math.floor(player.color[1]), Math.floor(player.color[2]));

  ellipse(player.pos.x, player.pos.y, 5, 5);
}

/* exported draw */
function draw() {
  if (ready) {
    background(255);

    if (world && world.heart) {
      world.heart.color[2] *= world.heart.health / 40;
      render(world.heart);
    }
    for (let i in world.creeps) {
      render(world.creeps[i]);
    }
  }
}
