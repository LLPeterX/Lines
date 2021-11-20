/* 
поиск кратчайшего маршрута - поиск в ширину
 */


function getPath(game, startY, startX, endY, endX) {
  const grid = JSON.parse(JSON.stringify(game)); // копия матрицы game, т.к. мы в ней будем изменять значения
  const queue = [{ x: startX, y: startY, value: 1 }];
  const SIZE = grid.length;
  grid[startY][startX] = 1;
  while (queue.length > 0) {
    let { x, y, value } = queue.shift();
    if (x === endX && y === endY) {
      // если достигли конца, то строим обратный путь
      let path = [{ x, y }];
      while (value > 1) {
        if (x > 0 && grid[y][x - 1] === value - 1) {
          value--;
          path.push({ x: --x, y });
        } else if (x + 1 < SIZE && grid[y][x + 1] === value - 1) {
          value--;
          path.push({ x: ++x, y });
        } else if (y > 0 && grid[y - 1][x] === value - 1) {
          value--;
          path.push({ x, y: --y });
        } else if (y + 1 < SIZE && grid[y + 1][x] === value - 1) {
          value--;
          path.push({ x, y: ++y });
        }
      }
      return path.reverse();
    }
    // добавляем соседей
    // left
    if (x - 1 >= 0 && grid[y][x - 1] === 0) {
      queue.push({ x: x - 1, y, value: value + 1 });
      grid[y][x - 1] = value + 1;
    }
    // right
    if (x + 1 < grid.length && grid[y][x + 1] === 0) {
      queue.push({ x: x + 1, y, value: value + 1 });
      grid[y][x + 1] = value + 1;
    }
    // top
    if (y - 1 >= 0 && grid[y - 1][x] === 0) {
      queue.push({ x: x, y: y - 1, value: value + 1 });
      grid[y - 1][x] = value + 1;
    }
    // bottom
    if (y + 1 < grid.length && grid[y + 1][x] === 0) {
      queue.push({ x: x, y: y + 1, value: value + 1 });
      grid[y + 1][x] = value + 1;
    }

  }
  return null;
}
/*
function showGrid(grid) {
  let out = "";
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x] < 0) {
        out += 'X ';
      } else if (grid[y][x] === 0) {
        out += "_ ";
      } else {
        out += String(grid[y][x]) + " ";
      }
    }
    out += "\n";
  }
  return out;
}


// debugging

let grid = [
  [0, 0, 0, 0],
  [0, -1, -1, -1],
  [0, -1, 0, 0],
  [0, 0, 0, 0]
];

showGrid(grid);
console.log('result=', getPath(grid, 0, 0, 2, 2));

 */
