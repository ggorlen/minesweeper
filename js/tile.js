"use strict";

/**
 * A tile in a minesweeper grid 
 *
 * @param x the integer x coordinate of the Tile
 * @param y the integer y coordinate of the Tile
 */
let Tile = function (x, y) {
  this.flagged = false;
  this.mined = false;
  this.revealed = false;
  this.question = false;
  this.x = x;
  this.y = y;
  this.neighbors = [];
  this.mineCount;
}; // end Tile class
 
/** 
 * Sets the count of mines adjacent to this tile
 */
Tile.prototype.setMineCount = function () {
  this.mineCount = 0;
  for (let i = 0; i < this.neighbors.length; i++) {
    if (this.neighbors[i].mined) this.mineCount++;
  }
}; // end countMines
