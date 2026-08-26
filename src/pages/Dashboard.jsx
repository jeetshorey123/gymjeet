import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { blueprint } from '../data/blueprint'
import { CheckCircle, Save, Calendar, Scale, Utensils, Trash2, Plus } from 'lucide-react'

export default function Dashboard({ user }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDay, setSelectedDay] = useState(1)
  const [weight, setWeight] = useState('')
  const [exercises, setExercises] = useState([])
  const [sessionSaved, setSessionSaved] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const currentPlan = blueprint.days.find(d => d.id === selectedDay)

  // Initialize exercises state when day changes
  useEffect(() => {
    if (currentPlan) {
      const allList = [...(currentPlan.warmup || []), ...(currentPlan.exercises || [])]
      
      setExercises(allList.map(ex => {
        const numSets = parseInt(ex.sets) || 1
        const setsData = Array.from({ length: numSets }).map(() => ({
          reps: ex.reps || '',
          weight: ex.isWarmup ? '' : 10,
          completed: false
        }))
        return {
          ...ex,
          setsData
        }
      }))
      setSessionSaved(false)
      setSessionId(null)
    }
  }, [selectedDay, currentPlan])

  // Fetch existing data for this date
  useEffect(() => {
    const fetchExistingData = async () => {
      if (user.id === 'local-id') return;
      
      try {
        const { data: weightData } = await supabase
          .from('daily_weights')
          .select('weight')
          .eq('user_id', user.id)
          .eq('date', date)
          .single()
        
        if (weightData) setWeight(weightData.weight)
        else setWeight('')

        const { data: sessionData } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', date)
          .single()
        
        if (sessionData) {
          setSessionSaved(true)
          setSessionId(sessionData.id)
          setSelectedDay(parseInt(sessionData.day_plan.replace('DAY ', '')))
          
          const { data: logsData } = await supabase
            .from('exercise_logs')
            .select('*')
            .eq('session_id', sessionData.id)
            
          if (logsData && logsData.length > 0) {
            const logIds = logsData.map(l => l.id)
            const { data: setsData } = await supabase
              .from('exercise_sets')
              .select('*')
              .in('log_id', logIds)
              .order('set_number', { ascending: true })

            setExercises(prev => prev.map(ex => {
              const log = logsData.find(l => l.exercise_name === ex.name && !!l.is_warmup === !!ex.isWarmup)
              if (log && setsData) {
                const mySets = setsData.filter(s => s.log_id === log.id).map(s => ({
                  reps: s.reps || '',
                  weight: (s.weight_kg !== null && s.weight_kg !== undefined) ? s.weight_kg : (ex.isWarmup ? '' : 10),
                  completed: s.completed
                }))
                return {
                  ...ex,
                  setsData: mySets.length > 0 ? mySets : ex.setsData
                }
              }
              return ex
            }))
          }
        } else {
          setSessionSaved(false)
          setSessionId(null)
          if (currentPlan) {
            const allList = [...(currentPlan.warmup || []), ...(currentPlan.exercises || [])]
              setExercises(allList.map(ex => {
              const numSets = parseInt(ex.sets) || 1
              return {
                ...ex,
                setsData: Array.from({ length: numSets }).map(() => ({
                  reps: ex.reps || '', weight: ex.isWarmup ? '' : 10, completed: false
                }))
              }
            }))
          }
        }
      } catch (err) {
        console.error("Error fetching data", err)
      }
    }
    fetchExistingData()
  }, [date, user.id])

  const handleSetChange = (exIndex, setIndex, field, value) => {
    const newEx = [...exercises]
    newEx[exIndex].setsData[setIndex][field] = value
    setExercises(newEx)
  }

  const addSet = (exIndex) => {
    const newEx = [...exercises]
    const currentSets = newEx[exIndex].setsData;
    const lastSet = currentSets[currentSets.length - 1];
    currentSets.push({
      reps: lastSet ? lastSet.reps : '',
      weight: lastSet && lastSet.weight ? lastSet.weight : (newEx[exIndex].isWarmup ? '' : 10),
      completed: false
    })
    setExercises(newEx)
  }

  const removeSet = (exIndex, setIndex) => {
    const newEx = [...exercises]
    newEx[exIndex].setsData.splice(setIndex, 1)
    setExercises(newEx)
  }

  const calculateCalories = () => {
    let totalCals = 0;
    exercises.forEach(ex => {
      ex.setsData.forEach(set => {
        if (set.completed) {
          if (ex.isWarmup) {
            totalCals += 10;
          } else {
            const w = parseFloat(set.weight) || 0;
            const r = parseInt(set.reps) || 0;
            totalCals += 5 + (w * r * 0.003); 
          }
        }
      })
    })
    return Math.round(totalCals);
  }

  const saveDay = async () => {
    if (user.id === 'local-id') {
      alert("Saved locally! (Connect Supabase for cloud sync)")
      setSessionSaved(true)
      return;
    }

    try {
      if (weight) {
        await supabase.from('daily_weights').upsert({
          user_id: user.id,
          date: date,
          weight: parseFloat(weight)
        }, { onConflict: 'user_id,date' })
      }

      const isCompleted = exercises.some(ex => ex.setsData.some(s => s.completed));
      const cals = calculateCalories();

      const { data: sessionData, error: sessionError } = await supabase
        .from('workout_sessions')
        .upsert({
          user_id: user.id,
          date: date,
          day_plan: `DAY ${selectedDay}`,
          completed: isCompleted,
          calories_burned: cals
        }, { onConflict: 'user_id,date' })
        .select()
        .single()
        
      if (sessionError) throw sessionError;

      if (sessionData) {
        setSessionId(sessionData.id)
        // Delete old logs (cascade deletes sets)
        await supabase.from('exercise_logs').delete().eq('session_id', sessionData.id)
        
        // 1. Insert logs
        const logsToInsert = exercises.map(ex => ({
          session_id: sessionData.id,
          exercise_name: ex.name,
          target_muscle: ex.muscle,
          is_warmup: !!ex.isWarmup,
          completed: ex.setsData.some(s => s.completed)
        }))
        
        const { data: insertedLogs, error: logError } = await supabase.from('exercise_logs').insert(logsToInsert).select()
        
        if (logError) throw logError;

        // 2. Insert sets
        const setsToInsert = []
        exercises.forEach(ex => {
          const matchingLog = insertedLogs.find(l => l.exercise_name === ex.name && !!l.is_warmup === !!ex.isWarmup)
          if (matchingLog) {
            ex.setsData.forEach((set, idx) => {
              setsToInsert.push({
                log_id: matchingLog.id,
                set_number: idx + 1,
                reps: parseInt(set.reps) || 0,
                weight_kg: parseFloat(set.weight) || null,
                completed: set.completed
              })
            })
          }
        })

        if (setsToInsert.length > 0) {
          const { error: setError } = await supabase.from('exercise_sets').insert(setsToInsert)
          if (setError) throw setError
        }
      }
      
      setSessionSaved(true)
      alert("Workout and data saved successfully!")
    } catch (err) {
      console.error(err)
      alert("Error saving data. Check console.")
    }
  }

  const deleteSession = async () => {
    if (!sessionId) return;
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await supabase.from('workout_sessions').delete().eq('id', sessionId)
        setSessionSaved(false)
        setSessionId(null)
        const allList = [...(currentPlan.warmup || []), ...(currentPlan.exercises || [])]
        setExercises(allList.map(ex => ({
          ...ex,
          setsData: Array.from({ length: parseInt(ex.sets) || 1 }).map(() => ({
            reps: ex.reps || '', weight: '', completed: false
          }))
        })))
        alert("Workout deleted!")
      } catch (err) {
        console.error(err)
        alert("Error deleting workout.")
      }
    }
  }

  return (
    <div>
      <div className="grid-2">
        <div className="card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Calendar color="#FF6B00" /> Log Workout
          </h2>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Blueprint Day</label>
              <select 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px' }}
              >
                {blueprint.days.map(d => (
                  <option key={d.id} value={d.id}>Day {d.id} - {d.type}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>
              <Scale size={16} style={{display:'inline', marginRight:'5px', verticalAlign:'text-bottom'}}/> 
              Body Weight (kg)
            </label>
            <input type="number" step="0.1" placeholder="e.g. 80.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>

          <h3 style={{ color: 'var(--accent-orange)', marginBottom: '15px' }}>{currentPlan.name}</h3>
          
          {exercises.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Rest day! Enjoy your recovery.</p>
          ) : (
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {exercises.map((ex, exIdx) => (
                <div key={exIdx} style={{ background: ex.isWarmup ? 'rgba(255, 107, 0, 0.05)' : 'rgba(30, 30, 30, 0.75)', padding: '15px', borderRadius: '8px', borderLeft: ex.isWarmup ? '4px solid #FF6B00' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '16px' }}>{ex.name}</strong>
                      {ex.isWarmup && <span style={{ marginLeft: '10px', fontSize: '11px', background: '#FF6B00', padding: '2px 6px', borderRadius: '4px' }}>WARM-UP</span>}
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ex.muscle}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px 30px', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>
                    <div>SET</div>
                    <div>REPS</div>
                    <div>WEIGHT (kg)</div>
                    <div style={{ textAlign: 'center' }}>DONE</div>
                    <div></div>
                  </div>
                  
                  {ex.setsData.map((set, setIdx) => (
                    <div key={setIdx} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 40px 30px', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                      <div style={{ fontWeight: 'bold' }}>{setIdx + 1}</div>
                      <input 
                        type="number" 
                        value={set.reps} 
                        onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', e.target.value)}
                        placeholder="Reps"
                      />
                      <input 
                        type="number" 
                        step="0.5"
                        value={set.weight} 
                        onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                        placeholder={ex.isWarmup ? "-" : "kg"}
                        disabled={ex.isWarmup}
                        style={{ opacity: ex.isWarmup ? 0.3 : 1 }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={set.completed} 
                          onChange={(e) => handleSetChange(exIdx, setIdx, 'completed', e.target.checked)} 
                        />
                      </div>
                      <button 
                        onClick={() => removeSet(exIdx, setIdx)}
                        style={{ padding: '5px', background: 'transparent', color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addSet(exIdx)}
                    style={{ marginTop: '10px', padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    className="secondary"
                  >
                    <Plus size={14} /> Add Set
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={saveDay} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              {sessionSaved ? <CheckCircle size={18} /> : <Save size={18} />}
              {sessionSaved ? 'UPDATE SESSION' : 'SAVE SESSION'}
            </button>
            {sessionSaved && (
              <button onClick={deleteSession} style={{ background: '#d32f2f' }}>
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Utensils color="#FF6B00" /> Diet Plan
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'rgba(30, 30, 30, 0.5)', padding: '15px', borderRadius: '4px' }}>
                <strong style={{ color: 'var(--accent-orange)' }}>PRE-WORKOUT</strong>
                <p>{currentPlan.diet.pre}</p>
              </div>
              {currentPlan.diet.post && (
                <div style={{ background: 'rgba(30, 30, 30, 0.5)', padding: '15px', borderRadius: '4px' }}>
                  <strong style={{ color: 'var(--accent-orange)' }}>POST-WORKOUT</strong>
                  <p>{currentPlan.diet.post}</p>
                </div>
              )}
              <div style={{ background: 'rgba(30, 30, 30, 0.5)', padding: '15px', borderRadius: '4px' }}>
                <strong style={{ color: 'var(--accent-orange)' }}>LUNCH</strong>
                <p>{currentPlan.diet.lunch}</p>
              </div>
              <div style={{ background: 'rgba(30, 30, 30, 0.5)', padding: '15px', borderRadius: '4px' }}>
                <strong style={{ color: 'var(--accent-orange)' }}>SNACK</strong>
                <p>{currentPlan.diet.snack}</p>
              </div>
              <div style={{ background: 'rgba(30, 30, 30, 0.5)', padding: '15px', borderRadius: '4px' }}>
                <strong style={{ color: 'var(--accent-orange)' }}>DINNER</strong>
                <p>{currentPlan.diet.dinner}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
