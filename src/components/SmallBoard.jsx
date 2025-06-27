import Cell from './Cell'

function SmallBoard({ boardIndex, board, isActive, winner, onCellClick, isMyTurn, currentPlayer }) {
  const boardClasses = ['small-board']
  if (isActive) {
    boardClasses.push('active')
    boardClasses.push(`active-${currentPlayer.toLowerCase()}`)
  }
  if (winner) {
    boardClasses.push('won')
    if (winner === 'X') boardClasses.push('x-winner')
    else if (winner === 'O') boardClasses.push('o-winner')
    else if (winner === 'tie') boardClasses.push('tie-winner')
  }

  return (
    <div className={boardClasses.join(' ')}>
      <div className="board-grid">
        {board.map((cell, cellIndex) => (
          <Cell
            key={cellIndex}
            value={cell}
            onClick={() => onCellClick(boardIndex, cellIndex)}
            disabled={!isActive || winner || cell || !isMyTurn}
            currentPlayer={currentPlayer}
          />
        ))}
      </div>
      
      {winner && (
        <div className={`board-winner ${winner.toLowerCase()}`}>
          {winner === 'tie' ? 'TIE' : winner}
        </div>
      )}
    </div>
  )
}

export default SmallBoard
