// multiplayer.js
// Handles all online multiplayer logic for multiplayer.html

// --- Firebase Setup ---
// Use compat SDKs directly
let firebaseApp, firebaseAuth, firebaseDatabase;

window.addEventListener('DOMContentLoaded', async () => {
    // Initialize Firebase (REQUIRED: Replace with your actual Firebase config below)
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp({
            apiKey: "AIzaSyB_rhlvpYmCEOFznXVVvoRRuIK2IqARF1s",
            authDomain: "super-tic-tac-toe-1d3ad.firebaseapp.com",
            databaseURL: "https://super-tic-tac-toe-1d3ad-default-rtdb.firebaseio.com",
            projectId: "super-tic-tac-toe-1d3ad",
            storageBucket: "super-tic-tac-toe-1d3ad.appspot.com",
            messagingSenderId: "983831058341",
            appId: "1:983831058341:web:d2e16c8de49a3202adfa4c",
            measurementId: "G-YLFYSTJY3Z"
        });
    } else {
        firebaseApp = firebase.app();
    }
    firebaseAuth = firebase.auth();
    firebaseDatabase = firebase.database();

    await signInAnonymously();
    setupUIHandlers();
});

let currentUser = null;
let currentGameCode = null;
let myPlayer = null;
let lobbyUnsubscribe = null;
let gameUnsubscribe = null;
let turnStartTime = null;

async function signInAnonymously() {
    try {
        const userCredential = await firebaseAuth.signInAnonymously();
        currentUser = userCredential.user;
        // Optionally store user info in DB for display
        await firebaseDatabase.ref('users/' + currentUser.uid).set({
            uid: currentUser.uid,
            joined: Date.now()
        });
        document.getElementById('authStatus').textContent = 'Signed in as: ' + currentUser.uid.substring(0, 6);
    } catch (e) {
        alert('Failed to sign in: ' + e.message);
    }
}

function setupUIHandlers() {
    document.getElementById('createGameBtn').onclick = createGame;
    document.getElementById('joinGameBtn').onclick = joinGame;
    document.getElementById('backToStartBtn').onclick = function() {
        window.location.href = 'start.html';
    };
}

function generateGameCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

async function createGame() {
    const code = generateGameCode();
    currentGameCode = code;
    await firebaseDatabase.ref('games/' + code).set({
        lobby: {
            [currentUser.uid]: { uid: currentUser.uid, joined: Date.now() }
        },
        state: null,
        players: {}
    });
    enterLobby(code);
}

async function joinGame() {
    const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
    if (!code) return alert('Enter a game code.');
    currentGameCode = code;
    const lobbyRef = firebaseDatabase.ref('games/' + code + '/lobby/' + currentUser.uid);
    await lobbyRef.set({ uid: currentUser.uid, joined: Date.now() });
    enterLobby(code);
}

function enterLobby(code) {
    document.getElementById('lobbyMenu').style.display = 'none';
    document.getElementById('lobby').style.display = '';
    document.getElementById('gameCodeDisplay').textContent = code;
    // Add leave lobby button handler
    document.getElementById('leaveLobbyBtn').onclick = async function() {
        // Remove user from lobby in database
        await firebaseDatabase.ref('games/' + code + '/lobby/' + currentUser.uid).remove();
        // Optionally, if user is X or O, remove from players
        const playersRef = firebaseDatabase.ref('games/' + code + '/players');
        const playersSnap = await playersRef.once('value');
        if (playersSnap.exists()) {
            const players = playersSnap.val();
            let changed = false;
            if (players.X === currentUser.uid) { players.X = null; changed = true; }
            if (players.O === currentUser.uid) { players.O = null; changed = true; }
            if (changed) await playersRef.set(players);
        }
        // Return to lobby menu
        document.getElementById('lobbyMenu').style.display = '';
        document.getElementById('lobby').style.display = 'none';
    };
    listenToLobby(code);
}

function listenToLobby(code) {
    if (lobbyUnsubscribe) lobbyUnsubscribe();
    const lobbyRef = firebaseDatabase.ref('games/' + code + '/lobby');
    lobbyRef.on('value', async (snap) => {
        const lobby = snap.val() || {};
        updateLobbyUI(lobby);
        const uids = Object.keys(lobby);
        if (uids.length >= 2) {
            const playersRef = firebaseDatabase.ref('games/' + code + '/players');
            const playersSnap = await playersRef.once('value');
            let players = playersSnap.exists() ? playersSnap.val() : {};
            if (!players.X || !players.O) {
                if (!players.X) players.X = uids[0];
                if (!players.O && uids[1] && uids[1] !== players.X) players.O = uids[1];
                await playersRef.set(players);
            }
            if (uids.includes(currentUser.uid) && (players.X === currentUser.uid || players.O === currentUser.uid)) {
                document.getElementById('startGameBtn').style.display = '';
                document.getElementById('startGameBtn').onclick = () => startGame(code, players);
            }
        }
    });
    lobbyUnsubscribe = () => lobbyRef.off();
}

function updateLobbyUI(lobby) {
    const list = document.getElementById('playersList');
    list.innerHTML = '';
    Object.values(lobby).forEach(user => {
        const div = document.createElement('div');
        div.textContent = user.uid === currentUser.uid ? 'You' : 'Player ' + user.uid.substring(0, 6);
        list.appendChild(div);
    });
}

async function startGame(code, players) {
    const stateRef = firebaseDatabase.ref('games/' + code + '/state');
    const stateSnap = await stateRef.once('value');
    if (stateSnap.exists() && stateSnap.val()) return;
    const state = {
        boards: Array(9).fill(null).map(() => Array(9).fill('')),
        currentPlayer: 'X',
        activeBoard: null,
        wonBoards: Array(9).fill(''),
        gameWinner: '',
        gameOver: false,
        playerXTime: 500,
        playerOTime: 500
    };
    await stateRef.set(state);
    enterGame(code, players);
}

function enterGame(code, players) {
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('gameArea').style.display = '';
    myPlayer = (players.X === currentUser.uid) ? 'X' : (players.O === currentUser.uid) ? 'O' : 'spectator';
    listenToGameState(code);
}

function listenToGameState(code) {
    if (gameUnsubscribe) gameUnsubscribe();
    const stateRef = firebaseDatabase.ref('games/' + code + '/state');
    stateRef.on('value', (snap) => {
        const state = snap.val();
        if (state) updateGameUI(state);
    });
    gameUnsubscribe = () => stateRef.off();
}

function updateGameUI(state) {
    // TODO: Render the board, timers, and handle moves
    // Only allow move if myPlayer === state.currentPlayer
    // Update UI to show current player, timers, and winner
}

// TODO: Implement board rendering, move handling, timer logic, and back-to-lobby/game reset
// This is a skeleton; fill in UI and game logic as needed.
