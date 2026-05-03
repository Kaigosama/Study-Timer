/**
 * useStore — ALL localStorage access is isolated here.
 * No other file should read/write localStorage directly.
 * This makes future migration (e.g. to Supabase) a single-file change.
 */

const SESSIONS_KEY = 'sessions'
const STREAK_KEY = 'streak'

export function useStore() {
  /**
   * Append a session to the sessions array.
   * @param {{ date: string, studyMs: number, restMs: number, createdAt: string }} session
   */
  const saveSession = (session) => {
    const existing = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]')
    localStorage.setItem(SESSIONS_KEY, JSON.stringify([...existing, session]))
  }

  /**
   * Return all sessions.
   * @returns {Array}
   */
  const getSessions = () => {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]')
  }

  /**
   * Return the current streak object.
   * @returns {{ count: number, lastActiveDate: string|null }}
   */
  const getStreak = () => {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastActiveDate":null}')
  }

  /**
   * Persist an updated streak object.
   * @param {{ count: number, lastActiveDate: string }} streak
   */
  const saveStreak = (streak) => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak))
  }

  /**
   * Wipe all sessions and streak data from localStorage.
   */
  const clearAllData = () => {
    localStorage.removeItem(SESSIONS_KEY)
    localStorage.removeItem(STREAK_KEY)
  }

  return { saveSession, getSessions, getStreak, saveStreak, clearAllData }
}
