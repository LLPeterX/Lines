// константы - не менять!
const BLOCK_SIZE = 70; // ширина одного блока
const BALL_SIZE = 50; // диаметр щарика
const ROWS = 9; // число блоков (матрица NUM * NUM)

// const COLORS = {
//   RED: 'FF0000',
//   BROWN: "FFC0C0",
//   PINK: "F0F0F0",
//   GREEN: "00FF00",
//   BLUE: "0000FF",
//   YELLOW: "F0F0F0",
//   CYAN: "202080"
// };
const COLORS = ["red", "brown", "pink", "green", "blue", "yellow", "cyan"];

let gameOver = false;
const game = Array(ROWS).fill(0).map(_ => Array(ROWS).fill(0));
let elBoad = null;
let cells = null;

// создаем игровое поле - сетку ROWS*ROWS
function createBoard() {
  // 
  // elBoard.innerHTML = "";
  // gameOver = false;
  // for (let y = 0; y < ROWS; y++) {
  //   for (let x = 0; x < ROWS; x++) {
  //     game[y][x] = 0;
  //     let cell = document.createElement('div');
  //     cell.classList.add('cell');
  //     cell.style.width = `${BLOCK_SIZE}px`;
  //     cell.style.height = `${BLOCK_SIZE}px`;
  //     elBoard.appendChild(cell);
  //   }
  // }
}

function placeBall(y, x, style) {
  // get cell from x,y
  let elCell = cells[y * ROWS + x];
  game[y][x] = 1;
  console.log('childs = ', elCell.childNodes.length);
  let elBall = document.createElement("div");
  elBall.classList.add("ball");
  elBall.classList.add(style);
  elCell.appendChild(elBall);
}

function removeBall(x, y) {
  let elCell = cells[y * ROWS + x];
  if (elCell.childNodes.length != 0) {
    elCell.childNodes[0].remove();
  }
  game[y][x] = 0;
}

function placeBallZ(y, x, style, originElement = null, prevY = null, prevX = null) {
  //let oconsole.log(elBoard.offsetTop);
  //let yOffset = window.scrollY + elBoard.getBoundingClientRect().top; // + Math.floor(BLOCK_SIZE / 2);
  //let xOffset = window.scrollX + elBoard.getBoundingClientRect().left; // + Math.floor(BLOCK_SIZE / 2);
  //let yOffset = Math.floor(BLOCK_SIZE / 2);
  // let xOffset = Math.floor(BLOCK_SIZE / 2);

  //debugger;
  game[y][x] = 1;
  if (prevY != null && prevX != null) {
    game[y][x] = 0;
  }
  if (originElement == null) {
    // создать шарик
    originElement = document.createElement("div");
    originElement.classList.add("ball");
    originElement.classList.add(style);
    //elBoard.appendChild(originElement);
  }
  originElement.style.left = `${xOffset}px`;
  originElement.style.top = `${yOffset}px`;

}

// разместить count случайных шариков
function placeRandomBalls(count) {
  let freeCells = [], taken = [];
  // свободные ячейки помещ в массив freeCells
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
}

// start
document.addEventListener('DOMContentLoaded', () => {
  elBoard = document.getElementById('board');
  cells = elBoard.getElementsByTagName("td");

  // создаем игровое поле - рисуем сетку ROWS * ROWS
  createBoard();
  // размещаем сначала 5 случайных шариков
  //placeRandomBalls(5);
  placeBall(8, 8, "cyan");
  placeBall(0, 0, "red");



});