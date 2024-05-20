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
    handleKeyDown(keyCode, game.players[0]);
  });
  client.on('newgame',handleNewGame)

function handleJoinGame(){
  const r=io.sockets.adapter.rooms[gameCode]
  let allusers;
  if(r){
  allusers=r.sockets
  }
  let num=0;
  if(allusers){
    num=Object.keys(allusers).length
  }
  if(num==0){
    client.emit('unknown')
    return
  }
  else if(num>1){
    client.emit('toomany')
    return
  }
  else{
    rooms[client.id]=gameCode
    client.number=2
    client.emit('init',2)
    startGame(gameCode)
  }}
  

  function handleNewGame(){
    let roomname=makeid(5)
    rooms[client.id]=roomname
    client.emit('gameCode',roomname)
    state[roomname]=initGame()
    client.join(roomname)
    client.number=1
    client.emit('init',1)
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

function emitgameover(roomname,state){
  io.sockets.in(roomname).emit('gameover',JSON.stringify({winner}))
}

function handleKeyDown(keyCode, player) {
  switch (keyCode) {
    case 37: // left
      if (player.vel.x === 0) {
        player.vel = { x: -1, y: 0 };
      }
      break;
    case 38: // up
      if (player.vel.y === 0) {
        player.vel = { x: 0, y: -1 };
      }
      break;
    case 39: // right
      if (player.vel.x === 0) {
        player.vel = { x: 1, y: 0 };
      }
      break;
    case 40: // down
      if (player.vel.y === 0) {
        player.vel = { x: 0, y: 1 };
      }
      break;
  }
}

const PORT = process.env.PORT || 5501;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
