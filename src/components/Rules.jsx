function Rules({ currentPlayer }) {
  return (
    <div className={`rules ${currentPlayer?.toLowerCase()}-theme`}>
      <h3 className={`rules-title ${currentPlayer?.toLowerCase()}-glow`}>How to Play:</h3>
      <ul>
        <li>Win small grids by getting 3 in a row within each section</li>
        <li>Your move determines which grid your opponent plays in next</li>
        <li>If target grid is won or full, play anywhere available</li>
        <li>Win by getting 3 small grids in a row</li>
        <li>Blue glow shows your active playing area</li>
      </ul>
    </div>
  )
}

export default Rules
