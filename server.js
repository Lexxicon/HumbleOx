let tickRate = 60;

// Using express: http://expressjs.com/
let express = require('express');
let app = express();
let gameWorld = {};

// Set up the server
// process.env.PORT is related to deploying on heroku
let server = app.listen(3000, "0.0.0.0", listen);
function listen() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('SpaceRacer listening at http://' + host + ':' + port);
}

app.use(express.static('public'));
let io = require('socket.io')(server);

setInterval(heartbeat, 1000/tickRate);

function heartbeat() {

  let packagedWorld = [];
  for(let id in gameWorld){
    gameWorld[id].id = id;
    packagedWorld.push(gameWorld[id]);
  }
  io.sockets.emit('heartbeat',packagedWorld);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("We have a new client: " + socket.id);
    gameWorld[socket.id] = {};
    
    socket.on('start',
      function(data) {
        console.log("start: " + socket.id + ": " + data.name);
      }
    );

    socket.on('update',
      function(data) {
        gameWorld[socket.id] = data;
      }
    );

    socket.on('disconnect', function() {
      console.log("Client " + socket.id + " has disconnected");
      delete gameWorld[socket.id];
    });
  }
);
