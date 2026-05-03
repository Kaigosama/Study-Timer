import { useState, useEffect } from 'react'
import { useStore } from '../hooks/useStore'

/** Motivational messages based on streak count */
function getMessage(count) {
  if (count === 0) return 'Start a session to begin your streak!'
  if (count === 1) return "Great start! Come back tomorrow to keep it going."
  if (count < 5)  return "You're building momentum — keep it up!"
  if (count < 10) return "Solid streak! Consistency is key."
  if (count < 20) return "You're on fire! 🔥 Keep the habit going."
  if (count < 30) return "Incredible discipline. You're crushing it!"
  return "Legendary. You're an absolute study machine."
}

export default function Streak({ onSessionSaved }) {
  const { getStreak } = useStore()
  const [streak, setStreak] = useState({ count: 0, lastActiveDate: null })

  const refresh = () => setStreak(getStreak())

  useEffect(() => {
    refresh()
  }, [onSessionSaved]) // re-reads whenever a session is saved

  const { count } = streak
  const hasStreak = count > 0

  return (
    <div className={`w-full max-w-md mx-auto mt-6 rounded-xl border px-5 py-4 flex items-center gap-4 transition-all ${
      hasStreak
        ? 'bg-orange-500/10 border-orange-500/30'
        : 'bg-slate-900 border-slate-800'
    }`}>
      {/* Flame icon */}
      <div className={`text-4xl select-none ${hasStreak ? '' : 'grayscale opacity-30'}`}>
        🔥
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold tabular-nums ${hasStreak ? 'text-orange-400' : 'text-slate-600'}`}>
            {count}
          </span>
          <span className={`text-sm font-medium ${hasStreak ? 'text-orange-300' : 'text-slate-600'}`}>
            {count === 1 ? 'day streak' : 'day streak'}
          </span>
        </div>
        <p className={`text-xs mt-0.5 truncate ${hasStreak ? 'text-orange-200/70' : 'text-slate-600'}`}>
          {getMessage(count)}
        </p>
      </div>

      {/* Calendar badge */}
      {streak.lastActiveDate && (
        <div className="shrink-0 text-right">
          <p className="text-xs text-slate-500">Last active</p>
          <p className="text-xs font-medium text-slate-400">{streak.lastActiveDate}</p>
        </div>
      )}
    </div>
  )
}
