"use strict";

/* TODO:
 * add variants
 * refactor board into 1-d array
 * add numMoves
 * optimize board creation speed for large boards http://stackoverflow.com/questions/714942/how-to-stop-intense-javascript-loop-from-freezing-the-browser
 *
 * Resources:
 * http://www.chiark.greenend.org.uk/~sgtatham/puzzles/
 * https://en.wikipedia.org/wiki/Board_puzzles_with_algebra_of_binary_variables
 * https://en.wikipedia.org/wiki/Minesweeper_(video_game)
 */

// Global variables
let board;
let clockInterval;
let duration;
let gameOver;


// Starts a new game
function newGame() {

  // Collect user's specified board parameters
  let boardHeight = parseInt(document.forms['sizeinput'].elements['h'].value); 
  let boardWidth = parseInt(document.forms['sizeinput'].elements['w'].value); 
  let numMines = parseInt(document.forms['sizeinput'].elements['n'].value);
  
  // Revert to default parameters if necessary
  if (isNaN(boardHeight) || boardHeight < 4 || boardHeight > 150) {
    boardHeight = 8;
    document.forms['sizeinput'].elements['h'].value = boardHeight; 
  }
  if (isNaN(boardWidth) || boardWidth < 4 || boardWidth > 150) {
    boardWidth = 8;
    document.forms['sizeinput'].elements['w'].value = boardWidth;
  }
  if (isNaN(numMines) || numMines >= boardHeight * boardWidth) {
    numMines = 10;
    document.forms['sizeinput'].elements['n'].value = numMines; 
  }
  
  // Reset variables and create a board
  gameOver = false;
  board = new Board(boardHeight, boardWidth, numMines);
  addScore();
  print();
  startClock();

  // Disable right clicks on tds
  $("td").on("contextmenu", function () {
    return false;
  });
  
  // Handle left and right mouse clicks on grid
  $(".mstile").mousedown(function (e) {
    let coordinates = $(this).attr("id").split("-");
    let x = coordinates[0];
    let y = coordinates[1];    

    if (gameOver) {
      newGame();
      return;
    }
    else if (e.button == 0) {
      if (board.isMined(x, y)) gameOver = true;
      else reveal(board.tiles[x][y]);
    }
    else if (e.button == 2) {
      board.flag(x, y);
    }
      
    document.getElementById(x + "-" + y).innerHTML = 
      getImg(board.tiles[x][y]);
  
    // Handle win
    if (board.isWon()) {
      gameOver = true;
      if (localStorage) {
        let storage = parseInt(localStorage[board.height +
                      " " + board.width + " " + board.numMines]);
                  
        if (isNaN(storage) || duration < storage) {            
          localStorage[board.height + " " + board.width + 
                       " " + board.numMines] = duration;
        }
      }
    }
  
    if (gameOver) {
      showMines();
      stopClock();
    }
  });
} // end newGame


// Starts game clock
function startClock() {
  stopClock();
  duration = 0;
  showClock();
  clockInterval = setInterval(function () {
    duration++;
    showClock();
  }, 1000);
} // end startClock


// Stops the game clock
function stopClock() {
  clearInterval(clockInterval);
} // end stopClock


// Sends the current clock to the DOM
function showClock() {
  document.getElementById("clock").innerHTML = 
    Math.floor(duration / 3600) + "h : " + 
    Math.floor(duration % 3600 / 60) + "m : " + 
    Math.floor(duration % 60) + "s";
} // end showClock
  

// Displays mine locations once the game ends
function showMines() {
  for (let i = 0; i < board.height; i++) {
    for (let j = 0; j < board.width; j++) {
      if (board.tiles[i][j].mined) {
        document.getElementById(i + "-" + j).innerHTML = 
          getImg(board.tiles[i][j], true);
      }
    }
  }
} // end showMines 


// Provides an HTML image associated with a tile
function getImg(tile, getMined) {
  if (tile.revealed) {
    if (!tile.mineCount) return "<img src='assets/revealed.png'></img>";
    else return "<img src='assets/" + tile.mineCount + ".png'></img>";
  }
  if (getMined) return "<img src='assets/mine.png'></img>";
  if (tile.flagged) return "<img src='assets/flag.png'></img>";
  if (tile.question) return "<img src='assets/question.png'></img>";
  else return "<img src='assets/hidden.png'></img>";
} // end getImg


// Adds scoreboard for current board from local storage
function addScore() {
  let bestScore;
  if (localStorage) {
    bestScore = parseInt(localStorage[board.height + " " + 
                board.width + " " + board.numMines]);
  }
  if (!bestScore) bestScore = 0;
  document.getElementById("score").innerHTML = "Quickest -> " +
    Math.floor(bestScore / 3600) + "h : " + 
    Math.floor(bestScore % 3600 / 60) + "m : " + 
    Math.floor(bestScore % 60) + "s";
} // end addScore


// Sends the board to DOM
function print() {
  let s = "<table id='mscontainer'>";
  for (let i = 0; i < board.height; i++) {
    s += "<tr>";
    for (let j = 0; j < board.width; j++) {
      s += "<td class='mstile' id='" + i + "-" + j + "'>" + 
        getImg(board.tiles[i][j]) + "</td>";
    }
    s += "</tr>";
  }
  s += "</table>";
  document.getElementById("mscontainer").innerHTML = s;
} // end print
  

// Recursively reveals tiles given a starting point
function reveal(tile) {
  if (!tile.mined && !tile.flagged && !tile.revealed) {
    tile.revealed = true;
    document.getElementById(tile.x + "-" + tile.y)
            .innerHTML = getImg(tile);

    if (!tile.mineCount) {
      for (let i = 0; i < tile.neighbors.length; i++) {
        reveal(tile.neighbors[i]);
      }
    }
  }
} // end reveal
  

$(document).ready(function () {
  
  // Disable page refresh on form submit
  $(function () {
    $("form").submit(function () { return false; });
  });

  // Begin the first game on script load
  newGame();
});
