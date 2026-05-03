import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { useStore } from '../hooks/useStore'
import { format, subDays, parseISO } from 'date-fns'

const MS_TO_HOURS = 1 / (1000 * 60 * 60)
const STUDY_COLOR = '#6366f1'  // indigo-500
const REST_COLOR  = '#f59e0b'  // amber-500

/** Format ms → "Xh Ym" */
function fmtHours(ms) {
  if (!ms || ms <= 0) return '0m'
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** Custom tooltip for bar chart */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm shadow-xl">
      <p className="font-semibold text-slate-200 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {fmtHours(p.value * 1000 * 60 * 60)}
        </p>
      ))}
    </div>
  )
}

/** Custom label for pie chart */
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function Dashboard({ sessionSaved }) {
  const { getSessions } = useStore()
  const [sessions, setSessions] = useState([])

  // Reload sessions on mount and whenever a new session is saved
  useEffect(() => {
    setSessions(getSessions())
  }, [sessionSaved])

  // Aggregate sessions by date
  const byDate = useMemo(() => {
    return sessions.reduce((acc, s) => {
      const d = s.date
      if (!acc[d]) acc[d] = { study: 0, rest: 0 }
      acc[d].study += s.studyMs || 0
      acc[d].rest  += s.restMs  || 0
      return acc
    }, {})
  }, [sessions])

  // Last 7 days bar chart data
  const barData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
      const label = format(parseISO(date), 'EEE')
      const day = byDate[date] || { study: 0, rest: 0 }
      return {
        name: label,
        Study: +(day.study * MS_TO_HOURS).toFixed(3),
        Rest:  +(day.rest  * MS_TO_HOURS).toFixed(3),
      }
    })
  }, [byDate])

  // All-time totals for pie chart
  const totals = useMemo(() => {
    return sessions.reduce(
      (acc, s) => ({ study: acc.study + (s.studyMs || 0), rest: acc.rest + (s.restMs || 0) }),
      { study: 0, rest: 0 }
    )
  }, [sessions])

  const pieData = [
    { name: 'Study', value: totals.study },
    { name: 'Rest',  value: totals.rest  },
  ]

  const isEmpty = sessions.length === 0

  // --- Summary Stats ---
  const totalStudyH = (totals.study * MS_TO_HOURS).toFixed(1)
  const totalRestH  = (totals.rest  * MS_TO_HOURS).toFixed(1)
  const totalDays   = Object.keys(byDate).length

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">📭</span>
          <p className="text-slate-400 text-lg font-medium">No sessions yet</p>
          <p className="text-slate-600 text-sm mt-1">Start your first timer to see your stats here.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-indigo-400">{totalStudyH}h</p>
              <p className="text-slate-500 text-sm mt-1">Total Study</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-400">{totalRestH}h</p>
              <p className="text-slate-500 text-sm mt-1">Total Rest</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{totalDays}</p>
              <p className="text-slate-500 text-sm mt-1">Days Tracked</p>
            </div>
          </div>

          {/* Bar Chart — Last 7 Days */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-slate-300 font-semibold mb-6">Last 7 Days (hours)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Legend
                  wrapperStyle={{ paddingTop: 16 }}
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 13 }}>{value}</span>}
                />
                <Bar dataKey="Study" fill={STUDY_COLOR} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rest"  fill={REST_COLOR}  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart — All-time ratio */}
          {(totals.study > 0 || totals.rest > 0) && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-slate-300 font-semibold mb-6">All-Time Study vs Rest</h3>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      dataKey="value"
                      labelLine={false}
                      label={<PieLabel />}
                    >
                      <Cell fill={STUDY_COLOR} />
                      <Cell fill={REST_COLOR} />
                    </Pie>
                    <Tooltip
                      formatter={(v) => fmtHours(v)}
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: STUDY_COLOR }} />
                    <div>
                      <p className="text-slate-300 font-medium">Study</p>
                      <p className="text-slate-500 text-sm">{fmtHours(totals.study)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: REST_COLOR }} />
                    <div>
                      <p className="text-slate-300 font-medium">Rest</p>
                      <p className="text-slate-500 text-sm">{fmtHours(totals.rest)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
