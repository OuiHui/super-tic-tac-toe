# Super Tic-Tac-Toe React

A React implementation of Super Tic-Tac-Toe (Firebase real-time multiplayer support in progress)

## Features

- **Local Single Player**: Play against yourself
- **Online Multiplayer**: Real-time multiplayer using Firebase
- **Real-time Sync**: Game state synchronizes across all players instantly
- **Timer System**: Each player has a countdown timer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```



## How to Play

### Local Game
1. Click "Local Single Player"
2. Take turns clicking on the game board
3. Try to win 3 small boards in a row!

### Online Multiplayer
1. Click "Online Multiplayer"
2. Enter your display name
3. Either:
   - Click "Create Game" to start a new game and share the code
   - Enter a game code and click "Join Game" to join an existing game
4. Wait for another player to join
5. Play in real-time!

## Game Rules

- Win small boards by getting 3 in a row within each 3×3 grid
- Your move determines which board your opponent must play in next
- If the target board is full or already won, opponent can play anywhere
- Win the game by getting 3 small boards in a row!
- Green highlight shows where you can currently play





