import { createContext, useContext, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue } from 'firebase/database'

const FirebaseContext = createContext()

const firebaseConfig = {
  apiKey: "AIzaSyB_rhlvpYmCEOFznXVVvoRRuIK2IqARF1s",
  authDomain: "super-tic-tac-toe-1d3ad.firebaseapp.com",
  databaseURL: "https://super-tic-tac-toe-1d3ad-default-rtdb.firebaseio.com",
  projectId: "super-tic-tac-toe-1d3ad",
  storageBucket: "super-tic-tac-toe-1d3ad.appspot.com",
  messagingSenderId: "983831058341",
  appId: "1:983831058341:web:d2e16c8de49a3202adfa4c",
  measurementId: "G-YLFYSTJY3Z"
}

export function FirebaseProvider({ children }) {
  const [app, setApp] = useState(null)
  const [database, setDatabase] = useState(null)

  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig)
    const db = getDatabase(firebaseApp)
    
    setApp(firebaseApp)
    setDatabase(db)
  }, [])

  return (
    <FirebaseContext.Provider value={{ app, database, ref, set, get, onValue }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}
