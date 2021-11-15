// константы - не менять!
const BLOCK_SIZE = 50; // ширина одного блока
const ROWS = 9; // число блоков (матрица NUM * NUM)
const game = Array(ROWS).fill(0).map(_ => Array(ROWS).fill(0));

// создание начальной сетки
function createGrid(eGrid) {
  elBoard.innerHTML = "";

}


// start
document.addEventListener('DOMContentLoaded', () => {
  const elBoard = document.getElementById('board');
  // создаем игровое поле - сетку ROWS*ROWS
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < ROWS; x++) {
      game[y][x] = 0;
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.style.width = `${BLOCK_SIZE}px`;
      cell.style.height = `${BLOCK_SIZE}px`;
      elBoard.appendChild(cell);
    }
  }

});