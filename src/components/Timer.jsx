function Timer({ playerXTime, playerOTime, currentPlayer }) {
  return (
    <div className="timers">
      <div className={`timer ${currentPlayer === 'X' ? 'active player-x' : ''}`}>
        <span className="timer-label">PLAYER X</span>
        <span className="timer-value">{playerXTime}</span>
      </div>
      <div className={`timer ${currentPlayer === 'O' ? 'active player-o' : ''}`}>
        <span className="timer-label">PLAYER O</span>
        <span className="timer-value">{playerOTime}</span>
      </div>
    </div>
  )
}

export default Timer
