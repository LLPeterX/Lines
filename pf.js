/* 
 реализация на основе https://medium.com/@jgisin/javascript-pathfinding-1e351b1bb12b

 В функцию pathFinder() передаются аргументы:
 - grid: массив [N][N]. Пустые элементы = 0, занятые - 1
 - (startY, startX) - начальная точка
 - (endY, endX) - цель
 Возращаемое значение:
  - path[] с массивом координат, или
  - null - пути нет
*/

// объект для очереди
let queue = {
  data: [],
  enqueue: function (arg) {
    queue.data.push(arg);
  },
  dequeue: function () {
    queue.data.shift();
  },
  peek: function () {
    return queue[0];
  }
};

const search = {
  bfs: function (startPoint, endPoint, grid) {
    queue.enqueue(startPoint);
    currentPos = startPoint;
    depth = 0;
    let children;
    while (queue.data.length > 0) {
      children = search.validMoves(currentPos, grid);
      for (var i = 0; i < children.length; i++) {
        if (JSON.stringify(children[i]) === JSON.stringify(endPoint)) {
          return currentPos[2] + 1;
        }
        else {
          if (search.include(children[i]) === false) {
            var qDat = children[i].push(currentPos[2] + 1);
            queue.enqueue(children[i]);
          }
        }
      }
      currentPos = queue.data[0];
      queue.dequeue();
    }
  },
  include: function (test) {
    bool = false;
    queue.data.forEach(function (dat) {
      if (test === dat) {
        bool = true;
      }
    });
    return bool;
  },
  validMoves: function (coord, grid) {
    var first = coord[0];
    var second = coord[1];
    finalArr = [];
    if (first < 3 && grid[first + 1][second] !== "BLK") {
      finalArr.push([first + 1, second]);
    }
    if (second < 3 && grid[first][second + 1] !== "BLK") {
      finalArr.push([first, second + 1]);
    }
    if (first > 0 && grid[first - 1][second] !== "BLK") {
      finalArr.push([first - 1, second]);
    }
    if (second > 0 && grid[first][second - 1] !== "BLK") {
      finalArr.push([first, second - 1]);
    }

    return finalArr;
  }
}


function findPath(game, startY, startX, endY, endX) {
  if (startY === endY && startX === endX) {
    return null;
  }
  // трансформируем game => grid
  let grid = [game.length];
  for (let y = 0; y < game.length; y++) {
    grid[y] = [];
    for (let x = 0; x < game[0].length; x++) {
      if (game[y][x]) {
        grid[y].push('BLK');
      } else {
        grid[y].push([y, x]);
      }
    }
  }
  // поиск пути из
  let startPoint = [startX, startY],
    endPoint = [endX, endY];
  let path = search.bfs(startPoint, endPoint, grid);
  console.log(path);
}