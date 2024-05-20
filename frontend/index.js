
    const BG_COLOUR = '#231f20';
    const SNAKE_COLOUR = '#c2c2c2';
    const FOOD_COLOUR = '#e66916';
    const GRID_SIZE = 20;

    const socket = io('http://localhost:5501', {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('gameState', (state) => {
      console.log(state);
      handleState(JSON.parse(state));
    });

    socket.on('gameOver', () => {
      alert("Game Over");
    });

    let canvas, ctx, state;

    function init() {
      canvas = document.getElementById('canvas');
      ctx = canvas.getContext('2d');
      canvas.width = canvas.height = 600;
      ctx.fillStyle = BG_COLOUR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      document.addEventListener('keydown', keydown);
      if (state) {
        paintGame(state);
      }
    }

    function keydown(e) {
      socket.emit('keydown', e.keyCode);
    }

    function paintGame(state) {
      ctx.fillStyle = BG_COLOUR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const food = state.food;
      const gridsize = state.gridsize;
      const size = canvas.width / gridsize;

      ctx.fillStyle = FOOD_COLOUR;
      ctx.fillRect(food.x * size, food.y * size, size, size);

      paintPlayer(state.players[0], size, SNAKE_COLOUR);
      paintPlayer(state.players[1], size, 'red');
    }

    function paintPlayer(playerState, size, colour) {
      const snake = playerState.snake;

      ctx.fillStyle = colour;
      for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
      }
    }

    function handleState(gameState) {
      state = gameState;
      requestAnimationFrame(() => paintGame(state));
    }

    init();

