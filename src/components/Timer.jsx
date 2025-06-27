function Timer({ playerXTime, playerOTime }) {
  return (
    <div className="timers">
      <div className="timer">
        Player X: <span>{playerXTime}</span>s
      </div>
      <div className="timer">
        Player O: <span>{playerOTime}</span>s
      </div>
    </div>
  )
}

export default Timer
