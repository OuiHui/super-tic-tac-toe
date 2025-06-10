class SuperTicTacToe {
    constructor() {
        this.boards = Array(9).fill(null).map(() => Array(9).fill(''));
        this.currentPlayer = 'X';
        this.activeBoard = null;
        this.wonBoards = Array(9).fill('');
        this.gameWinner = '';
        this.gameOver = false;
        this.playerXTime = 500;
        this.playerOTime = 500;
        this.timerInterval = null;
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

    startTimer() {
        clearInterval(this.timerInterval);
        const playerXTimer = document.getElementById('playerXTimer');
        const playerOTimer = document.getElementById('playerOTimer');
        if (this.currentPlayer === 'X') {
            playerXTimer.style.color = '#2196F3';
            playerOTimer.style.color = '#333';
        } else {
            playerXTimer.style.color = '#333';
            playerOTimer.style.color = '#f44336';
        }
        // Multiplayer: do not use local interval, just update display
        if (isOnlineMultiplayer) {
            this.updateTimerDisplay();
        } else {
            // Local: use interval as before
            this.timerInterval = setInterval(() => {
                if (this.currentPlayer === 'X') {
                    this.playerXTime--;
                    document.getElementById('playerXTime').textContent = this.playerXTime;
                    playerXTimer.style.color = '#2196F3';
                    playerOTimer.style.color = '#333';
                    if (this.playerXTime <= 0) {
                        this.endGame('O');
                    }
                } else {
                    this.playerOTime--;
                    document.getElementById('playerOTime').textContent = this.playerOTime;
                    playerXTimer.style.color = '#333';
                    playerOTimer.style.color = '#f44336';
                    if (this.playerOTime <= 0) {
                        this.endGame('X');
                    }
                }
            }, 1000);
        }
    }

    updateTimerDisplay() {
        // For multiplayer: just show the timer from the database
        document.getElementById('playerXTime').textContent = this.playerXTime;
        document.getElementById('playerOTime').textContent = this.playerOTime;
    }

    endGame(winner) {
        this.gameWinner = winner;
        this.gameOver = true;
        clearInterval(this.timerInterval);
        this.updateStatus();
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
        this.startTimer();
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
        this.playerXTime = 500;
        this.playerOTime = 500;
        document.getElementById('playerXTime').textContent = this.playerXTime;
        document.getElementById('playerOTime').textContent = this.playerOTime;
        clearInterval(this.timerInterval);
        this.renderBoard();
        this.updateStatus();
    }
}

let game;

function initGame() {
    game = new SuperTicTacToe();
    // Highlight Player X timer at game start
    const playerXTimer = document.getElementById('playerXTimer');
    const playerOTimer = document.getElementById('playerOTimer');
    if (playerXTimer && playerOTimer) {
        playerXTimer.style.color = '#2196F3';
        playerOTimer.style.color = '#333';
    }
}

function resetGame() {
    game.reset();
    // Highlight Player X timer at game reset
    const playerXTimer = document.getElementById('playerXTimer');
    const playerOTimer = document.getElementById('playerOTimer');
    if (playerXTimer && playerOTimer) {
        playerXTimer.style.color = '#2196F3';
        playerOTimer.style.color = '#333';
    }
}

function showStartMenu() {
    // Hide the game container and show the start menu
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('startMenu').style.display = '';
}

function showGameContainer() {
    document.getElementById('gameContainer').style.display = '';
    document.getElementById('startMenu').style.display = 'none';
}

// --- Multiplayer Firebase Sync ---
let firebaseUnsubscribe = null;
let multiplayerCode = null;
let isOnlineMultiplayer = false;
let myPlayer = null;

function syncGameToFirebase(players) {
    if (!isOnlineMultiplayer || !window.firebaseSet || !multiplayerCode) return;
    window.firebaseSet(window.firebaseRef(window.firebaseDatabase, 'games/' + multiplayerCode + '/state'), {
        boards: game.boards,
        currentPlayer: game.currentPlayer,
        activeBoard: game.activeBoard,
        wonBoards: game.wonBoards,
        gameWinner: game.gameWinner,
        gameOver: game.gameOver
    });
    if (players) {
        window.firebaseSet(window.firebaseRef(window.firebaseDatabase, 'games/' + multiplayerCode + '/players'), players);
    }
}

function applyFirebaseState(state) {
    if (!state) return;
    const prevPlayer = game.currentPlayer;
    game.boards = state.boards;
    game.currentPlayer = state.currentPlayer;
    game.activeBoard = state.activeBoard;
    game.wonBoards = state.wonBoards;
    game.gameWinner = state.gameWinner;
    game.gameOver = state.gameOver;
    if (typeof state.playerXTime === 'number') game.playerXTime = state.playerXTime;
    if (typeof state.playerOTime === 'number') game.playerOTime = state.playerOTime;
    game.updateTimerDisplay();
    game.renderBoard();
    game.updateStatus();
}

function updatePlayersView(players) {
    // Optionally, show player info in the UI
    // Example: document.getElementById('playerInfo').textContent = `X: ${players?.X || '-'} | O: ${players?.O || '-'}`;
}

function setupFirebaseMultiplayer(code) {
    isOnlineMultiplayer = true;
    multiplayerCode = code;
    showGameContainer();
    initGame();
    // Assign player if not already
    myPlayer = localStorage.getItem('super-ttt-player-' + code);
    window.firebaseGet(window.firebaseRef(window.firebaseDatabase, 'games/' + code + '/players')).then(snap => {
        let players = snap.exists() ? snap.val() : {};
        if (!myPlayer) {
            if (!players.X) {
                myPlayer = 'X';
                players.X = 'Player X';
            } else if (!players.O) {
                myPlayer = 'O';
                players.O = 'Player O';
            } else {
                myPlayer = 'spectator';
            }
            localStorage.setItem('super-ttt-player-' + code, myPlayer);
            syncGameToFirebase(players);
        }
        updatePlayersView(players);
    });
    // Listen for changes
    if (firebaseUnsubscribe) firebaseUnsubscribe();
    const dbRef = window.firebaseRef(window.firebaseDatabase, 'games/' + code);
    firebaseUnsubscribe = window.firebaseOnValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.state) applyFirebaseState(data.state);
        if (data && data.players) updatePlayersView(data.players);
    });
    // Patch handleCellClick to sync, only allow move if it's your turn
    const origHandle = game.handleCellClick.bind(game);
    game.handleCellClick = function(boardIndex, cellIndex) {
        if (game.currentPlayer !== myPlayer) return; // Not your turn
        // Calculate elapsed time for the player who just moved
        let newState = {
            boards: game.boards,
            currentPlayer: game.currentPlayer,
            activeBoard: game.activeBoard,
            wonBoards: game.wonBoards,
            gameWinner: game.gameWinner,
            gameOver: game.gameOver,
            playerXTime: game.playerXTime,
            playerOTime: game.playerOTime
        };
        if (game.currentPlayer === 'O') {
            // X just moved
            const now = Date.now();
            let elapsed = Math.floor((now - (game.turnStartTime || now)) / 1000);
            newState.playerXTime = Math.max(0, game.playerXTime - elapsed);
            newState.playerOTime = game.playerOTime;
            game.turnStartTime = now;
        } else {
            // O just moved
            const now = Date.now();
            let elapsed = Math.floor((now - (game.turnStartTime || now)) / 1000);
            newState.playerOTime = Math.max(0, game.playerOTime - elapsed);
            newState.playerXTime = game.playerXTime;
            game.turnStartTime = now;
        }
        origHandle(boardIndex, cellIndex);
        // Write new state with updated timers
        window.firebaseSet(window.firebaseRef(window.firebaseDatabase, 'games/' + multiplayerCode + '/state'), newState);
    };
}

// Initialize the game when the page loads
window.onload = function() {
    initGame();

    // Add back button event listener if it exists
    const backBtn = document.getElementById('backToLobbyBtn');
    if (backBtn) {
        backBtn.onclick = function() {
            window.location.href = 'start.html';
        };
    }
};
