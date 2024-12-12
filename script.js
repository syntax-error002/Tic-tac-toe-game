let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let mode = '';
let playerScore = { X: 0, O: 0 };

function startGame(selectedMode) {
    mode = selectedMode;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    document.getElementById('winner').innerText = '';
    renderBoard();
}

function renderBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.innerText = cell;
        cellElement.onclick = () => handleCellClick(index);
        if (cell) cellElement.classList.add('taken');
        boardContainer.appendChild(cellElement);
    });
}

function handleCellClick(index) {
    if (board[index] || checkWinner()) return;
    board[index] = currentPlayer;
    renderBoard();

    if (checkWinner()) {
        playerScore[currentPlayer]++;
        showPopup(`${currentPlayer} Wins!`, `Score: X -> ${playerScore.X}, O - ${playerScore.O}`);
        return;
    }

    if (board.every(cell => cell)) {
        showPopup("It's a Draw!", `Score: X -> ${playerScore.X}, O - ${playerScore.O}`);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (mode === 'bot' && currentPlayer === 'O') {
        botMove();
    }
}

function botMove() {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    const bestMove = findBestMove();
    const moveIndex = bestMove !== null ? bestMove : emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[moveIndex] = 'O';
    renderBoard();

    if (checkWinner()) {
        playerScore.O++;
        showPopup(`O Wins!`, `Score: X - ${playerScore.X}, O - ${playerScore.O}`);
    } else {
        currentPlayer = 'X';
    }
}

function findBestMove() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        let [a, b, c] = combination;
        if (board[a] === 'O' && board[b] === 'O' && !board[c]) return c;
        if (board[a] === 'O' && board[c] === 'O' && !board[b]) return b;
        if (board[b] === 'O' && board[c] === 'O' && !board[a]) return a;
    }

    for (let combination of winningCombinations) {
        let [a, b, c] = combination;
        if (board[a] === 'X' && board[b] === 'X' && !board[c]) return c;
        if (board[a] === 'X' && board[c] === 'X' && !board[b]) return b;
        if (board[b] === 'X' && board[c] === 'X' && !board[a]) return a;
    }

    return null;
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function showPopup(message, score) {
    document.getElementById('popup-message').innerText = `${message}\n${score}`;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

renderBoard();

