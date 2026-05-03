import { useState, useRef, useCallback } from 'react'
import { useStore } from './useStore'
import { computeStreak, todayStr } from '../utils/dateHelpers'

/**
 * Timer state machine:
 *   idle →[start]→ running →[pause]→ paused →[resume]→ running
 *                           →[stop]→  idle   (saves session)
 *   paused                  →[stop]→  idle   (saves session)
 *
 * Time is tracked using Date.now() wall-clock stamps — never setInterval counting.
 */
export function useTimer() {
  const { saveSession, getStreak, saveStreak } = useStore()

  // --- State ---
  const [status, setStatus] = useState('idle')       // 'idle' | 'running' | 'paused'
  const [displayStudyMs, setDisplayStudyMs] = useState(0)  // live-updating for the clock face
  const [displayRestMs, setDisplayRestMs] = useState(0)

  // --- Refs (don't cause re-renders) ---
  const intervalRef = useRef(null)
  const studyAccRef = useRef(0)    // accumulated study ms
  const restAccRef = useRef(0)     // accumulated rest ms
  const studyStartRef = useRef(null)  // Date.now() when we entered 'running'
  const pauseStartRef = useRef(null)  // Date.now() when we entered 'paused'

  // Kick off the display tick (updates every 100ms)
  const startTick = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      const liveStudy = studyAccRef.current + (Date.now() - studyStartRef.current)
      setDisplayStudyMs(liveStudy)
    }, 100)
  }, [])

  const stopTick = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  // --- Actions ---

  const start = useCallback(() => {
    if (status !== 'idle') return
    studyAccRef.current = 0
    restAccRef.current = 0
    studyStartRef.current = Date.now()
    setDisplayStudyMs(0)
    setDisplayRestMs(0)
    setStatus('running')
    startTick()
  }, [status, startTick])

  const pause = useCallback(() => {
    if (status !== 'running') return
    stopTick()
    // Flush current study segment into accumulator
    studyAccRef.current += Date.now() - studyStartRef.current
    studyStartRef.current = null
    // Record when rest started
    pauseStartRef.current = Date.now()
    setDisplayStudyMs(studyAccRef.current)
    setStatus('paused')
  }, [status, stopTick])

  const resume = useCallback(() => {
    if (status !== 'paused') return
    // Flush rest segment into accumulator
    restAccRef.current += Date.now() - pauseStartRef.current
    pauseStartRef.current = null
    setDisplayRestMs(restAccRef.current)
    // Start new study segment
    studyStartRef.current = Date.now()
    setStatus('running')
    startTick()
  }, [status, startTick])

  const stop = useCallback(() => {
    if (status === 'idle') return
    stopTick()

    let finalStudyMs = studyAccRef.current
    let finalRestMs = restAccRef.current

    if (status === 'running' && studyStartRef.current) {
      finalStudyMs += Date.now() - studyStartRef.current
    }
    if (status === 'paused' && pauseStartRef.current) {
      finalRestMs += Date.now() - pauseStartRef.current
    }

    // Save session first
    const session = {
      date: todayStr(),
      studyMs: finalStudyMs,
      restMs: finalRestMs,
      createdAt: new Date().toISOString(),
    }
    saveSession(session)

    // Update streak — only if session was at least 1 minute of study
    if (finalStudyMs >= 60000) {
      const currentStreak = getStreak()
      const updatedStreak = computeStreak(currentStreak)
      saveStreak(updatedStreak)
    }

    // Reset everything
    studyAccRef.current = 0
    restAccRef.current = 0
    studyStartRef.current = null
    pauseStartRef.current = null
    setDisplayStudyMs(0)
    setDisplayRestMs(0)
    setStatus('idle')
  }, [status, stopTick, saveSession, getStreak, saveStreak])

  return {
    status,
    displayStudyMs,
    displayRestMs,
    start,
    pause,
    resume,
    stop,
  }
}
