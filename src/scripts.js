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

  /**
   * Returns true if the specified position is a winning move (3 in a row).
   * @param {Number} row
   * @param {Number} col
   */
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
  let turns = 0;

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
      // Defaults to player 1 when currentPlayer is null
      rightName.classList.remove('selected');
      currentPlayer = p1;
      leftName.classList.add('selected');
    }
  };

  /**
   * Resets game state.
   */
  const resetGame = () => {
    const cells = document.querySelectorAll('.cell');
    const counter1 = document.querySelector('.player1-counter');
    const counter2 = document.querySelector('.player2-counter');
    const roundInfoText = document.querySelector('.round-info-text');

    currentPlayer = null;
    p1Score = 0;
    p2Score = 0;
    turns = 0;

    if (roundInfoText.textContent) {
      roundInfoText.textContent = '';
    }

    counter1.textContent = p1Score;
    counter2.textContent = p2Score;
    gameboard.resetBoard();
    cells.forEach((c) => {
      const cell = c;
      cell.textContent = '';
    });
    nextPlayer();
  };

  /**
   * Clears the board when a player wins a round or the round ends in a tie.
   */
  const nextRound = () => {
    const cells = document.querySelectorAll('.cell');

    gameboard.resetBoard();
    cells.forEach((c) => {
      const cell = c;
      cell.textContent = '';
    });
    currentPlayer = null;
    turns = 0;
    nextPlayer();
  };

  /**
   * Displays a status message after a round ends.
   */
  const showRoundInfo = (status) => {
    const roundInfoText = document.querySelector('.round-info-text');

    if (status === 0) {
      roundInfoText.textContent = 'Tie!';
    } else if (status === 1) {
      roundInfoText.textContent = `${p1.getName()} wins!`;
    } else if (status === 2) {
      roundInfoText.textContent = `${p2.getName()} wins!`;
    }
  };

  /**
   * Event handler for each board cell that places a marker on the board.
   * @param {Event} e
   */
  const makeTurn = (e) => {
    const row = e.target.getAttribute('data-row');
    const col = e.target.getAttribute('data-col');
    const roundInfoText = document.querySelector('.round-info-text');

    if (roundInfoText.textContent) {
      roundInfoText.textContent = '';
    }

    if (gameboard.isAvailable(row, col)) {
      // Places the marker
      const cell = document.querySelector(
        `.cell[data-row='${row}'][data-col='${col}']`
      );
      cell.textContent = currentPlayer.getMarker();
      gameboard.setMarker(currentPlayer.getMarker(), row, col);

      if (gameboard.isWinningMove(row, col)) {
        // A player has won
        if (currentPlayer.getMarker() === 'X') {
          p1Score += 1;
          const counter = document.querySelector('.player1-counter');
          counter.textContent = p1Score;
          showRoundInfo(1);
        } else {
          p2Score += 1;
          const counter = document.querySelector('.player2-counter');
          counter.textContent = p2Score;
          showRoundInfo(2);
        }
        nextRound();
      } else {
        turns += 1;
        if (turns === 9) {
          // Round ended in a tie
          showRoundInfo(0);
          nextRound();
        } else {
          nextPlayer();
        }
      }
    }
  };

  /**
   * Adds players to the game based on form data from the start window.
   */
  const addPlayers = () => {
    const overlay = document.querySelector('.overlay');
    const gameContainer = document.querySelector('.game-container');
    const leftName = document.querySelector('.left-turn-indicator>span');
    const rightName = document.querySelector('.right-turn-indicator>span');
    const startForm = document.forms['start-form'];
    const player1 = startForm.elements['player-1-name'].value;
    const player2 = startForm.elements['player-2-name'].value;

    if (startForm.checkValidity()) {
      p1 = Player(player1, 'X');
      p2 = Player(player2, 'O');
      leftName.textContent = player1;
      rightName.textContent = player2;
      gameContainer.classList.toggle('blurred');
      overlay.classList.toggle('hidden');
      nextPlayer();
    } else {
      startForm.reportValidity();
    }
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

  /**
   * Starts the game.
   */
  const startGame = () => {
    resetGame();
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
