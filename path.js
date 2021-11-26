/* 
поиск кратчайшего маршрута - поиск в ширину
*** НЕ РАБОТАЕТ ***
 */


function getPath(game, startY, startX, endY, endX) {
  console.log("start game:");
  showGrid(game);
  const grid = JSON.parse(JSON.stringify(game)); // копия матрицы game, т.к. мы в ней будем изменять значения
  console.log("start grid:");
  showGrid(grid);
  const queue = [{ x: startX, y: startY, value: 1 }];
  const SIZE = grid.length;
  const MAX_ATTEMPTS = 1000; // макс. кол-во итераций
  grid[startY][startX] = 1;
  let attempt = 0;
  while (queue.length > 0 && attempt++ < MAX_ATTEMPTS) {
    let { x, y, value } = queue.shift();
    if (x === endX && y === endY) {
      showGrid(grid);
      // если достигли конца, то строим обратный путь
      let path = [{ x, y }];
      //debugger;
      while (value > 1) {
        if (x > 0 && grid[y][x - 1] === value - 1) { // left?
          path.push({ x: x - 1, y });
          --value; --x;
        } else if (x + 1 < SIZE && grid[y][x + 1] === value - 1) { // right?
          path.push({ x: x + 1, y });
          --value; ++x;
        } else if (y > 0 && grid[y - 1][x] === value - 1) {
          path.push({ x, y: y - 1 });
          --value; --y;
        } else if (y + 1 < SIZE && grid[y + 1][x] === value - 1) {
          path.push({ x, y: y + 1 });
          --value; ++y;
        } else {
          path = null;
          break; // случилась какая-то фигня - нет обратного маршрута
        }
      }
      return path;
    }
    // продолжаем заполнять
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
    //grid[y][x] = -1; // mark visited

  }
  return null;
}

function showGrid(grid) {
  let out = "  ";
  for (let i = 0; i < grid.length; i++) {
    out += String(i).padEnd(2);
  }
  out += "\n  " + '-'.repeat(grid.length * 2) + "\n";

  for (let y = 0; y < grid.length; y++) {
    out += "" + y + "|";
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x] < 0) {
        out += 'X'.padEnd(2);
      } else if (grid[y][x] === 0) {
        out += "_".padEnd(2);
      } else {
        out += String(grid[y][x]).padEnd(2);
      }
    }
    out += "\n";
  }
  console.log(out);
  //return out + "\n";
}

/*
// debugging

let grid = [
  [0, 0, 0, 0],
  [0, -1, -1, -1],
  [0, -1, 0, 0],
  [0, 0, 0, 0]
];

console.log(showGrid(grid));
console.log('result=', getPath(grid, 0, 0, 2, 2));

*/
