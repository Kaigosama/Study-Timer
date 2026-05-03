/**
 * Formats milliseconds into HH:MM:SS string.
 * @param {number} ms - milliseconds
 * @returns {string} e.g. "01:23:45"
 */
export function formatTime(ms) {
  if (!ms || ms < 0) return '00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
}
