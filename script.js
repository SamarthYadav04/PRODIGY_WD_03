const cells       = document.querySelectorAll(".cell");
const statusText  = document.getElementById("status");
const resetBtn    = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");
const aiBtn       = document.getElementById("aiBtn");


let board         = Array(9).fill("");
let currentPlayer = "X";
let gameActive    = true;


let aiEnabled     = false;   
const humanPlayer = "X";
const aiPlayer    = "O";


const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],  
  [0,3,6],[1,4,7],[2,5,8], 
  [0,4,8],[2,4,6]          
];


cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn .addEventListener("click", resetGame);
themeToggle.addEventListener("click", toggleTheme);
aiBtn      .addEventListener("click", toggleAiMode);


function handleCellClick(e){
  const idx = +e.target.dataset.index;

 
  if (board[idx] !== "" || !gameActive || (aiEnabled && currentPlayer === aiPlayer)) return;

  makeMove(idx, currentPlayer);

  if (aiEnabled && gameActive) {
    
    currentPlayer = aiPlayer;
    setTimeout(aiMove, 200);                   
  }
}

function makeMove(idx, player){
  board[idx] = player;
  cells[idx].textContent = player;

  if (checkWinner(player)) {
    statusText.textContent = `Player ${player} Wins!`;
    gameActive = false;
  } else if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  } else {
   
    if (!aiEnabled) {
      currentPlayer = player === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
  }
}


function aiMove(){
  const best = minimax(board, 0, true);
  makeMove(best.index, aiPlayer);
  if (gameActive) {           
    currentPlayer = humanPlayer;
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function minimax(newBoard, depth, isMax){
  
  if (checkWinner(aiPlayer, newBoard))   return {score:  10-depth};
  if (checkWinner(humanPlayer, newBoard))return {score: -10+depth};
  if (!newBoard.includes(""))            return {score:  0};

  const avail = newBoard
    .map((val, i) => val === "" ? i : null)
    .filter(i => i !== null);

  let bestMove = {score: isMax ? -Infinity : Infinity, index: null};

  avail.forEach(i=>{
    newBoard[i] = isMax ? aiPlayer : humanPlayer;     
    const result = minimax(newBoard, depth+1, !isMax);
    newBoard[i] = "";                                
    result.index = i;

    if (isMax) {
      if (result.score > bestMove.score) bestMove = result;
    } else {
      if (result.score < bestMove.score) bestMove = result;
    }
  });

  return bestMove;
}


function checkWinner(player, customBoard = board){
  return winConditions.some(pat=>pat.every(i=>customBoard[i]===player));
}


function resetGame(){
  board.fill("");
  cells.forEach(c => c.textContent = "");
  gameActive    = true;
  currentPlayer = humanPlayer;                
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function toggleTheme(){
  const body = document.body;
  body.classList.toggle("dark");
  body.classList.toggle("light");
  themeToggle.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
}

function toggleAiMode(){
  aiEnabled = !aiEnabled;
  aiBtn.textContent = aiEnabled ? "Play 2‑Player" : "Play vs AI";
  resetGame();
}
