const { grid_size } = require('./const');

function gameState() {
  return {
    players: [{
      pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 1,
        y: 0,
      },
      snake: [
        { x: 1, y: 10 },
        { x: 2, y: 10 },
        { x: 3, y: 10 },
      ],
    }, {
      pos: {
        x: 18,
        y: 10,
      },
      vel: {
        x: 0,
        y: 0,
      },
      snake: [
        { x: 20, y: 10 },
        { x: 19, y: 10 },
        { x: 18, y: 10 },
      ],
    }],
    food: {},
    gridsize: grid_size,
    active:true
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  const player1 = state.players[0];
  const player2 = state.players[1];

  player1.pos.x += player1.vel.x;
  player1.pos.y += player1.vel.y;

  if (player1.pos.x < 0 || player1.pos.x >= grid_size || player1.pos.y < 0 || player1.pos.y >= grid_size) {
    return 2;
  }

  if (player2.pos.x < 0 || player2.pos.x >= grid_size || player2.pos.y < 0 || player2.pos.y >= grid_size) {
    return 1;
  }

  if (state.food.x === player1.pos.x && state.food.y === player1.pos.y) {
    player1.snake.push({ ...player1.pos });
    player1.pos.x += player1.vel.x;
    player1.pos.y += player1.vel.y;
    randomfood(state);
  }
  if (state.food.x === player2.pos.x && state.food.y === player2.pos.y) {
    player2.snake.push({ ...player2.pos });
    player2.pos.x += player2.vel.x;
    player2.pos.y += player2.vel.y;
    randomfood(state);
  }

  if (player1.vel.x || player1.vel.y) {
    for (let cell of player1.snake) {
      if (cell.x === player1.pos.x && cell.y === player1.pos.y) {
        return 2;
      }
    }
    player1.snake.push({ ...player1.pos });
    player1.snake.shift(); // Properly shift the first snake's body
  }
  if (player2.vel.x || player2.vel.y) {
    for (let cell of player2.snake) {
      if (cell.x === player2.pos.x && cell.y === player2.pos.y) {
        return 1;
      }
    }
    player2.snake.push({ ...player2.pos });
    player2.snake.shift(); // Properly shift the second snake's body
  }

  return false;
}





function randomfood(state) {
  let food = {
    x: Math.floor(Math.random() * grid_size),
    y: Math.floor(Math.random() * grid_size),
  };

  for (let cell of state.players[0].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomfood(state);
    }
  }

  state.food = food;
}
function initGame() {
  const state = gameState()
  randomfood(state);
  return state;
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  gameLoop,
  initGame,
  randomfood,
  makeid
};
