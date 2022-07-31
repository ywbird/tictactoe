module.exports = {
  initGame,
  gameStep,
};

function initGame() {
  return {
    player: 'O',
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    players: {
      O: {
        columns: Array(3).fill(0),
        diagonal: Array(3).fill(0),
        inverseDiagonal: Array(3).fill(0),
        rows: Array(3).fill(0),
      },
      X: {
        columns: Array(3).fill(0),
        diagonal: Array(3).fill(0),
        inverseDiagonal: Array(3).fill(0),
        rows: Array(3).fill(0),
      },
    },
  };
}

function setPlayer(state) {
  return state.player == 'O' ? 'X' : 'O';
}

function gameStep(state, cell) {
  const board = state.board;

  if (board[cell[0]][cell[1]] !== '') return;

  board[cell[0]][cell[1]] = state.player;

  const newContainers = { ...state.players };
  newContainers[state.player].rows[cell[0]] += 1;
  newContainers[state.player].columns[cell[1]] += 1;

  if (cell[0] === cell[1]) {
    newContainers[state.player].diagonal[cell[0]] += 1;
  }
  if (cell[0] + cell[1] === 2) {
    newContainers[state.player].diagonal[cell[0]] += 1;
  }

  state.players = newContainers;

  if (checkDraw(state) && !checkWinner(state)) {
    return 'draw';
  }

  const winner = checkWinner(state);

  state.player = setPlayer(state);

  return winner;
}

function checkDraw(state) {
  return state.board.every((row) => row.every((cell) => cell !== ''));
}

function checkWinner(state) {
  const currentPlayerContainers = state.players[state.player];

  if (currentPlayerContainers.rows.some((value) => value === 3)) {
    return state.player;
  }
  if (currentPlayerContainers.columns.some((value) => value === 3)) {
    return state.player;
  }
  if (currentPlayerContainers.diagonal.every((value) => value === 1)) {
    return state.player;
  }
  if (currentPlayerContainers.inverseDiagonal.every((value) => value === 1)) {
    return state.player;
  }

  return false;
}
