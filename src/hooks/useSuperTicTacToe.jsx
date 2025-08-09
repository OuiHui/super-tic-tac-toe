import { useState, useEffect, useRef } from 'react'
import { initTimers, startTicking, stopTicking } from '../stores/timerStore'

const initialGameState = {
  boards: Array(9).fill(null).map(() => Array(9).fill('')),
  currentPlayer: 'X',
  activeBoard: null,
  wonBoards: Array(9).fill(''),
  gameWinner: '',
  gameOver: false,
  playerXTime: 500,
  playerOTime: 500,
  gameStarted: false
}

export function useSuperTicTacToe(isLocalGame = true) {
  const [gameState, setGameState] = useState(initialGameState)
  const timerRef = useRef(null)

  useEffect(() => {
    // Initialize external timers once
    initTimers(initialGameState.playerXTime, initialGameState.playerOTime)
  }, [])

  useEffect(() => {
    if (!isLocalGame) return
    if (!gameState.gameStarted || gameState.gameOver) {
      stopTicking()
      return
    }

    // Start ticking against external store; notify on timeout
    startTicking(
      () => gameState.currentPlayer,
      () => gameState.gameOver,
      (timedOutPlayer) => {
        // Timed out: other player wins
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          gameWinner: timedOutPlayer === 'X' ? 'O' : 'X',
          activeBoard: null
        }))
        stopTicking()
      }
    )

    return () => {
      stopTicking()
    }
  }, [isLocalGame, gameState.currentPlayer, gameState.gameOver, gameState.gameStarted])

  const checkWin = (board) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    return board.every(cell => cell !== '') ? 'tie' : ''
  }

  const isBoardFull = (board) => {
    return board.every(cell => cell !== '')
  }

  const makeMove = (boardIndex, cellIndex) => {
    if (gameState.gameOver) return null
    if (gameState.wonBoards[boardIndex]) return null
    if (gameState.boards[boardIndex][cellIndex]) return null
    if (gameState.activeBoard !== null && gameState.activeBoard !== boardIndex) return null

    const newState = {
      ...gameState,
      gameStarted: true, // Start the game on first move
      boards: gameState.boards.map((board, idx) => 
        idx === boardIndex 
          ? board.map((cell, cellIdx) => 
              cellIdx === cellIndex ? gameState.currentPlayer : cell
            )
          : board
      )
    }

    // Check for small board win/tie
    const boardResult = checkWin(newState.boards[boardIndex])
    if (boardResult && boardResult !== 'tie') {
      newState.wonBoards = [...gameState.wonBoards]
      newState.wonBoards[boardIndex] = boardResult
    } else if (boardResult === 'tie') {
      newState.wonBoards = [...gameState.wonBoards]
      newState.wonBoards[boardIndex] = 'tie'
    }

    // Check for overall win/tie
    const overallWinner = checkWin(newState.wonBoards.map(r => r === 'tie' ? '' : r))
    if (overallWinner && overallWinner !== 'tie') {
      newState.gameWinner = overallWinner
      newState.gameOver = true
      newState.activeBoard = null
      stopTicking()
    } else if (newState.wonBoards.every(r => r !== '')) {
      newState.gameWinner = 'tie'
      newState.gameOver = true
      newState.activeBoard = null
      stopTicking()
    } else {
      // Determine next active board
      const nextBoardIndex = cellIndex
      if (newState.wonBoards[nextBoardIndex] || isBoardFull(newState.boards[nextBoardIndex])) {
        newState.activeBoard = null
      } else {
        newState.activeBoard = nextBoardIndex
      }
    }

    // Switch player
    newState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'

    setGameState(newState)
    return newState
  }

  const resetGame = () => {
    stopTicking()
    const newState = { ...initialGameState }
    setGameState(newState)
    // Re-init external timers
    initTimers(initialGameState.playerXTime, initialGameState.playerOTime)
    return newState
  }

  return {
    gameState,
    makeMove,
    resetGame,
    setGameState
  }
}
