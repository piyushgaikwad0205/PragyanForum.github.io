const statusDisplay = document.querySelector('.game--status');
const playerNameInput = document.getElementById('player-name');
const startButton = document.querySelector('.game--start');

let gameActive = false;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let playerName = "";

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer === "X" ? playerName : "Computer"}'s turn`;

startButton.addEventListener('click', startGame);

function startGame() {
    playerName = playerNameInput.value || "Player";
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('rainbow');
    });
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        document.querySelectorAll('.cell').forEach(cell => cell.classList.add('rainbow'));
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
    if (currentPlayer === "O") {
        setTimeout(handleComputerMove,2); // Add 2-second pause before computer moves
    }
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('rainbow');
    });
}

function handleComputerMove() {
    let bestMove = minimax(gameState, "O").index;
    let clickedCell = document.querySelector(`.cell[data-cell-index='${bestMove}']`);
    handleCellPlayed(clickedCell, bestMove);
    handleResultValidation();
}

function minimax(newGameState, player) {
    let availableCells = newGameState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);

    if (checkWin(newGameState, "X")) {
        return { score: -10 };
    } else if (checkWin(newGameState, "O")) {
        return { score: 10 };
    } else if (availableCells.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availableCells.length; i++) {
        let move = {};
        move.index = availableCells[i];
        newGameState[availableCells[i]] = player;

        if (player === "O") {
            let result = minimax(newGameState, "X");
            move.score = result.score;
        } else {
            let result = minimax(newGameState, "O");
            move.score = result.score;
        }

        newGameState[availableCells[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === player;
        });
    });
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
