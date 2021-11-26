/* 
Найти в матрице grid (N x N) count повторяюшихся шариков
- по дагонали (сверху-влево, сверху-вправо), вертикали (свреху вних), горизонтали (слева направо)
- вернуть координаты всех совпадающих точек, даже если линии пересекаются

На вход подается матрица grid N*N. Ячейки:
- null или 0 - пустая
- цвет ("red", "green"...) - заполненная

На выходе - массив координат ячеек, у котрых надо удалить шарики.
Координаты могут дублироваться (напр. если в строке вместо 5 шариков есть 7).
Поэтому применаем Map с ключом YxX
*/

function find5(grid, maxCount = 5) {
  const SIZE = grid.length;
  let path = [];
  let count, x1, y1, currentPath;

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let currentColor = grid[y][x];
      if (!currentColor) {
        continue;
      }
      // по горизонтали
      count = 0, x1 = x + 1, currentPath = [{ x, y }];
      while (x1 < SIZE && grid[y][x1] === currentColor) {
        currentPath.push({ x: x1, y: y });
        count++;
        x1++;
      }
      if (count >= maxCount - 1) {
        path.push(currentPath);
      }
      // по вертикали
      count = 0, y1 = y + 1, currentPath = [{ x, y }];
      while (y1 < SIZE && grid[y1][x] === currentColor) {
        currentPath.push({ x: x, y: y1 });
        count++;
        y1++;
      }
      if (count >= maxCount - 1) {
        path.push(currentPath);
      }
      // по диагонали /
      count = 0, y1 = y + 1, x1 = x - 1, currentPath = [{ x, y }];
      while (x1 >= 0 && y1 < SIZE && grid[y1][x1] === currentColor) {
        currentPath.push({ x: x1, y: y1 });
        count++;
        y1++;
        x1--;

      }
      if (count >= maxCount - 1) {
        path.push(currentPath);
      }
      // по диагонали \
      count = 0, y1 = y + 1, x1 = x + 1, currentPath = [{ x, y }];
      while (y1 < SIZE && x1 < SIZE && grid[y1][x1] === currentColor) {
        currentPath.push({ x: x1, y: y1 });
        count++;
        y1++;
        x1++;

      }
      if (count >= maxCount - 1) {
        path.push(currentPath);
      }

    } // for x
  } // for y
  return path;

}


// debug

const grid = [
  ['v', 0, 0, 0],
  [0, 'v', 0, 0],
  [0, 0, 'v', 0],
  [0, 0, 0, 'v'],
];

console.log(find5(grid, 3));