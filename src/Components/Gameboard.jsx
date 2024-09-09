import { useState, useEffect, useRef, useCallback } from "react";
import ResultModal from "./ResultModal";
import MobileSwiper from "./MobileSwiper";

function Gameboard() {
  const [gameBoard, setGameBoard] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const dialog = useRef();

  if (gameOver || win) {
    dialog.current.open();
  }

  useEffect(() => {
    const size = gameBoard.length;
    var state = true;
    var win = false;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (gameBoard[row][col] === 0) {
          state = false;
        }
        if (gameBoard[row][col] === 2048) {
          win = true;
        }
      }
    }
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size - 1; col++) {
        if (gameBoard[row][col] === gameBoard[row][col + 1]) {
          state = false;
        }
      }
    }
    for (let row = 0; row < size - 1; row++) {
      for (let col = 0; col < size; col++) {
        if (gameBoard[row][col] === gameBoard[row + 1][col]) {
          state = false;
        }
      }
    }
    setGameOver(state);
    setWin(win);
  }, [gameBoard]);

  function addNewValue(board) {
    var newBoard = [...board];
    var row = Math.floor(Math.random() * 4);
    var col = Math.floor(Math.random() * 4);
    var newValue = randomValue();
    while (newBoard[row][col] !== 0) {
      row = Math.floor(Math.random() * 4);
      col = Math.floor(Math.random() * 4);
    }
    newBoard[row][col] = newValue;
    return newBoard;
  }

  function randomValue() {
    const valueArray = [2, 2, 2, 4];
    var index = Math.floor(Math.random() * 4);
    var value = valueArray[index];
    return value;
  }

  function equalsCheck(oldBoard, newBoard) {
    for (var i = 0; i < oldBoard.length; i++) {
      for (var j = 0; j < oldBoard.length; j++) {
        if (oldBoard[i][j] !== newBoard[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  function transpose(board) {
    return board[0].map((col, i) => board.map((row) => row[i]));
  }

  function move(row) {
    var counter = 0;
    row = row.filter((x) => x !== 0);
    var length = row.length - 1;
    while (counter < length) {
      if (row[counter] === row[counter + 1]) {
        row[counter] += row[counter];
        setScore(score + row[counter]);
        row.splice(counter + 1, 1);
        length--;
      }
      counter++;
    }
    row = Array.from({ ...row, length: 4 }, (v, i) => v ?? 0);
    return row;
  }

  function moveLeft() {
    var board = [...gameBoard];
    var newBoard = board.map((row) => move(row));
    if (!equalsCheck(board, newBoard)) {
      newBoard = addNewValue(newBoard);
    }
    setGameBoard(newBoard);
  }

  function moveRight() {
    var board = [...gameBoard];
    var newBoard = board.map((row) => move(row.reverse()).reverse());
    if (!equalsCheck(board, newBoard)) {
      newBoard = addNewValue(newBoard);
    }
    setGameBoard(newBoard);
  }

  function moveUp() {
    var board = [...gameBoard];
    var transposedBoard = transpose(board);
    var movedNumbers = transposedBoard.map((row) => move(row));
    var transposedNumbers = transpose(movedNumbers);
    if (!equalsCheck(board, transposedNumbers)) {
      transposedNumbers = addNewValue(transposedNumbers);
    }
    setGameBoard(transposedNumbers);
  }

  function moveDown() {
    var board = [...gameBoard];
    var transposedBoard = transpose(board);
    var movedNumbers = transposedBoard.map((row) =>
      move(row.reverse()).reverse()
    );
    var transposedNumbers = transpose(movedNumbers);
    if (!equalsCheck(board, transposedNumbers)) {
      transposedNumbers = addNewValue(transposedNumbers);
    }
    setGameBoard(transposedNumbers);
  }

  function swipeDirection(dir) {
    switch (dir) {
      case "left":
        moveLeft();
        break;
      case "right":
        moveRight();
        break;
      case "up":
        moveUp();
        break;
      case "down":
        moveDown();
        break;
    }
  }

  const handleSwipe = useCallback(
    ({ deltaX, deltaY }) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          swipeDirection("right");
        } else {
          swipeDirection("left");
        }
      } else {
        if (deltaY > 0) {
          swipeDirection("down");
        } else {
          swipeDirection("up");
        }
      }
    },
    [swipeDirection]
  );

  function newGame() {
    setScore(0);
    setWin(false);
    setGameOver(false);
    var board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    addNewValue(addNewValue(board));
    setGameBoard(board);
  }

  function tileColor(value) {
    if (value === 0) {
      return "tile";
    }
    return "tile n" + value;
  }

  return (
    <>
      <ResultModal
        ref={dialog}
        newGame={newGame}
        score={score}
        gameOver={gameOver}
        win={win}
      />
      <div className="game-area">
        <div className="score">
          <p>Score: {score}</p>
        </div>
        <MobileSwiper onSwipe={handleSwipe}>
          <div className="gameboard">
            {gameBoard
              ? gameBoard.map((row, i) =>
                  row.map((value, j) => (
                    <div
                      key={"" + i + j}
                      className={`
                    ${tileColor(value)}
                `}
                    >
                      {value}
                    </div>
                  ))
                )
              : null}
          </div>
        </MobileSwiper>
        <div className="button-bar">
          <div className="move-buttons">
            <button disabled={gameOver} onClick={moveLeft}>
              Move Left
            </button>
            <button disabled={gameOver} onClick={moveRight}>
              Move Right
            </button>
            <button disabled={gameOver} onClick={moveUp}>
              Move Up
            </button>
            <button disabled={gameOver} onClick={moveDown}>
              Move Down
            </button>
          </div>
          <button className="new" onClick={newGame}>
            New Game
          </button>
        </div>
      </div>
    </>
  );
}

export default Gameboard;
