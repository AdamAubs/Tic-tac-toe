// Creates game board for tic-tac-toe game
function GameBoard() {
  const rows = 3;
  const columns = 3;
  let board = initializeBoard();

  // Initialize board to starting state
  function initializeBoard() {
    const newBoard = [];
    // 2-d array where each element is a board cell object
    for (let i = 0; i < rows; ++i) {
      newBoard[i] = [];
      for (let j = 0; j < columns; ++j) {
        newBoard[i].push(Cell());
      }
    }
    return newBoard;
  }

  // Resets the board back to its starting state
  const resetBoard = () => {
    board = initializeBoard();
    console.log("Board has been reset.");
  };

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

  return { getBoard, setToken, printBoard, resetBoard };
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
    let validMove = board.setToken(row, column, getActivePlayer().token);

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
    if (validMove) {
      // check for winner
      if (checkWinner(row, column)) {
        printWinner();
        return; // End the game after a win
      }

      // other wise switch the players turn and print
      // the game board with updated move
      switchPlayerTurn();
      printNewRound();
    }
  };

  const checkWinner = (row, column) => {
    const boardState = board.getBoard();

    let rowWin = true;
    for (let j = 0; j < 3; ++j) {
      if (boardState[row][j].getCellValue() !== getActivePlayer().token) {
        rowWin = false;
        break;
      }
    }
    if (rowWin) return true;

    let columnWin = true;
    for (let i = 0; i < 3; ++i) {
      if (boardState[i][column].getCellValue() !== getActivePlayer().token) {
        columnWin = false;
        break;
      }
    }
    if (columnWin) return true;

    let diagWin1 = true; // (top-left to bottom-right)
    if (row === column) {
      // only check if move is on the main diagonal (1,1 | 2,2 | 3,3)
      for (let i = 0; i < 3; ++i) {
        if (boardState[i][i].getCellValue() !== getActivePlayer().token) {
          diagWin1 = false;
          break;
        }
      }
    } else {
      diagWin1 = false;
    }
    if (diagWin1) return true;

    let diagWin2 = true; // (top-right to bottom-left)
    if (row + column === 2) {
      // only check if move is on the other diagonal (0,2 | 1,1 | 2,0)
      for (let i = 0; i < 3; ++i) {
        if (boardState[i][2 - i].getCellValue() !== getActivePlayer().token) {
          diagWin2 = false;
          break;
        }
      }
    } else {
      diagWin2 = false;
    }
    if (diagWin2) return true;

    return false;
  };

  const printWinner = () => {
    console.log(`The winner is ${getActivePlayer().name}`);
    board.printBoard();
    gameReset();
  };

  const gameReset = () => {
    board.resetBoard();
    activePlayer = players[0];
    console.log("The game has been reset.");
    printNewRound();
  };

  // print initial game board
  printNewRound();

  return { getActivePlayer, playerRound, gameReset };
}

const game = GameController();

// Example player moves
game.playerRound(1, 1); // X
game.playerRound(0, 2); // O
game.playerRound(2, 2); // X
game.playerRound(1, 0); // O
game.playerRound(0, 0); // X
game.playerRound(1, 2); // O
game.playerRound(2, 0); // X
game.playerRound(0, 1); // O
