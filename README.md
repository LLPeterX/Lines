# Color Lines
### - Реализация знаменитой игры 1990-х годов на JavaScript - 
### Основной принцип и правила игры
* Дана доска из 9 x 9
* В начале игры случайным образом на доске размещаются 5 цветных шариков со случайным цветом (7 возможных цветов) 
* После каждого перемещения шарика (для этого должен существовать свободный путь), на доску добавляются еще 3 случайных шарика
* Если после перемещения обнаруживаются подряд (по диагонали/вертикали/горизонтали) 5 шариков (или больше) одного цвета, то они исчезают, и появляется свободное место.
* Игра заканчивается, если не остается свободного места для размещения 3 шариков.

P.S. Ссылка: https://ru.wikipedia.org/wiki/Color_Lines 
Автор игры - Олег Демин. Респект ему за идею.

### Реализация
* Чистый JavaScript
* Реализация алгоритма поиска кратчайшего пути "в ширину" (BFS)
* Анимация шарика с помощью CSS