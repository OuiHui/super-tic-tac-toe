import React from 'react'

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

export default React.memo(Cell, (prev, next) => (
  prev.value === next.value &&
  prev.disabled === next.disabled &&
  prev.currentPlayer === next.currentPlayer &&
  prev.onClick === next.onClick
))
