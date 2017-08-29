let tickRate = 30;
let timePerTick = 1000 / tickRate;
let GameManager = require("./Server/GameManager.js");

let instance = new GameManager();
instance.start();

// Using express: http://expressjs.com/
let express = require("express");
let app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
let server = app.listen(3000, "0.0.0.0", listen);
function listen() {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Humble Ox listening at http://" + host + ":" + port);
}

app.use(express.static("public"));
let io = require("socket.io")(server);

setInterval(heartbeat, timePerTick);

function heartbeat() {
  instance.update((timePerTick) / 1000);
  let packagedWorld = instance.getState();
  io.sockets.emit("heartbeat", packagedWorld);
}


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on("connection",
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    socket.on("spawn", function (data) {
    });
    socket.on("cull", function (data) {
    });
    socket.on("start",
      function (data, fn) {
        console.log("start: " + socket.id + ": " + data.name);
        fn({ world: instance.world });
      }
    );

    socket.on("update",
      function (data) {
      }
    );

    socket.on("disconnect", function () {
      console.log("Client " + socket.id + " has disconnected");
    });
  }
);
