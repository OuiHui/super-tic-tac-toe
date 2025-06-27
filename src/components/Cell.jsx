function Cell({ value, onClick, disabled }) {
  const cellClasses = ['cell']
  if (value) cellClasses.push(value.toLowerCase())

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
