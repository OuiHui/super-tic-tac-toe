function Timer({ playerXTime, playerOTime, currentPlayer, gameState }) {
  const getTimerClass = (player) => {
    let classes = ['timer']
    
    // If game is over, don't show active/colored states
    if (gameState?.gameOver) {
      return classes.join(' ')
    }
    
    // Normal gameplay coloring
    if (currentPlayer === player) {
      classes.push('active', `player-${player.toLowerCase()}`)
    }
    
    return classes.join(' ')
  }

  return (
    <div className="timers">
      <div className={getTimerClass('X')}>
        <span className="timer-label">PLAYER X</span>
        <span className="timer-value">{playerXTime}</span>
      </div>
      <div className={getTimerClass('O')}>
        <span className="timer-label">PLAYER O</span>
        <span className="timer-value">{playerOTime}</span>
      </div>
    </div>
  )
}

export default Timer
