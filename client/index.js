const gameElement = document.getElementById('gameElement');

const socket = io('https://fast-inlet-41976.herokuapp.com/');
// const socket = io('http://localhost:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('roomFull', handleRoomFull);
socket.on('turn', handleTurn);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const gamePlayerDisplay = document.getElementById('gamePlayerDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame() {
  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

let player, enemy;
let gameActive = false;

function init() {
  for (let i = 0; i < 3; i++) {
    const b = document.createElement('div');
    b.classList.add('row');
    for (let j = 0; j < 3; j++) {
      const a = document.createElement('div');
      a.classList.add('column');
      a.classList.add('cell');
      a.className +=
        ' d-flex flex-column align-items-center justify-content-center';
      a.id = `${i}-${j}`;
      a.setAttribute('value', `none`);
      a.addEventListener('click', btnClick);
      a.innerText = '';
      b.appendChild(a);
    }
    gameElement.appendChild(b);
  }
  initialScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  gameActive = true;
}

function btnClick(e) {
  const cell = this.id.split('-').map((c) => parseInt(c));
  socket.emit('btnClick', { cell, player });
}

function handleGameCode(code) {
  gameCodeDisplay.innerText = code;
}

function handleInit(data) {
  data = JSON.parse(data);
  gameActive = true;
  player = data.number === 1 ? 'O' : 'X';
  enemy = data.number === 1 ? 'X' : 'O';
  gamePlayerDisplay.innerText = player;
  handleGameState(JSON.stringify(data.gameState));
}

function handleUnknownCode() {
  alert("Unkown Code(Room doesn' exist)");
}

function handleRoomFull() {
  alert('Room is full');
}

function handleGameState(gameState) {
  if (!gameActive) return;
  gameState = JSON.parse(gameState);

  const board = [...gameState.board];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const a = document.getElementById(`${i}-${j}`);
      a.innerText = cell !== '' ? cell : '';
    });
  });
}

function handleGameOver(data) {
  if (!gameActive) return;
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === player) {
    alert('You Win');
  } else if (data.winner === enemy) {
    alert('You Lose :(');
  } else if (data.winner === 'draw') {
    alert('draw');
  }
}

function handleTurn(turn) {
  gameTurnDisplay.innerText = turn;
}
