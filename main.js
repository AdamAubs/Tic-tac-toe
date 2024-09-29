function GameBoard() {
  const rows = 3;
  const columns = 3;

  let board = initializeBoard();

  function initializeBoard() {
    const newBoard = [];

    for (let i = 0; i < rows; ++i) {
      newBoard[i] = [];
      for (let j = 0; j < columns; ++j) {
        newBoard[i].push(Cell());
      }
    }

    return newBoard;
  }

  const resetBoard = () => {
    console.log("Resetting board...");
    board = initializeBoard();
    console.log("Board reset");
  };

  const getBoard = () => board;

  const playRound = (row, column, player) => {
    if (
      row >= rows ||
      column >= columns ||
      row < 0 ||
      column < 0 ||
      board[row][column].getCellValue() !== 0
    ) {
      console.log("Cannot place token here!");
      return false;
    } else {
      board[row][column].setCellValue(player);
    }
    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getCellValue())
    );

    console.log(boardWithCellValues);
  };

  return { playRound, printBoard, getBoard, resetBoard };
}

function Cell() {
  let value = 0;

  const setCellValue = (token) => {
    value = token;
  };

  const getCellValue = () => value;

  return { setCellValue, getCellValue };
}

function GameController(player1 = "player1", player2 = "player2") {
  const board = GameBoard();

  let isGameOver = false;

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
    console.log("Switching players...");
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log(`${getActivePlayer().name} turn`);
  };
  const getActivePlayer = () => activePlayer;

  const playerRound = (row, column) => {
    if (isGameOver) {
      console.log("The game is over! Start a new game to play again!");
      return; // Prevent further moves
    }

    let validMove = board.playRound(row, column, getActivePlayer().token);

    if (validMove) {
      if (isWinner(row, column)) {
        printNewRound();
        printWinner();
        isGameOver = true;
        return;
      }

      if (isTie()) {
        printNewRound();
        printTie();
        isGameOver = true;
        return;
      }

      printNewRound();
      switchPlayerTurn();
    }
  };

  const isTie = () => {
    const boardState = board.getBoard();

    // check if all cells are filled and no winner exists
    const isFullBoard = boardState.every((row) =>
      row.every((cell) => cell.getCellValue() !== 0)
    );
    // true if full otherwise false
    return isFullBoard;
  };

  const printNewRound = () => {
    console.log("printing round...");

    board.printBoard();
  };

  const printWinner = () => {
    console.log(
      `${getActivePlayer().token}'s wins! congratulations ${
        getActivePlayer().name
      }! `
    );
  };

  const printTie = () => {
    console.log("It's a scratch! Nobody wins!");
  };

  const isWinner = (row, column) => {
    const boardState = board.getBoard();

    let rowWin = true;
    for (let j = 0; j < 3; ++j) {
      if (boardState[row][j].getCellValue() !== getActivePlayer().token) {
        rowWin = false;
        break;
      }
    }
    if (rowWin) return rowWin;

    let columnWin = true;
    for (let i = 0; i < 3; ++i) {
      if (boardState[i][column].getCellValue() !== getActivePlayer().token) {
        columnWin = false;
        break;
      }
    }
    if (columnWin) return columnWin;

    // check top-left to bottom-right diagonal
    let diagWin1 = true;
    if (row === column) {
      // row always is the same as column
      for (let i = 0; i < 3; ++i) {
        if (boardState[i][i].getCellValue() !== getActivePlayer().token) {
          diagWin1 = false;
          break;
        }
      }
    } else {
      diagWin1 = false;
    }
    if (diagWin1) return diagWin1;

    // check top-right to bottom-left diagonal
    let diagWin2 = true;
    if (row + column === 2) {
      // row + column will always be 2
      for (let i = 0; i < 3; ++i) {
        if (boardState[i][2 - i].getCellValue() !== getActivePlayer().token) {
          diagWin2 = false;
          break;
        }
      }
    } else {
      diagWin2 = false;
    }
    if (diagWin2) return diagWin2;
  };

  const gameReset = () => {
    console.log("resetting board...");
    activePlayer = players[0];
    isGameOver = false;
    board.resetBoard();
    printNewRound();
  };

  // print the initial game board
  printNewRound();

  return { getActivePlayer, playerRound, gameReset, getBoard: board.getBoard };
}

function screenController() {
  const game = GameController();
  const playerTurnH2 = document.querySelector(".turn");
  const playerTokenH3 = document.querySelector(".token");
  const boardDiv = document.querySelector(".board");
  const resetBtn = document.getElementById("reset-btn");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    //get the newest version of board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display the player's turn
    playerTurnH2.textContent = `${activePlayer.name}`;
    // Display the player's token
    playerTokenH3.textContent = `${activePlayer.token}`;

    // Render the board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // create a clickable button for each cell
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column and row.
        // This makes it easier to pass into our 'playRound' function
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getCellValue();

        // disable the button if it already has a value
        if (cell.getCellValue() !== 0) {
          cellButton.disabled = true;
        }

        // Add the button to the board
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  const clickHandleBoard = (e) => {
    // check if a cell button was clicked
    if (e.target.matches(".cell")) {
      const row = e.target.dataset.row;
      const column = e.target.dataset.column;

      // play the round at the clicked cell position
      game.playerRound(parseInt(row), parseInt(column));

      // update the screen after the move
      updateScreen();
    }
  };

  // Attach event listener to the board div
  boardDiv.addEventListener("click", clickHandleBoard);

  // Reset the game board
  resetBtn.addEventListener("click", () => {
    game.gameReset();
    updateScreen();
  });

  // render the initial state of the game
  updateScreen();
}

screenController();

// tie game
// game.playerRound(0, 0); // X
// game.playerRound(0, 1); // O
// game.playerRound(0, 2); // X
// game.playerRound(1, 1); // O
// game.playerRound(1, 0); // X
// game.playerRound(1, 2); // O
// game.playerRound(2, 1); // X
// game.playerRound(2, 0); // O
// game.playerRound(2, 2); // X

// game.playerRound(1, 1); // X
// game.playerRound(0, 2); // O
// game.playerRound(2, 2); // X
// game.playerRound(1, 0); // O
// game.playerRound(0, 0); // X
