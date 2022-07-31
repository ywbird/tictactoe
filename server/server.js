const { Server } = require('socket.io');
const { createServer } = require('http');
const { initGame, gameStep } = require('./game');
const { makeid } = require('./utils');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const state = {};
const clientRooms = {};

io.on('connection', (socket) => {
  socket.on('newGame', handleNewGame);
  socket.on('joinGame', handleJoinGame);
  socket.on('btnClick', handleBtnClick);

  async function handleJoinGame(roomName) {
    const room = io.to(`${roomName}`);
    // console.log(room);
    // console.log(await io.fetchSockets());

    let allUsers;
    if (room) {
      allUsers = await room.fetchSockets();
    }

    let numClients = 0;
    if (allUsers) {
      numClients = allUsers.length;
    }

    if (numClients === 0) {
      socket.emit('unknownCode');
      return;
    } else if (numClients > 1) {
      socket.emit('roomFull');
      return;
    }

    clientRooms[socket.id] = roomName;

    socket.join(roomName);
    socket.number = 2;
    socket.emit(
      'init',
      JSON.stringify({
        number: 2,
        gameState: state[roomName],
      }),
    );
  }

  function handleNewGame() {
    let roomName = makeid(5);
    clientRooms[socket.id] = roomName;
    socket.emit('gameCode', roomName);

    state[roomName] = initGame();

    socket.join(`${roomName}`);
    socket.number = 1;
    socket.emit(
      'init',
      JSON.stringify({
        number: 1,
        gameState: state[roomName],
      }),
    );
  }

  function handleBtnClick({ cell, player }) {
    // console.log(clientRooms);
    const roomName = clientRooms[socket.id];
    if (player !== state[roomName]?.player) return;
    const winner = gameStep(state[roomName], cell);
    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
    }
  }
});

function emitGameState(room, gameState) {
  io.to(room).emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  io.to(room).emit('gameOver', JSON.stringify({ winner }));
}

io.listen(3000);
