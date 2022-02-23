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
    board = board.fill(['', '', '']);
  };

  /**
   * Sets a board position to the specified marker.
   * @param {String} marker
   * @param {Number} row
   * @param {Number} col
   */
  const setMarker = (marker, row, col) => {
    const markerUpper = marker.toUpperCase();

    if (markerUpper !== 'X' && markerUpper !== 'O') {
      throw Error('Invalid marker');
    } else if (row < 0 || row > 2) {
      throw Error('Invalid row');
    } else if (col < 0 || col > 2) {
      throw Error('Invalid column');
    }

    board[row][col] = markerUpper;
  };

  return { getBoard, resetBoard, setMarker, isAvailable };
})();

/**
 * Player factory function
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
 * Controller module
 */
const controller = (() => {
  let player1 = null;
  let player2 = null;
  let currentPlayer = null;

  // Used for highlighting player names on their turn
  const leftName = document.querySelector('.left-turn-indicator>span');
  const rightName = document.querySelector('.right-turn-indicator>span');

  /**
   * Places a marker on the board.
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

      if (currentPlayer === player1) {
        leftName.classList.toggle('selected');
        currentPlayer = player2;
        rightName.classList.toggle('selected');
      } else {
        rightName.classList.toggle('selected');
        currentPlayer = player1;
        leftName.classList.toggle('selected');
      }
    }
  };

  // Adds an event listener to each cell of the board
  const boardCells = [...document.querySelectorAll('.cell')];
  boardCells.forEach((cell) => {
    cell.addEventListener('click', makeTurn);
  });

  const addPlayers = () => {
    player1 = Player('Player 1', 'X');
    leftName.textContent = player1.getName();
    player2 = Player('Player 2', 'O');
    rightName.textContent = player2.getName();
    currentPlayer = player1;
    leftName.classList.toggle('selected');
  };

  const startGame = () => {
    addPlayers();
  };

  return { startGame };
})();

controller.startGame();
