// константы - не менять!
const BLOCK_SIZE = 70; // ширина одного блока
const BALL_SIZE = 50; // диаметр щарика
const ROWS = 9; // число блоков (матрица NUM * NUM)

const COLORS = ["red", "brown", "pink", "green", "blue", "yellow", "cyan"];

let gameOver = false;
const game = Array(ROWS).fill(0).map(_ => Array(ROWS).fill(0));
let elBoad = null;
let cells = null;


// Очистка игрового поля.
// Удаляем все шарики и выставляем game[][]=0
function clearBoard() {
  cells.forEach((node) => {
    if (node.childNodes.length > 0) {
      node.childNodes[0].remove();
    }
  });
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < ROWS; x++) {
      game[y][x] = 0;
    }
  }
}

// Разместить один новый шарик
function placeBall(y, x, color) {
  // получаем тег TD по координатам Y,X
  let elCell = cells[y * ROWS + x];
  game[y][x] = 1;
  let elBall = document.createElement("div");
  elBall.classList.add("ball");
  elBall.classList.add(color);
  elCell.appendChild(elBall);
}

// удаляем шарик по координатам Y,X
function removeBall(y, x) {
  let elCell = cells[y * ROWS + x];
  if (elCell.childNodes.length != 0) {
    elCell.childNodes[0].remove();
  }
  game[y][x] = 0;
}

// разместить count случайных шариков
// в начале игры - 5 штук, после каждого хода по 3 шт.
function placeRandomBalls(count) {
  let freeCells = [];
  // свободные ячейки помещаем в массив freeCells
  // ниже код по идее не нужен
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < ROWS; x++) {
      if (!game[y][x]) {
        freeCells.push({ y, x });
      }
    }
  }
  // если недостаточно свободного места - игра закончена
  if (freeCells.length <= count) {
    gameOver = true;
    return false;
  }
  // распределяем шарики по свободным координатам из freeCells
  let remains = count; // кол-во свободных
  while (remains-- > 0 && freeCells.length > 0) {
    let i = Math.floor(Math.random() * freeCells.length);
    let { y, x } = freeCells.splice(i, 1)[0];
    // случайный цвет
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    console.log(` PLACE AT ${y} ${x} ${color}`);
    placeBall(y, x, color);
    game[y][x] = 1;
  }
}

// начало: после загрузки скриптов начинаем игру
document.addEventListener('DOMContentLoaded', () => {
  elBoard = document.getElementById('board');
  cells = elBoard.getElementsByTagName("td");

  // размещаем сначала 5 случайных шариков
  //placeRandomBalls(5);
  placeBall(0, 0, "red");
  placeBall(0, 1, "brown");
  placeBall(0, 2, "pink");
  placeBall(0, 3, "green");
  placeBall(0, 4, "blue");
  placeBall(0, 5, "yellow");
  placeBall(0, 6, "cyan");
  placeRandomBalls(5);

});
