import { useTimer } from '../hooks/useTimer'
import { formatTime } from '../utils/formatTime'

export default function Timer() {
  const { status, displayStudyMs, displayRestMs, start, pause, resume, stop } = useTimer()

  const isIdle = status === 'idle'
  const isRunning = status === 'running'
  const isPaused = status === 'paused'

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Status Badge */}
      <div className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase ${
        isRunning ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
        isPaused  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-500 border border-slate-700'
      }`}>
        {isRunning ? '● Focusing' : isPaused ? '⏸ Resting' : '○ Idle'}
      </div>

      {/* Main Clock */}
      <div className="text-center">
        <div className={`font-mono text-7xl font-bold tracking-tighter tabular-nums transition-colors duration-300 ${
          isRunning ? 'text-emerald-400' :
          isPaused  ? 'text-amber-400' :
                      'text-slate-600'
        }`}>
          {formatTime(displayStudyMs)}
        </div>
        <p className="mt-2 text-slate-500 text-sm uppercase tracking-widest">Study Time</p>
      </div>

      {/* Rest Time */}
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 ${
        isPaused
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <span className="text-slate-400 text-sm">Rest</span>
        <span className={`font-mono text-2xl font-semibold tabular-nums ${
          isPaused ? 'text-amber-400' : 'text-slate-500'
        }`}>
          {formatTime(displayRestMs)}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3">
        {isIdle && (
          <button
            onClick={start}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            Start
          </button>
        )}

        {isRunning && (
          <>
            <button
              onClick={pause}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
            >
              Pause
            </button>
            <button
              onClick={stop}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
            >
              Stop
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button
              onClick={resume}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              Resume
            </button>
            <button
              onClick={stop}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
            >
              Stop
            </button>
          </>
        )}
      </div>

      {/* Hint */}
      {isIdle && (
        <p className="text-slate-600 text-sm text-center">
          Press <span className="text-slate-400">Start</span> to begin a study session.<br />
          Pausing counts as rest time.
        </p>
      )}
    </div>
  )
}
