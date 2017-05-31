"use strict";

/**
 * A minesweeper board class
 *
 * @param height the height of the board in tiles 
 * @param width the width of the board in tiles
 * @param numMines the number of mines to be placed on the board
 */
let Board = function (height, width, numMines) {
  this.tiles = [];
  this.height = height;
  this.width = width;
  this.numMines = numMines;
  
  // Create a 2d array of Tiles
  for (let i = 0; i < this.height; i++) {
    this.tiles.push(new Array());
    for (let j = 0; j < this.width; j++) {
      this.tiles[i].push(new Tile(i, j));
    }
  }
  
  // Validate proposed mine quantity
  if (this.numMines >= this.height * this.width ||
      this.numMines < 1) {
    throw "Invalid number of mines specified";
  } 

  // Add mines randomly
  for (let i = 0; i < this.numMines;) {
    let rh = rand(0, this.height);
    let rw = rand(0, this.width);
    if (!this.tiles[rh][rw].mined) {
      this.tiles[rh][rw].mined = true;
      i++;
    }
  }
  
  // Set neighbors for each tile
  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {
      this.setNeighbors(this.tiles[i][j]);
    }
  }
  
  // Set the count of neighboring mines for each tile
  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {
      this.tiles[i][j].setMineCount();
    }
  }
}; // end Board class
  
/** 
 * Sets neighbors for each tile in the board
 *
 * @param tile the tile to set neighboring tiles for
 */
Board.prototype.setNeighbors = function (tile) {
  let dirs = [[-1, -1], [-1, 1], [1, -1], [-1, 0], 
              [ 0, -1], [ 0, 1], [1,  0], [ 1, 1]];

  for (let i = 0; i < dirs.length; i++) {
    if (tile.x + dirs[i][0] >= 0 && 
        tile.y + dirs[i][1] >= 0 &&
        tile.x + dirs[i][0] < this.height && 
        tile.y + dirs[i][1] < this.width) {
      tile.neighbors.push(
        this.tiles[tile.x + dirs[i][0]][tile.y + dirs[i][1]]);
    }
  }
}; // end setNeighbors
  
/**
 * Cycles a tile between flagged, question-marked, or unmarked
 *
 * @param x the x coordinate of the tile 
 * @param y the y coordinate of the tile
 */
Board.prototype.flag = function (x, y) {  
  if (!this.tiles[x][y].flagged && 
      !this.tiles[x][y].question) {
    this.tiles[x][y].flagged = true;
  }
  else if (this.tiles[x][y].flagged) {
    this.tiles[x][y].flagged = false;
    this.tiles[x][y].question = true;
  }
  else if (this.tiles[x][y].question) {
    this.tiles[x][y].question = false;
  }
}; // end flag 
  
/**
 * Marks a tile (and its neighbors) as revealed
 *
 * @param x the x coordinate of the tile 
 * @param y the y coordinate of the tile
 */
Board.prototype.reveal = function (x, y) {  
  if (!this.tiles[x][y].mined) {
    this.tiles[x][y].reveal();
  }
}; // end reveal 

/**
 * Returns whether a tile is mined
 *
 * @param x the x coordinate of the tile
 * @param y the y coordinate of the tile
 * @return true if the tile is mined, false otherwise
 */
Board.prototype.isMined = function (x, y) {  
  return this.tiles[x][y].mined;
}; // end isMined
 
/** 
 * Determines if current board state is won
 *
 * @return true if the board is won, false otherwise
*/
Board.prototype.isWon = function () {
  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {
      if (!this.tiles[i][j].mined && 
          !this.tiles[i][j].revealed) {
        return false;
      }
    }
  }
  return true;
}; // end isWon
