function Gameboard() {
  // create 2d array to represent state of game board
  const rows = 6;
  const columns = 7;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // Gets entire board that UI needs to render it.
  const getBoard = () => board;

  // find the what lowest point of the selected column is
  // then change that cell's value to the player number
  const dropToken = (column, player) => {
    // find all the rows that don't have a token
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    // No cells made it through the filter
    // invalid move
    if (!availableCells.length) return;

    // valid cell so get the last one in filtered array
    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].addToken(player);
  };

  // print board to the console
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  // provide interface for the rest of application
  // to interact with the board
  return { getBoard, dropToken, printBoard };
}

/*
A Cell represents one square on the board and can have
one of
0: no token is in the square
1: Player One's token,
2: Player 2's token
*/

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return { addToken, getValue };
}

/*Game controller controls the flow and state of the game's turns as well
as whether anybody has won the game */
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playerRound = (column) => {
    // Drop a token for the current player
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );
    board.dropToken(column, getActivePlayer().token);

    /* This is where we would check for winner*/

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so reveal it now
  return {
    playerRound,
    getActivePlayer,
  };
}

const game = GameController();
