import { format, differenceInCalendarDays, parseISO } from 'date-fns'

/**
 * Returns today's date as YYYY-MM-DD string.
 */
export function todayStr() {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Recomputes the streak given the current streak object.
 * Only called when a qualifying session ends (studyMs >= 60000).
 *
 * @param {{ count: number, lastActiveDate: string|null }} current
 * @returns {{ count: number, lastActiveDate: string }}
 */
export function computeStreak(current) {
  const today = todayStr()

  // Already logged today — no change
  if (current.lastActiveDate === today) return current

  const last = current.lastActiveDate ? parseISO(current.lastActiveDate) : null
  const diff = last ? differenceInCalendarDays(parseISO(today), last) : null

  if (diff === 1) {
    // Consecutive day — extend streak
    return { count: (current.count || 0) + 1, lastActiveDate: today }
  } else {
    // First use or streak broken
    return { count: 1, lastActiveDate: today }
  }
}
