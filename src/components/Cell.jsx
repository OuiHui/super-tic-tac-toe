function Cell({ value, onClick, disabled, currentPlayer }) {
  const cellClasses = ['cell']
  if (value) cellClasses.push(value.toLowerCase())
  if (currentPlayer) cellClasses.push(`current-${currentPlayer.toLowerCase()}`)

  return (
    <button
      className={cellClasses.join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  )
}

export default Cell
