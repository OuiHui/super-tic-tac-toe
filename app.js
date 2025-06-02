
class SuperTicTacToe {
    constructor() {
        this.boards = Array(9).fill(null).map(() => Array(9).fill(''));
        this.currentPlayer = 'X';
        this.activeBoard = null;
        this.wonBoards = Array(9).fill('');
        this.gameWinner = '';
        this.gameOver = false;
        this.initializeGame();
    }

    initializeGame() {
        this.renderBoard();
        this.updateStatus();
    }

    checkWin(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.every(cell => cell !== '') ? 'tie' : '';
    }

    isBoardFull(board) {
        return board.every(cell => cell !== '');
    }

    handleCellClick(boardIndex, cellIndex) {
        if (this.gameOver) return;
        if (this.wonBoards[boardIndex]) return;
        if (this.activeBoard !== null && this.activeBoard !== boardIndex) return;
        if (this.boards[boardIndex][cellIndex]) return;

        // Make the move
        this.boards[boardIndex][cellIndex] = this.currentPlayer;

        // Check if this move won the small board
        const boardResult = this.checkWin(this.boards[boardIndex]);
        if (boardResult && boardResult !== 'tie') {
            this.wonBoards[boardIndex] = boardResult;
        } else if (boardResult === 'tie') {
            this.wonBoards[boardIndex] = 'tie';
        }

        // Check if someone won the overall game
        const overallWinner = this.checkWin(this.wonBoards.map(result => result === 'tie' ? '' : result));
        if (overallWinner && overallWinner !== 'tie') {
            this.gameWinner = overallWinner;
            this.gameOver = true;
            this.activeBoard = null;
        } else if (this.wonBoards.every(result => result !== '')) {
            this.gameWinner = 'tie';
            this.gameOver = true;
            this.activeBoard = null;
        } else {
            // Determine next active board
            const nextBoardIndex = cellIndex;
            if (this.wonBoards[nextBoardIndex] || this.isBoardFull(this.boards[nextBoardIndex])) {
                this.activeBoard = null;
            } else {
                this.activeBoard = nextBoardIndex;
            }
        }

        // Switch players
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

        this.renderBoard();
        this.updateStatus();
    }

    renderBoard() {
        const superBoard = document.getElementById('superBoard');
        superBoard.innerHTML = '';

        for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
            const smallBoard = document.createElement('div');
            smallBoard.className = 'small-board';
            
            const isActive = this.activeBoard === null || this.activeBoard === boardIndex;
            const boardWinner = this.wonBoards[boardIndex];
            
            if (isActive && !boardWinner && !this.gameOver) {
                smallBoard.classList.add('active');
            }
            if (boardWinner) {
                smallBoard.classList.add('won');
            }

            const boardGrid = document.createElement('div');
            boardGrid.className = 'board-grid';

            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.textContent = this.boards[boardIndex][cellIndex];
                
                if (this.boards[boardIndex][cellIndex]) {
                    cell.classList.add(this.boards[boardIndex][cellIndex].toLowerCase());
                }

                const isClickable = !this.gameOver && 
                                    !this.wonBoards[boardIndex] && 
                                    !this.boards[boardIndex][cellIndex] && 
                                    (this.activeBoard === null || this.activeBoard === boardIndex);

                cell.disabled = !isClickable;
                cell.onclick = () => this.handleCellClick(boardIndex, cellIndex);

                boardGrid.appendChild(cell);
            }

            smallBoard.appendChild(boardGrid);

            // Add winner overlay if board is won
            if (boardWinner) {
                const winnerOverlay = document.createElement('div');
                winnerOverlay.className = `board-winner ${boardWinner.toLowerCase()}`;
                winnerOverlay.textContent = boardWinner === 'tie' ? 'TIE' : boardWinner;
                smallBoard.appendChild(winnerOverlay);
            }

            superBoard.appendChild(smallBoard);
        }
    }

    updateStatus() {
        const gameStatus = document.getElementById('gameStatus');
        const gameInstruction = document.getElementById('gameInstruction');

        if (this.gameOver) {
            if (this.gameWinner === 'tie') {
                gameStatus.innerHTML = '<div class="game-over tie">Game Tied!</div>';
            } else {
                gameStatus.innerHTML = `<div class="game-over ${this.gameWinner.toLowerCase()}">Player ${this.gameWinner} Wins!</div>`;
            }
            gameInstruction.textContent = '';
        } else {
            gameStatus.innerHTML = `<div class="current-player">Current Player: <span class="${this.currentPlayer.toLowerCase()}" style="color: ${this.currentPlayer === 'X' ? '#2196F3' : '#f44336'};">${this.currentPlayer}</span></div>`;
            
            if (this.activeBoard !== null) {
                gameInstruction.textContent = 'Must play in the highlighted board';
            } else {
                gameInstruction.textContent = 'Can play in any available board';
            }
        }
    }

    reset() {
        this.boards = Array(9).fill(null).map(() => Array(9).fill(''));
        this.currentPlayer = 'X';
        this.activeBoard = null;
        this.wonBoards = Array(9).fill('');
        this.gameWinner = '';
        this.gameOver = false;
        this.renderBoard();
        this.updateStatus();
    }
}

let game;

function initGame() {
    game = new SuperTicTacToe();
}

function resetGame() {
    game.reset();
}

// Initialize the game when the page loads
window.onload = initGame;
