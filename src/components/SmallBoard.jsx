import Cell from './Cell'

function SmallBoard({ boardIndex, board, isActive, winner, onCellClick, isMyTurn }) {
  const boardClasses = ['small-board']
  if (isActive) boardClasses.push('active')
  if (winner) boardClasses.push('won')

  return (
    <div className={boardClasses.join(' ')}>
      <div className="board-grid">
        {board.map((cell, cellIndex) => (
          <Cell
            key={cellIndex}
            value={cell}
            onClick={() => onCellClick(boardIndex, cellIndex)}
            disabled={!isActive || winner || cell || !isMyTurn}
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
