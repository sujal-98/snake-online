const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { initGame, gameLoop, makeid } = require('./game');
const { frame_rate } = require('./const');

const app = express();
const server = http.createServer(app);
const rooms={}
const state={}

app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: '*', 
  }
});



io.on('connection', (client) => {
  console.log('Client connected');

  client.on('keydown', (keyCode) => {
    handleKeyDown(keyCode, handleKeyDown(keyCode));
  });
  client.on('newGame',handleNewGame)
  client.on('joinGame', handleJoinGame)

  function handleJoinGame(roomname) {
    console.log("joined")
    console.log(roomname)
    console.log(rooms)
    console.log(state)
    const room =  io.sockets.adapter.rooms.get(roomname);
    console.log(room)
    
    let allUsers;
    if (room) {
      allUsers = [...room];
      console.log(allUsers)
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
      console.log(numClients)
    }

    if (numClients === 0) {
      client.emit('unknownCode');
      return;
    } else if (numClients > 1) {
      client.emit('tooManyPlayers');
      return;
    }
    client.emit('gameCode',roomname)
    rooms[client.id] = roomname;

    client.join(roomname);
    client.number = 2;
    console.log(client.number)
    client.emit('init', 2);
    
    startGame(roomname);
  }


  function handleNewGame(){
    let roomname=makeid(5)
    rooms[client.id]=roomname
    client.emit('gameCode',roomname)
    state[roomname]=initGame()
    console.log(roomname)
    client.join(roomname)
    client.number=1
    client.emit('init',1)
    console.log(rooms[client.id])
    console.log(rooms)
    console.log(state)

  }
  
function handleKeyDown(keyCode) {
  const name=rooms[client.id]
  if(!name){
    return;
  }
  switch (keyCode) {
    case 37: // left
      if (state[name].players[client.number-1].vel.x === 0) {
        state[name].players[client.number-1].vel= { x: -1, y: 0 };
      }
      break;
    case 38: // up
      if (state[name].players[client.number-1].vel.y === 0) {
        state[name].players[client.number-1].vel= { x: 0, y: -1 };
      }
      break;
    case 39: // right
      if (state[name].players[client.number-1].vel.x === 0) {
        state[name].players[client.number-1].vel= { x: 1, y: 0 };
      }
      break;
    case 40: // down
      if (state[name].players[client.number-1].vel.y === 0) {
        state[name].players[client.number-1].vel= { x: 0, y: 1 };
      }
      break;
  }
}

});

function startGame(roomname) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomname]);
    if (!winner) {
emitgamestate(roomname,state[roomname])
    } else {
emitgameover(roomname,winner)
      clearInterval(intervalId);
    }
  }, 1000 / frame_rate);
}


function emitgamestate(roomname,state){
  io.sockets.in(roomname).emit('gameState',JSON.stringify(state))
}

function emitgameover(roomname,winner){
  console.log(winner)
  io.sockets.in(roomname).emit('gameOver',JSON.stringify(winner))
}


const PORT = process.env.PORT || 5501;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
