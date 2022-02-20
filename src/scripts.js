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

  return { getBoard, resetBoard, setMarker };
})();

const player = (playerName, playerMarker) => {
  const getName = () => playerName;
  const getMarker = () => playerMarker;

  return { getName, getMarker };
};

const controller = (() => {})();
