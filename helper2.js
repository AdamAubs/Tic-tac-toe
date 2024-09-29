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
    let moveCount = 0;
  
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
        moveCount++;
        // check for winner
        if (checkWinner(row, column)) {
          printWinner();
          return; // End the game after a win
        }
  
        if (moveCount === 9) {
          printTie();
          return; // End the game after a tie
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
  
    const printTie = () => {
      console.log("It's a tie!");
      board.printBoard();
      console.log("resetting game...");
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
  
    return { getActivePlayer, playerRound, gameReset, getBoard: board.getBoard };
  }
  
  function screenController() {
    const game = GameController();
    const playerTurnH1 = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display the player's turn
      playerTurnH1.textContent = `${activePlayer.name}'s turn... (${activePlayer.token})`;
  
      // Render board squares
      board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          // Create a clickable button for each cell
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column and row.
          // This makes it easier to pass into our `playRound`
          // function
          cellButton.dataset.row = rowIndex;
          cellButton.dataset.column = colIndex;
          cellButton.textContent = cell.getCellValue();
  
          // Disable the button if it already has a value
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
  
        // Update the screen after the move;
        updateScreen();
      }
    };
  
    // Attach event listener to the board div
    boardDiv.addEventListener("click", clickHandleBoard);
  
    // Render the initial state of the game
    updateScreen();
  }
  
  // start the game
  screenController();
  
  // const game = GameController();
  
  // Example player moves
  // game.playerRound(1, 1); // X
  // game.playerRound(0, 2); // O
  // game.playerRound(2, 2); // X
  // game.playerRound(1, 0); // O
  // game.playerRound(0, 0); // X
  // game.playerRound(1, 2); // O
  // game.playerRound(2, 0); // X
  // game.playerRound(0, 1); // O
  // screenController();
  
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
  