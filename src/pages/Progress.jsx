import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Model from 'react-body-highlighter'
import { Activity, Flame, TrendingDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

// Helper to format date strings for different intervals
const formatInterval = (dateStr, interval) => {
  const d = new Date(dateStr)
  if (interval === 'Daily' || interval === 'Custom') return d.toISOString().split('T')[0]
  if (interval === 'Weekly') {
    const firstDay = new Date(d.setDate(d.getDate() - d.getDay()))
    return firstDay.toISOString().split('T')[0]
  }
  if (interval === 'Monthly') return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  if (interval === 'Yearly') return `${d.getFullYear()}`
  return dateStr
}

export default function Progress({ user }) {
  const [timeFilter, setTimeFilter] = useState('Daily')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  
  const [weights, setWeights] = useState([])
  const [sessions, setSessions] = useState([])
  const [logs, setLogs] = useState([])
  
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 14
  
  const [selectedSessionId, setSelectedSessionId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (user.id === 'local-id') return;

      try {
        const { data: wData } = await supabase.from('daily_weights').select('*').eq('user_id', user.id).order('date', { ascending: true })
        if (wData) setWeights(wData)

        const { data: sData } = await supabase.from('workout_sessions').select('*').eq('user_id', user.id).order('date', { ascending: false })
        if (sData) setSessions(sData)

        if (sData && sData.length > 0) {
          const sessionIds = sData.map(s => s.id)
          const { data: lData } = await supabase.from('exercise_logs').select('*').in('session_id', sessionIds)
          
          if (lData && lData.length > 0) {
            const logIds = lData.map(l => l.id)
            const { data: setsData } = await supabase.from('exercise_sets').select('*').in('log_id', logIds).order('set_number', { ascending: true })
            
            // Attach sets to logs for UI compatibility
            const enrichedLogs = lData.map(log => {
              const mySets = (setsData || []).filter(s => s.log_id === log.id)
              return {
                ...log,
                sets_data: mySets
              }
            })
            setLogs(enrichedLogs)
          } else {
            setLogs([])
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [user.id])

  // Apply Custom Date filtering
  const validWeights = useMemo(() => {
    if (timeFilter !== 'Custom') return weights;
    return weights.filter(w => (!customStart || w.date >= customStart) && (!customEnd || w.date <= customEnd));
  }, [weights, timeFilter, customStart, customEnd])

  const validSessions = useMemo(() => {
    if (timeFilter !== 'Custom') return sessions;
    return sessions.filter(s => (!customStart || s.date >= customStart) && (!customEnd || s.date <= customEnd));
  }, [sessions, timeFilter, customStart, customEnd])

  // Aggregate Data based on Time Filter
  const aggregatedWeight = useMemo(() => {
    const groups = {}
    validWeights.forEach(w => {
      const key = formatInterval(w.date, timeFilter)
      if (!groups[key]) groups[key] = []
      groups[key].push(Number(w.weight))
    })
    return Object.keys(groups).sort().map(date => {
      const avg = groups[date].reduce((a,b)=>a+b,0) / groups[date].length
      return { date, weight: avg.toFixed(1) }
    })
  }, [validWeights, timeFilter])

  const aggregatedWorkouts = useMemo(() => {
    const groups = {}
    validSessions.forEach(s => {
      const key = formatInterval(s.date, timeFilter)
      if (!groups[key]) groups[key] = 0
      groups[key] += Number(s.calories_burned || 0)
    })
    return Object.keys(groups).sort().map(date => ({
      date, calories: groups[date]
    }))
  }, [validSessions, timeFilter])

  const filteredLogs = useMemo(() => {
    if (!validSessions.length) return []
    
    if (timeFilter === 'Custom') {
      const validSessionIds = validSessions.map(s => s.id)
      return logs.filter(l => validSessionIds.includes(l.session_id) && l.completed)
    }

    const latestSession = validSessions[0]
    if (!latestSession) return logs
    
    const latestInterval = formatInterval(latestSession.date, timeFilter)
    const validSessionIds = validSessions
      .filter(s => formatInterval(s.date, timeFilter) === latestInterval)
      .map(s => s.id)
      
    return logs.filter(l => validSessionIds.includes(l.session_id) && l.completed)
  }, [validSessions, logs, timeFilter])

  const muscleData = useMemo(() => {
    const mapping = {
      "Lower Chest": "chest", "Lower Pec": "chest", "Nipple Area": "chest", "Upper Chest": "chest", "Burnout": "chest", "Pec Stretch": "chest",
      "Serratus": "obliques", "Core Twist": "obliques", "Handles": "obliques", "Obliques": "obliques",
      "Lower Abs": "abs", "Full Core": "abs", "Inner Core": "abs", "Anti-Ext.": "abs", "Total Core": "abs",
      "Lat/Armpit": "upper-back", "Mid-Back": "upper-back", "Back Width": "upper-back", "Rhomboids": "upper-back", "V-Taper": "upper-back", "Mid/Low Lat": "upper-back", "Core/Back": "upper-back", "Scapula": "upper-back",
      "Neck Posture": "trapezius", "Upper Traps": "trapezius", "Traps/Core": "trapezius", "Posture": "trapezius",
      "Bicep Peak": "biceps", "Arms": "biceps", "Biceps": "biceps",
      "Triceps": "triceps",
      "Forearms": "forearm",
      "Leg Mass": "quadriceps", "Quads": "quadriceps", "Func. Legs": "quadriceps", "Full Body": "quadriceps", "Legs": "quadriceps",
      "Hamstrings": "hamstrings", "Power": "hamstrings", "Post. Chain": "hamstrings",
      "Glutes": "gluteal",
      "Calves": "calves",
      "Delts": "front-deltoids", "Side Delts": "front-deltoids",
      "Rear Delts": "back-deltoids",
      "Fat Burn": "obliques", "Steady Burn": "obliques", "Flush": "quadriceps", "Cardio": "obliques"
    }
    return filteredLogs.map((log, i) => ({
      name: log.exercise_name || `Ex ${i}`,
      muscles: mapping[log.target_muscle] ? [mapping[log.target_muscle]] : []
    }))
  }, [filteredLogs])

  // Pagination for Detailed History
  const paginatedSessions = validSessions.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
  const totalPages = Math.ceil(validSessions.length / itemsPerPage)

  const selectedSessionData = selectedSessionId ? validSessions.find(s => s.id === selectedSessionId) : null
  const selectedSessionLogs = selectedSessionId ? logs.filter(l => l.session_id === selectedSessionId) : []
  const selectedSessionWeight = selectedSessionData ? validWeights.find(w => w.date === selectedSessionData.date) : null

  return (
    <div>
      {/* Filters */}
      <div className="card" style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Calendar size={20} color="var(--accent-orange)" />
        <strong>View By:</strong>
        {['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'].map(tf => (
          <button 
            key={tf} 
            className={timeFilter === tf ? '' : 'secondary'} 
            onClick={() => setTimeFilter(tf)}
            style={{ padding: '5px 15px', fontSize: '12px' }}
          >
            {tf}
          </button>
        ))}
        {timeFilter === 'Custom' && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>From:</span>
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} style={{ padding: '5px', fontSize: '12px' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>To:</span>
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} style={{ padding: '5px', fontSize: '12px' }} />
          </div>
        )}
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Weight Trend ({timeFilter})</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aggregatedWeight}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#A0A0A0" />
                <YAxis domain={['auto', 'auto']} stroke="#A0A0A0" />
                <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #FF6B00' }} />
                <Line type="monotone" dataKey="weight" stroke="#FF6B00" strokeWidth={3} dot={{ r: 5, fill: '#FF6B00' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Calories Burned ({timeFilter})</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregatedWorkouts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#A0A0A0" />
                <YAxis stroke="#A0A0A0" />
                <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #FF6B00' }} />
                <Bar dataKey="calories" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed History Table */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>Detailed Workout History</h3>
        
        {validSessions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No workouts found for this period.</p>
        ) : (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px' }}>Date</th>
                    <th style={{ padding: '10px' }}>Plan</th>
                    <th style={{ padding: '10px' }}>Weight (kg)</th>
                    <th style={{ padding: '10px' }}>Calories</th>
                    <th style={{ padding: '10px' }}>Warmups Done</th>
                    <th style={{ padding: '10px' }}>Exercises Done</th>
                    <th style={{ padding: '10px' }}>Hit Gym?</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSessions.map((session, idx) => {
                    const sessionLogs = logs.filter(l => l.session_id === session.id)
                    const warmups = sessionLogs.filter(l => l.is_warmup)
                    const ex = sessionLogs.filter(l => !l.is_warmup)
                    
                    const warmupsDone = warmups.filter(l => l.completed).length
                    const exDone = ex.filter(l => l.completed).length
                    
                    const sessionWeight = validWeights.find(w => w.date === session.date)?.weight || '-'
                    
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', background: selectedSessionId === session.id ? 'rgba(255, 107, 0, 0.1)' : 'transparent' }}>
                        <td style={{ padding: '10px' }}>{session.date}</td>
                        <td style={{ padding: '10px' }}>{session.day_plan}</td>
                        <td style={{ padding: '10px' }}>{sessionWeight}</td>
                        <td style={{ padding: '10px' }}>{session.calories_burned || 0}</td>
                        <td style={{ padding: '10px' }}>{warmupsDone} / {warmups.length}</td>
                        <td style={{ padding: '10px' }}>{exDone} / {ex.length}</td>
                        <td style={{ padding: '10px' }}>{session.completed ? <span style={{ color: '#4caf50' }}>✓ Yes</span> : <span style={{ color: '#d32f2f' }}>✗ No</span>}</td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => setSelectedSessionId(session.id)} style={{ padding: '5px 10px', fontSize: '12px' }}>View Sets</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <button 
                className="secondary" 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                disabled={currentPage === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Page {currentPage + 1} of {totalPages}</span>
              <button 
                className="secondary" 
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} 
                disabled={currentPage === totalPages - 1}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid-2">
        {/* Drill-down View */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Day Breakdown</h3>
          {!selectedSessionData ? (
            <p style={{ color: 'var(--text-muted)' }}>Select a session from the table to view its detailed sets and reps.</p>
          ) : (
            <div>
              <h4 style={{ color: 'var(--accent-orange)', marginBottom: '15px' }}>{selectedSessionData.date} - {selectedSessionData.day_plan}</h4>
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                {selectedSessionLogs.map((log, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: '4px', marginBottom: '10px', borderLeft: log.is_warmup ? '4px solid #FF6B00' : '4px solid #4caf50' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>{log.exercise_name}</strong>
                      {log.completed ? <CheckCircle size={16} color="#4caf50" /> : <span style={{fontSize: '12px', color: '#d32f2f'}}>Missed</span>}
                    </div>
                    <table style={{ width: '100%', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Set</th>
                          <th style={{ textAlign: 'left' }}>Reps</th>
                          <th style={{ textAlign: 'left' }}>Weight (kg)</th>
                          <th style={{ textAlign: 'left' }}>Done</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(log.sets_data || []).map((set, sIdx) => (
                          <tr key={sIdx}>
                            <td>{set.set_number}</td>
                            <td>{set.reps}</td>
                            <td>{set.weight_kg || '-'}</td>
                            <td>{set.completed ? '✓' : '✗'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3D Muscle Heatmap */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="#FF6B00" /> Target Heatmap ({timeFilter === 'Custom' ? 'Custom Range' : 'Latest ' + timeFilter})
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px' }}>
            Visualizes muscle fatigue for the {timeFilter === 'Custom' ? 'selected custom dates' : 'most recent period based on your active filter'}.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--accent-orange)', marginBottom: '10px' }}>FRONT</h4>
              <Model
                data={muscleData}
                style={{ width: '180px' }}
                type="anterior"
                highlightedColors={['#ff8c42', '#ff6b00', '#cc5500', '#994000']}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--accent-orange)', marginBottom: '10px' }}>BACK</h4>
              <Model
                data={muscleData}
                style={{ width: '180px' }}
                type="posterior"
                highlightedColors={['#ff8c42', '#ff6b00', '#cc5500', '#994000']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
