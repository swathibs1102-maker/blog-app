import { useEffect, useState } from 'react'

// Keeps a piece of state in sync with browser localStorage.
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key)
      return savedValue !== null ? JSON.parse(savedValue) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // The app can continue working even if localStorage is unavailable.
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
