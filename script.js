// константы - не менять!
const BLOCK_SIZE = 70; // ширина одного блока
const BALL_SIZE = 50; // диаметр щарика
const ROWS = 9; // число блоков (матрица NUM * NUM)

const COLORS = ["red", "brown", "pink", "green", "blue", "yellow", "cyan"];

let gameOver = false;
const game = Array(ROWS).fill().map(_ => Array(ROWS).fill(0));
let elBoad = null;
let cells = null;
let bouncingBall = null;
let timerId = null, timerSeconds = 0, elTimer = null;



// Очистка игрового поля.
// Удаляем все шарики и выставляем game[][]=0
function clearBoard() {
  console.log('clearBoard() cells=', cells, 'len=', cells.length);
  // удалить шарики из <td> (если есть)
  for (let i = 0; i < cells.length; i++) {
    if (cells.item(i).childNodes.length > 0) {
      cells.item(i).childNodes[0].remove();
    }
  }
  // cells.forEach((node) => {
  //   if (node.childNodes.length > 0) {
  //     node.childNodes[0].remove();
  //   }
  // });
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

function startBounce(y, x) {
  let elCell = cells[y * ROWS + x];
  let ball = elCell.childNodes[0];
  if (ball) {
    ball.classList.add('bounce');
    bouncingBall = [y, x];
    console.log('set bounce=', bouncingBall);
  }
}

function stopBounce() {
  if (bouncingBall) {
    let elCell = cells[bouncingBall[0] * ROWS + bouncingBall[1]];
    let ball = elCell.childNodes[0];
    if (ball) {
      ball.classList.remove('bounce');
    }
    bouncingBall = null;
  }
}

// переместить шарик из позиции (oldY, oldX) в (newY, newX)
function moveTo(oldY, oldX, newY, newX) {
  let oldCell = cells[oldY * ROWS + oldX];
  let newCell = cells[newY * ROWS + newX];
  let ball = oldCell.childNodes[0];
  if (ball && newCell.childNodes.length === 0) {
    newCell.appendChild(ball.cloneNode(false)); // поместить копию шарика в новые координаты
    oldCell.childNodes[0]?.remove(); // удалить старый шарик
    game[oldY][oldX] = 0;
    game[newY][newX] = 1;
    // если скачущий шарик перемещается, обновить его координаты в bouncingBall
    if (bouncingBall && bouncingBall[0] === oldY && bouncingBall[1] === oldX) {
      bouncingBall = [newY, newX];
    }
  }
}


function updateTimer() {
  timerSeconds++;
  let seconds = timerSeconds % 60;
  let minutes = Math.floor(timerSeconds % 3600 / 60);
  let hours = Math.floor(timerSeconds / 3600);
  elTimer.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

}
function resetTimer() {
  if (!timerId) {
    clearInterval(timerId);
  }
  timerSeconds = 0;
  document.getElementById('time_container').innerText = '00:00:00';
  timerId = setInterval(updateTimer, 1000);
}

// начало игры: обнулить игоровое поле и таймер
function startGame() {
  clearBoard();
  resetTimer();
}

// начало: после загрузки скриптов начинаем игру
document.addEventListener('DOMContentLoaded', () => {
  elBoard = document.getElementById('board');
  cells = elBoard.getElementsByTagName("td");
  elTimer = document.getElementById('time_container');
  elStatus = document.getElementById('status');

  startGame();
  // размещаем сначала 5 случайных шариков
  placeBall(0, 0, "red");
  placeBall(0, 1, "brown");
  placeBall(0, 2, "pink");
  placeBall(0, 3, "green");
  placeBall(0, 4, "blue");
  placeBall(0, 5, "yellow");
  placeBall(0, 6, "cyan");
  placeRandomBalls(5);
  startBounce(0, 1);
  //setTimeout(() => stopBounce(1, 1), 3000);
  setTimeout(stopBounce, 3000);
  setTimeout(() => moveTo(0, 1, 1, 1), 2000);

  //  startGame();

});
