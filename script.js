/* 
Общая суть:
 - есть игровое поле из массива ячеек ROWS * ROWS - реализовано как TABLE
 - сначала в этом поле случайным образом помещаются 5 шариков случайных цветов
  (размещение как дочерние <DIV> в ячейках <TD>)
 - по клику на шарик он становится активным (startBounce()) 
 - при втором клике (конечная ячейка):
   - прокладывается путь к конечной ячейке
   - шарик последовательно перемещается по этому пути
   - если в диагоналях/горизонталях есть 5 подряд стоящих шариков одного цвета, они удаляются.
   - если есть свободное место, размещаются еще 3 щарика случайного цвета
  - Игра звершается, когда не остается свободного места для размещения 3 шариков
  - В процессе игры тикает таймер и счетчик (второе пока не реализовано).
*/
const BLOCK_SIZE = 70; // размер одной ячейки таблицы
const BALL_SIZE = 50; // размер щарика
const ROWS = 9; // число ячеек в строке (матрица ROWS * ROWS)

const COLORS = ["red", "brown", "pink", "green", "blue", "yellow", "cyan"];

let gameOver = false; // признак, что игра закончена (нет свободных ячеек для размещения новых шариков)
let game = null;
let elBoad = null; // таблица с ячейками (<TABLE>)
let elScore, elTimer;
let cells = null; // массив ячеек (тегов <TD>)
let bouncingBall = null; // признак анимации шарика
let timerId = null, timerSeconds = 0;
let isMoving = false; // признак, что шарик в процессе перемещения. Чтобы не обрабатывались клики, пока он движется
let path = null;
let animTimer = null;
let oX, oY, _newX, _newY; // для анимации перемещения шарика
let score = 0;


// Очистка игрового поля.
// Удаляем все шарики и выставляем game[][]=0
function clearBoard() {
  let allBalls = document.getElementsByClassName("ball");
  if (allBalls) {
    for (let i = 0; i < allBalls.length; i++) {
      allBalls[i].remove();
    }
  }
  game = Array(ROWS).fill().map(_ => Array(ROWS).fill(0)); // игровая матрица для поиска пути

}

// Разместить один новый шарик
// если color = null, то выьрать случайный цвет
function placeBall(y, x, color = null) {
  // получаем тег TD по координатам Y,X
  let elCell = cells[y * ROWS + x];
  game[y][x] = -1; // "занято" 0 нужно для последующего DFS
  let elBall = document.createElement("div");
  elBall.classList.add("ball");
  if (!color) {
    color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  elBall.classList.add(color);
  elBall.setAttribute('data-color', color);
  elCell.appendChild(elBall);
}

// удаляем шарик по координатам (Y,X)
function removeBall(y, x) {
  let elCell = cells[y * ROWS + x];
  elCell && elCell.childNodes.forEach(e => e.remove());
  game[y][x] = 0;
}

// разместить count случайных шариков
// в начале игры - 5 штук, после каждого хода по 3 шт.
function placeRandomBalls(count = 3, color = null) {
  let freeCells = [];
  // свободные ячейки помещаем в массив freeCells
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < ROWS; x++) {
      if (game[y][x] == 0) {
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
  let remains = count; // кол-во свободных ячеек
  while (remains-- > 0 && freeCells.length > 0) {
    let i = Math.floor(Math.random() * freeCells.length);
    let { y, x } = freeCells.splice(i, 1)[0]; // удаляем выбранную ячейку
    placeBall(y, x, color);
    game[y][x] = -1;
  }
  // проверить - появились ли 5 шариков в ряд
  findAndRemove5balls(5);
  return true;
}

// включить анимацию шарика
function startBounce(y, x) {
  stopBounce();
  let elCell = cells[y * ROWS + x];
  let ball = elCell.childNodes[0];
  if (ball) {
    ball.classList.add('bounce');
    bouncingBall = { y, x };
  }
}

// выключить анимацию шарика
function stopBounce() {
  if (bouncingBall) {
    let elCell = cells[bouncingBall.y * ROWS + bouncingBall.x];
    let ball = elCell.childNodes[0];
    if (ball) {
      ball.classList.remove('bounce');
    }
    bouncingBall = null;
  }
}

// переместить шарик из позиции (oldY, oldX) в (newY, newX)
// продумать рекурсию
function moveTo(oldY, oldX, newY, newX) {
  // если кликнули по тому же шарику, прекратить прыгать и выход
  stopBounce();
  if (oldX === newX && oldY === newY) {
    return;
  }
  path = getPath(game, oldY, oldX, newY, newX);
  if (!path || path.length < 2) { // нет пути
    return;
  }
  oX = oldX;
  oY = oldY;
  game[oldY][oldX] = 0;
  // переместить шарик в (newY, newX), двигаясь по path (path содержит начальную и конечную точки)
  isMoving = true; // устанавливаем isMoving, чтобы предотвратить клики во время перемещения. Сброс внутри moveBall() в конечной точке
  animTimer = setInterval(() => {
    moveBall()
  }, 90);

}

// переместить шарик из (oY,oX) в (_newY, _newX) (вызывается из таймера)
function moveBall() {
  let { y, x } = path.pop();

  let oldCell = cells[oY * ROWS + oX]; // пред. ячейка
  let newCell = cells[y * ROWS + x]; // новая ячейка
  let ball = oldCell.childNodes[0].cloneNode(false);
  removeBall(oY, oX);
  newCell.appendChild(ball);
  oY = y;
  oX = x;
  if (path.length === 0) { // достигли финальной точки
    clearInterval(animTimer);
    // stopBounce();
    isMoving = false;
    animTimer = null;
    game[y][x] = -1;
    // если при следующем ходе не удалили ряд из 5 шариков, добавить еще 3 штуки
    if (!findAndRemove5balls()) {
      placeRandomBalls(3);
    }
  }
}

// показать текущие значения часиков
function updateTimer() {
  timerSeconds++;
  let seconds = timerSeconds % 60;
  let minutes = Math.floor(timerSeconds % 3600 / 60);
  let hours = Math.floor(timerSeconds / 3600);
  elTimer.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
// сброс таймера
function resetTimer() {
  if (!timerId) {
    clearInterval(timerId);
  }
  timerSeconds = 0;
  elTimer.innerText = '00:00:00';
  timerId = setInterval(updateTimer, 1000);
}

/* 
findAndRemove5balls() - найти и удалить 5 последовательных шариков одного цвета
Если нашли - удалить и вернуть true, иначе вернуть false
- используем внешнюю функцию find5() - получить массив удаляемых шариков
 */
function findAndRemove5balls() {
  let grid = Array(ROWS).fill().map(_ => Array(ROWS).fill(null));
  game.map((col, y) => col.map((_, x) => {
    if (game[y][x] === -1) {
      grid[y][x] = cells[y * ROWS + x].childNodes[0]?.getAttribute('data-color');
    }
  }));
  let ballsToRemove = find5(grid);
  // удаляем шарики по координатам из ballsToRemove {y,x}
  if (ballsToRemove) {
    ballsToRemove.forEach(({ y, x }) => removeBall(y, x));
    updateScore(ballsToRemove.length); // плюсуем к счету кол-во удаленных
    return true;
  }
  return false;

}

function setScore(num) {
  elScore.innerText = num;
}

// обновить кол-во очков
function updateScore(points) {
  score += points;
  setScore(score);
}

// обработчик клика на ячейку или шарик
function handleClick(e) {
  if (isMoving) {
    return;
  }
  let clicked = e.target;
  if (clicked?.classList?.contains('ball')) {
    // это шарик. Надо определить его координаты [y,x]
    let y = clicked.parentNode.parentNode.rowIndex;
    let x = clicked.parentNode.cellIndex;
    startBounce(y, x);
  } else if (clicked.childNodes[0]?.classList?.contains('ball')) {
    // не шарик, но ячейка с шариком (промахнулись и попали на пустое место ячейки)
    let y = clicked.parentNode.rowIndex;
    let x = clicked.cellIndex;
    startBounce(y, x);
  } else {
    // это пустая ячейка. Если есть активный шарик, надо передвинуть его в нё
    let y = clicked.parentNode.rowIndex;
    let x = clicked.cellIndex;
    if (bouncingBall && (bouncingBall.y != y || bouncingBall.x != x)) {
      moveTo(bouncingBall.y, bouncingBall.x, y, x);
    }
  }
}

// начало игры: обнулить игоровое поле и таймер
function startGame() {
  clearBoard();
  resetTimer();
  score = 0;
  setScore(0);
}

// начало: после загрузки скриптов начинаем игру
document.addEventListener('DOMContentLoaded', () => {
  elBoard = document.getElementById('board');
  cells = elBoard.getElementsByTagName("td");
  elTimer = document.getElementById('time_container');
  elStatus = document.getElementById('status');
  elScore = document.getElementById('score');

  elBoard.addEventListener('click', handleClick);

  startGame();
  // размещаем сначала 5 случайных шариков
  // тест: щарики всех цветов
  for (let i = 0; i < COLORS.length; i++) {
    placeBall(0, i, COLORS[i]);
  }
  placeRandomBalls(5);
  //placeRandomBalls(5, 'red');
  startBounce(0, 1);

});

function showGrid2(grid) {
  let out = grid.map(col => col.map(cell => cell ? String(cell).slice(0, 4).padEnd(4) : '____'));
  console.log(out);
}