const cells       = document.querySelectorAll(".cell");
const statusText  = document.getElementById("status");
const resetBtn    = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");


let board         = ["","","","","","","","",""];   
let currentPlayer = "X";                             
let gameActive    = true;                            

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],  
  [0,3,6],[1,4,7],[2,5,8],   
  [0,4,8],[2,4,6]            
];


cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);
themeToggle.addEventListener("click", toggleTheme);

              
function handleCellClick(e){
  const index = +e.target.dataset.index;

  
  if(board[index] !== "" || !gameActive) return;

  board[index]          = currentPlayer;  
  e.target.textContent  = currentPlayer;   

  if(checkWinner()){                       
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
  } else if(!board.includes("")){         
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  } else {                               
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function checkWinner(){
  return winConditions.some(pattern =>
    pattern.every(idx => board[idx] === currentPlayer)
  );
}
                     
function resetGame(){
  board.fill("");
  cells.forEach(c => c.textContent = "");
  currentPlayer = "X";
  gameActive    = true;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

                       
function toggleTheme(){
  const body = document.body;
  body.classList.toggle("dark");
  body.classList.toggle("light");

  themeToggle.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
}
