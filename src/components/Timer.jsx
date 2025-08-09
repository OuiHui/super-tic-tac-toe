import { useSyncExternalStore, useMemo } from 'react'
import { subscribe, getSnapshot } from '../stores/timerStore'

function Timer({ currentPlayer, gameState }) {
  const { x, o } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const clsX = useMemo(() => {
    if (gameState?.gameOver) return 'timer'
    return `timer ${currentPlayer === 'X' ? 'active player-x' : ''}`
  }, [currentPlayer, gameState?.gameOver])

  const clsO = useMemo(() => {
    if (gameState?.gameOver) return 'timer'
    return `timer ${currentPlayer === 'O' ? 'active player-o' : ''}`
  }, [currentPlayer, gameState?.gameOver])

  return (
    <div className="timers">
      <div className={clsX}>
        <span className="timer-label">PLAYER X</span>
        <span className="timer-value">{x}</span>
      </div>
      <div className={clsO}>
        <span className="timer-label">PLAYER O</span>
        <span className="timer-value">{o}</span>
      </div>
    </div>
  )
}

export default Timer
