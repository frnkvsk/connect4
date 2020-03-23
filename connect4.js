/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let htmlBoard = document.querySelector('#board');

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
const makeBoard = () => {
  // set "board" to empty HEIGHT x WIDTH matrix array
  board = Array(HEIGHT).fill(0).map(_ => Array(WIDTH).fill(0));
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  // add table header, each cell represents and enter point for each column
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", `h${x}`);
    // headCell.className = "head-cells";
    top.append(headCell);
  }
  htmlBoard.append(top);

  // add all empty board cells to start new game
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `b${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = x => {
  for(let row = HEIGHT-1; row >= 0; row--) {
    if(board[row][x] == 0) {
      board[row][x] = currPlayer;
      return row;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
  // make a div and insert into correct table cell
  const td = document.createElement('td');
  const target = document.querySelector(`#b${y}-${x}`);
  td.className = "piece";
  if(currPlayer == 1) {    
    td.style.backgroundColor = 'red';
  } else {
    td.style.backgroundColor = 'blue';
  }
  
  target.append(td);
}

/** endGame: announce game end */
const endGame = msg => {
  // pop up alert message
  setTimeout(() => {
    alert(msg);
    htmlBoard.innerHTML = '';
    currPlayer = 1;
    makeBoard();
    makeHtmlBoard();
  }, 500)
}

/** handleClick: handle click of column top to play piece */
const handleClick = evt => {
  // get x from ID of clicked cell
  let x = +evt.target.id[1];
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin(y, x)) {
    let color = currPlayer == 1 ? 'red' : 'blue';
    return endGame(`Player ${color} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (checkForTie(y, x)) {
    return endGame("Game is a tie!");
  }
  // switch players
  currPlayer = currPlayer == 1 ? 2 : 1;
}


/** checkForWin: check each direction both ways to see if last move produces
 *  a 4 consecutive colors in a row, column, or diagnal.
 */
const checkForWin = (y, x) => {  
  for(let [r1,c1, r2,c2] of [[-1,-1,1,1],[-1,0,1,0],[-1,1,1,-1],[0,1,0,-1]]) {  
    let cnt = 1;  
    cnt += checkForWinHelper(y + r1, x + c1, r1, c1);
    cnt += checkForWinHelper(y + r2, x + c2, r2, c2); 
    if(cnt >= 4) return true;      
  }  
  return false;
}
/** checkForWinHelper: counts each match in one direction from [y,x] location */
const checkForWinHelper = (r, c, y, x) => {
  if(r < 0 || c < 0 || r > 5 || c > 6) return 0;
  let cnt = 0;
  while(r >= 0 && c >= 0 && r < 6 && c < 7 && board[r][c] == currPlayer) {
    cnt++;
    r += y;
    c += x;    
  }
  return cnt;
}

/* checkForTie: check for tie */
const checkForTie = () => {
  if(!board.some(e => e.some(f => !f))) {
    return true;
  }
  return false;
}
makeBoard();
makeHtmlBoard();