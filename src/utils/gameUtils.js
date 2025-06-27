// Custom game utilities and helper functions
export const GAME_CONSTANTS = {
  INITIAL_TIME: 500,
  BOARD_SIZE: 9,
  WIN_PATTERNS: [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ]
}

export const generateGameCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const formatTimeDisplay = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
}

export const calculateBoardStatus = (board) => {
  for (const pattern of GAME_CONSTANTS.WIN_PATTERNS) {
    const [a, b, c] = pattern
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return board.every(cell => cell !== '') ? 'tie' : ''
}

export const getRandomColor = () => {
  const colors = ['#e74c3c', '#3498db', '#9b59b6', '#e67e22', '#27ae60']
  return colors[Math.floor(Math.random() * colors.length)]
}
