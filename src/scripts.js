/**
 * Gameboard module
 */
const gameboard = (() => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  /**
   * Returns a deep copy of the 2D board array.
   * @returns {String[][]} board
   */
  const getBoard = () => JSON.parse(JSON.stringify(board));

  /**
   * Returns true if a position is available for a marker.
   */
  const isAvailable = (row, col) => board[row][col] === '';

  /**
   * Clears the markers on the board.
   */
  const resetBoard = () => {
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  };

  /**
   * Sets a board position to the specified marker.
   * @param {String} marker
   * @param {Number} row
   * @param {Number} col
   */
  const setMarker = (marker, row, col) => {
    if (row < 0 || row > 2) {
      throw Error('Invalid row');
    } else if (col < 0 || col > 2) {
      throw Error('Invalid column');
    }

    if (isAvailable(row, col)) {
      board[row][col] = marker;
    }
  };

  const isWinningMove = (row, col) => {
    const marker = board[row][col];

    // Check columns in the row
    for (let c = 0; c < 3; c += 1) {
      if (board[row][c] !== marker) {
        break;
      } else if (c === 2) {
        return true;
      }
    }

    // Check rows in the column
    for (let r = 0; r < 3; r += 1) {
      if (board[r][col] !== marker) {
        break;
      } else if (r === 2) {
        return true;
      }
    }

    // Check the diagonal
    if (
      (board[0][0] === marker || board[0][2] === marker) &&
      board[1][1] === marker &&
      (board[2][0] === marker || board[2][2] === marker)
    ) {
      return true;
    }

    return false;
  };

  return { getBoard, resetBoard, setMarker, isAvailable, isWinningMove };
})();

/**
 * Player factory function.
 * @param {String} playerName
 * @param {String} playerMarker
 * @returns
 */
const Player = (playerName, playerMarker) => {
  const getName = () => playerName;
  const getMarker = () => playerMarker;

  return { getName, getMarker };
};

/**
 * Controller module.
 */
const controller = (() => {
  let p1 = null;
  let p2 = null;
  let p1Score = 0;
  let p2Score = 0;
  let currentPlayer = null;

  /**
   * Switches to the next player's turn and highlights their name.
   */
  const nextPlayer = () => {
    const leftName = document.querySelector('.left-turn-indicator>span');
    const rightName = document.querySelector('.right-turn-indicator>span');

    if (currentPlayer === p1) {
      leftName.classList.remove('selected');
      currentPlayer = p2;
      rightName.classList.add('selected');
    } else {
      rightName.classList.remove('selected');
      currentPlayer = p1;
      leftName.classList.add('selected');
    }
  };

  /**
   * Event handler that resets the game.
   */
  const resetGame = () => {
    gameboard.resetBoard();
    currentPlayer = null;
    nextPlayer();
    const cells = document.querySelectorAll('.cell');
    cells.forEach((c) => {
      const cell = c;
      cell.textContent = '';
    });
  };

  /**
   * Event handler that places a marker on the board.
   * @param {Event} e
   */
  const makeTurn = (e) => {
    const row = e.target.getAttribute('data-row');
    const col = e.target.getAttribute('data-col');

    if (gameboard.isAvailable(row, col)) {
      const cell = document.querySelector(
        `.cell[data-row='${row}'][data-col='${col}']`
      );
      cell.textContent = currentPlayer.getMarker();
      gameboard.setMarker(currentPlayer.getMarker(), row, col);
      if (gameboard.isWinningMove(row, col)) {
        if (currentPlayer.getMarker() === 'X') {
          p1Score += 1;
          const counter = document.querySelector('.player1-counter');
          counter.textContent = p1Score;
        } else {
          p2Score += 1;
          const counter = document.querySelector('.player2-counter');
          counter.textContent = p2Score;
        }
        resetGame();
      } else {
        nextPlayer();
      }
    }
  };

  /**
   * Adds players to the game.
   */
  const addPlayers = () => {
    const overlay = document.querySelector('.overlay');
    const gameContainer = document.querySelector('.game-container');
    const leftName = document.querySelector('.left-turn-indicator>span');
    const rightName = document.querySelector('.right-turn-indicator>span');
    const startForm = document.forms['start-form'];
    const player1 = startForm.elements['player-1-name'].value;
    const player2 = startForm.elements['player-2-name'].value;

    p1 = Player(player1, 'X');
    p2 = Player(player2, 'O');
    leftName.textContent = player1;
    rightName.textContent = player2;
    gameContainer.classList.toggle('blurred');
    overlay.classList.toggle('hidden');
    nextPlayer();
  };

  /**
   * Displays a start windows where players enter their names.
   */
  const showStartWindow = () => {
    const overlay = document.querySelector('.overlay');
    const gameContainer = document.querySelector('.game-container');
    gameContainer.classList.toggle('blurred');
    overlay.classList.toggle('hidden');
  };

  const startGame = () => {
    showStartWindow();
  };

  // Event listener for the start button
  const startButton = document.querySelector('.start-button');
  startButton.addEventListener('click', addPlayers);

  // Event listener to the reset button
  const reset = document.querySelector('.reset');
  reset.addEventListener('click', resetGame);

  // Event listener to each cell of the board
  const boardCells = [...document.querySelectorAll('.cell')];
  boardCells.forEach((cell) => {
    cell.addEventListener('click', makeTurn);
  });

  return { startGame };
})();

controller.startGame();
