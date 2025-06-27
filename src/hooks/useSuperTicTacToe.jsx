import { useState, useEffect, useRef } from 'react'

const initialGameState = {
  boards: Array(9).fill(null).map(() => Array(9).fill('')),
  currentPlayer: 'X',
  activeBoard: null,
  wonBoards: Array(9).fill(''),
  gameWinner: '',
  gameOver: false,
  playerXTime: 500,
  playerOTime: 500
}

export function useSuperTicTacToe(isLocalGame = true) {
  const [gameState, setGameState] = useState(initialGameState)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isLocalGame && !gameState.gameOver) {
      startTimer()
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState.currentPlayer, gameState.gameOver, isLocalGame])

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setGameState(prevState => {
        if (prevState.gameOver) {
          clearInterval(timerRef.current)
          return prevState
        }

        const newState = { ...prevState }
        
        if (newState.currentPlayer === 'X') {
          newState.playerXTime--
        } else {
          newState.playerOTime--
        }

        // Check for time out
        if (newState.playerXTime <= 0 || newState.playerOTime <= 0) {
          newState.gameOver = true
          newState.gameWinner = newState.currentPlayer === 'X' ? 'O' : 'X'
          clearInterval(timerRef.current)
        }

        return newState
      })
    }, 1000)
  }

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
    } else if (newState.wonBoards.every(r => r !== '')) {
      newState.gameWinner = 'tie'
      newState.gameOver = true
      newState.activeBoard = null
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
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    const newState = { ...initialGameState }
    setGameState(newState)
    return newState
  }

  return {
    gameState,
    makeMove,
    resetGame,
    setGameState
  }
}
