// see https://awesomeopensource.com/project/prettymuchbryce/easystarjs
const easystarjs = require('./easystar');
const instance = require('./instance');
const node = require('./node');
var easystar = new easystarjs.js();

// sample grid

const grid = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0]];

easystar.setGrid(grid);
easystar.setAcceptableTiles([0]);
easystar.calculate();
easystar.findPath(0, 0, 4, 0, function (path) {
  console.log('path = ', path);
  if (path === null) {
    console.log("Path was not found.");
  } else {
    console.log("Path was found. The first Point is " + path[0].x + " " + path[0].y);

  }
});