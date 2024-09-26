// Creates game board for tic-tac-toe game
function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // 2-d array where each element is a board cell object
  for (let i = 0; i < rows; ++i) {
    board[i] = [];
    for (let j = 0; j < columns; ++j) {
      board[i].push(Cell());
    }
  }

  // Gets entire board that UI needs to render it.
  const getBoard = () => board;

  // set the players position
  const setToken = (row, column, player) => {
    if (row >= 3 || column >= 3 || board[row][column].getCellValue() != 0) {
      console.log("Cannot place token here!");
      return false;
    } else {
      board[row][column].setCell(player);
    }
    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getCellValue())
    );

    console.log(boardWithCellValues);
  };

  return { getBoard, setToken, printBoard };
}

// cell objects that store the state
// of each row / column position on the
// game board
function Cell() {
  let value = 0;

  const setCell = (token) => {
    value = token;
  };

  const getCellValue = () => value;

  return { setCell, getCellValue };
}

function GameController(player1 = "player 1", player2 = "player 2") {
  const board = GameBoard();

  const players = [
    {
      name: player1,
      token: "X",
    },
    {
      name: player2,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log(`${getActivePlayer().name} turn`);
    board.printBoard();
  };

  const playerRound = (row, column) => {
    let validMove = false;

    // TODO: implement UI to get user input
    // while (!validMove) {
    //   // set position for current player
    //   console.log(
    //     `Placing ${getActivePlayer().name}'s token '${
    //       getActivePlayer().token
    //     }' at position row: ${row} column: ${column}`
    //   );

    //   validMove = board.setToken(row, column, getActivePlayer().token);
    // }

    // if valid move switch the players turn and print
    // the game board with updated move
    switchPlayerTurn();
    printNewRound();
  };

  // print initial game board
  printNewRound();

  return { getActivePlayer, playerRound };
}

const game = GameController();

game.playerRound(1, 1, "X");
