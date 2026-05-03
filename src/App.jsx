import { useState, useCallback } from 'react'
import Timer from './components/Timer'
import Dashboard from './components/Dashboard'
import Streak from './components/Streak'

export default function App() {
  const [activeTab, setActiveTab] = useState('timer')
  // Increments every time a session is saved — used to trigger Streak refresh
  const [sessionSaved, setSessionSaved] = useState(0)

  const handleSessionSaved = useCallback(() => {
    setSessionSaved((n) => n + 1)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-bold tracking-tight text-white">Study Timer</h1>
        </div>

        {/* Tab Navigation */}
        <nav className="flex gap-1 bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'timer'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⏱ Timer
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center p-6 pt-10">
        {activeTab === 'timer' && (
          <div className="flex flex-col items-center w-full">
            <Timer onSessionSaved={handleSessionSaved} />
            <Streak onSessionSaved={sessionSaved} />
          </div>
        )}
        {activeTab === 'dashboard' && <Dashboard sessionSaved={sessionSaved} />}
      </main>
    </div>
  )
}
