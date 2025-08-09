// Lightweight timer store using subscribe/getSnapshot pattern
// Avoids re-rendering the entire app every second; only subscribers update.

let subscribers = new Set()
let state = { x: 500, o: 500 }
let interval = null

export function initTimers(x = 500, o = 500) {
  state = { x, o }
  emit()
}

export function getSnapshot() {
  return state
}

export function subscribe(cb) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}

function emit() {
  subscribers.forEach(cb => cb())
}

export function startTicking(getCurrentPlayer, getGameOver, onTimeout) {
  stopTicking()
  interval = setInterval(() => {
    try {
      if (typeof getGameOver === 'function' && getGameOver()) return
      const player = typeof getCurrentPlayer === 'function' ? getCurrentPlayer() : 'X'
      const key = player === 'O' ? 'o' : 'x'
      const nextVal = Math.max(0, (state[key] ?? 0) - 1)
      const next = { ...state, [key]: nextVal }
      state = next
      emit()
      if (nextVal === 0 && typeof onTimeout === 'function') {
        // Notify once; caller should handle ending the game and stopping ticking
        onTimeout(player)
      }
    } catch (_) {
      // Fail-safe: stop ticking on unexpected errors
      stopTicking()
    }
  }, 1000)
}

export function stopTicking() {
  if (interval) clearInterval(interval)
  interval = null
}
