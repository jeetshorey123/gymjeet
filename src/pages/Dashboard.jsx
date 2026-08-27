import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { blueprint } from '../data/blueprint'
import { CheckCircle, Save, Calendar, Scale, Utensils, Trash2, Plus, Activity, ChevronLeft, ChevronRight, Info, X, Flame } from 'lucide-react'
import Model from 'react-body-highlighter'

export default function Dashboard({ user }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDay, setSelectedDay] = useState(1)
  const [weight, setWeight] = useState('')
  const [exercises, setExercises] = useState([])
  const [sessionSaved, setSessionSaved] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [recentWorkouts, setRecentWorkouts] = useState([])
  const [recentPage, setRecentPage] = useState(0)
  const [totalRecent, setTotalRecent] = useState(0)
  const [infoModal, setInfoModal] = useState(null)

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

  // Fetch recent workouts with pagination
  useEffect(() => {
    const fetchRecent = async () => {
      if (user.id === 'local-id') return;
      try {
        const { data: recentData, count } = await supabase
          .from('workout_sessions')
          .select(`
            date, day_plan, completed,
            exercise_logs (
              is_warmup,
              completed
            )
          `, { count: 'exact' })
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .range(recentPage * 10, (recentPage + 1) * 10 - 1)
        
        if (recentData) {
          const dates = recentData.map(d => d.date)
          const { data: weightData } = await supabase
            .from('daily_weights')
            .select('date, weight')
            .in('date', dates)
            .eq('user_id', user.id)
            
          const enriched = recentData.map(session => {
            const w = weightData?.find(wd => wd.date === session.date)
            const warmups = session.exercise_logs?.filter(l => l.is_warmup) || []
            const exercises = session.exercise_logs?.filter(l => !l.is_warmup) || []
            return {
              ...session,
              weight: w ? w.weight : '-',
              warmupsDone: warmups.filter(l => l.completed).length,
              warmupsTotal: warmups.length,
              exDone: exercises.filter(l => l.completed).length,
              exTotal: exercises.length
            }
          })
          setRecentWorkouts(enriched)
          if (count !== null) setTotalRecent(count)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchRecent()
  }, [user.id, recentPage, sessionSaved])

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

  const calculateSetCalories = (exName, R, W, UW, isWarmup) => {
    const MOBILITY_FACTOR = 0.0025;
    const HEAVY_COMPOUND_BASE = 0.30;
    const HEAVY_COMPOUND_MULT = 0.005;
    const ISOLATION_BASE = 0.15;
    const ISOLATION_MULT = 0.002;
    const MET_ROWING = 7.0;
    const MET_HIGH_KNEES = 8.0;
    const MET_HOLLOW_ROCK = 4.0;
    const MET_HIIT_SPRINT = 12.0;
    const MET_PLANK = 4.0;
    const MET_STAIRMASTER = 8.0;

    let cals = 0;
    if (isWarmup) {
      if (exName.includes("Deep Squat Pry")) {
        cals = (R / 60) * 3.5 * (UW / 60);
      } else if (exName.includes("Pogo Jumps")) {
        cals = (R / 60) * 5.0 * (UW / 60);
      } else if (exName.includes("High-Knee Sprints") || exName.includes("Mountain Climbers")) {
        cals = (R / 60) * MET_HIGH_KNEES * (UW / 60);
      } else if (exName.includes("Hollow Body Rocks")) {
        cals = (R / 60) * MET_HOLLOW_ROCK * (UW / 60);
      } else {
        const repsMultiplier = exName.includes("(per pos)") ? 3 : 1;
        cals = (R * repsMultiplier) * (UW * MOBILITY_FACTOR);
      }
    } else {
      const isHeavyCompound = [
        "Barbell Back Squats", "Romanian Deadlifts", "Leg Press",
        "Decline DB Press", "Weighted Dips", "Bent-Over Barbell Rows",
        "Bent-Over Barbell Rows (Overhand Grip)", "Wide-Grip Pulldowns",
        "Wide-Grip Lat Pulldowns", "Seated Overhead Press", 
        "Seated Overhead Dumbbell Press", "Incline Barbell Bench", 
        "Incline Barbell Bench Press", "Seated Cable Rows (Wide Grip)"
      ].includes(exName);

      if (exName.includes("Treadmill HIIT") || exName.includes("Assault Bike or Treadmill HIIT")) {
        cals = R * MET_HIIT_SPRINT * (UW / 60);
      } else if (exName.includes("Stairmaster") || exName.includes("High-Incline Walk")) {
        cals = R * MET_STAIRMASTER * (UW / 60);
      } else if (exName.includes("Rowing") || exName.includes("Cycling") || exName.includes("Assault Bike")) {
        cals = R * MET_ROWING * (UW / 60);
      } else if (exName.includes("Weighted Plank") || exName.includes("Plank")) {
        cals = (R / 60) * MET_PLANK * (UW / 60);
      } else if (isHeavyCompound) {
        cals = (R * HEAVY_COMPOUND_BASE) + (R * W * HEAVY_COMPOUND_MULT) + (UW * 0.03);
      } else {
        cals = (R * ISOLATION_BASE) + (R * W * ISOLATION_MULT) + (UW * 0.015);
      }
    }
    return cals;
  };

  const calculateCalories = () => {
    let totalCals = 0;
    const UW = parseFloat(weight) || 85;

    exercises.forEach(ex => {
      ex.setsData.forEach(set => {
        if (set.completed) {
          const R = parseInt(set.reps) || 0;
          const W = parseFloat(set.weight) || 0;
          totalCals += calculateSetCalories(ex.name, R, W, UW, ex.isWarmup);
        }
      })
    })
    return Math.round(totalCals);
  }

  const calculateSingleSetCalories = (ex) => {
    if (!ex) return 0;
    
    let R = 0;
    let W = 0;
    
    if (ex.setsData && ex.setsData.length > 0) {
      R = parseInt(ex.setsData[0].reps) || parseInt(ex.reps) || (ex.isWarmup ? 15 : 10);
      W = parseFloat(ex.setsData[0].weight) || 0;
    } else {
      R = parseInt(ex.reps) || (ex.isWarmup ? 15 : 10);
      W = 0;
    }
    
    const UW = parseFloat(weight) || 85;
    const cals = calculateSetCalories(ex.name, R, W, UW, ex.isWarmup);
    return cals.toFixed(1);
  };

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
          
          <div className="date-day-row">
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Blueprint Day</label>
              <select 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '16px' }}>{ex.name}</strong>
                        <button 
                          onClick={() => setInfoModal({ ...ex, day: selectedDay })}
                          style={{ background: 'rgba(255, 107, 0, 0.1)', border: 'none', color: '#FF6B00', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', borderRadius: '50%' }}
                          title="View Details"
                        >
                          <Info size={16} />
                        </button>
                        {ex.isWarmup && <span style={{ marginLeft: '10px', fontSize: '11px', background: '#FF6B00', padding: '2px 6px', borderRadius: '4px' }}>WARM-UP</span>}
                      </div>
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
          
          <div className="card" style={{ marginTop: '20px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Activity color="#FF6B00" /> Recent Workouts
            </h2>
            {recentWorkouts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No recent workouts found.</p>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentWorkouts.map((session, idx) => (
                    <div key={idx} style={{ background: 'rgba(30, 30, 30, 0.5)', padding: '15px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: session.completed ? '4px solid #4caf50' : '4px solid #d32f2f' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: 'white' }}>{session.date}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--accent-orange)' }}>{session.weight !== '-' ? `${session.weight} kg` : '-'}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>{session.day_plan}</div>
                        <div style={{ fontSize: '11px', color: '#a0a0a0', marginTop: '5px', display: 'flex', gap: '10px' }}>
                          <span>Warmups: {session.warmupsDone}/{session.warmupsTotal}</span>
                          <span>Exercises: {session.exDone}/{session.exTotal}</span>
                        </div>
                      </div>
                      <div style={{ marginLeft: '15px' }}>
                        {session.completed ? <CheckCircle size={20} color="#4caf50" /> : <span style={{fontSize: '12px', color: '#d32f2f'}}>Missed</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <button 
                    className="secondary" 
                    onClick={() => setRecentPage(p => Math.max(0, p - 1))} 
                    disabled={recentPage === 0}
                    style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Page {recentPage + 1} of {Math.ceil(totalRecent / 10) || 1}
                  </span>
                  <button 
                    className="secondary" 
                    onClick={() => setRecentPage(p => Math.min(Math.ceil(totalRecent / 10) - 1, p + 1))} 
                    disabled={recentPage >= Math.ceil(totalRecent / 10) - 1}
                    style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {infoModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setInfoModal(null)}
              style={{ position: 'absolute', right: '15px', top: '15px', background: 'transparent', border: 'none', color: 'white' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ color: 'var(--accent-orange)', marginBottom: '15px', paddingRight: '30px' }}>{infoModal.name}</h2>
            
            <img 
              src={`/images/${infoModal.day}_${infoModal.name.split(' (')[0].replace(/\//g, '-')}.jpg`} 
              alt={infoModal.name}
              onError={(e) => { e.target.style.display = 'none'; }}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '20px', display: 'block' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '15px' }}>
              <div>
                {infoModal.steps && (
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: 'var(--accent-orange)' }}>Steps:</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '5px' }}>{infoModal.steps}</p>
                  </div>
                )}
                
                {infoModal.mistake && (
                  <div>
                    <strong style={{ color: '#d32f2f' }}>Mistake to Avoid:</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '5px' }}>{infoModal.mistake}</p>
                  </div>
                )}
                
                {!infoModal.steps && !infoModal.mistake && (
                  <p style={{ color: 'var(--text-muted)' }}>Detailed guide coming soon.</p>
                )}
              </div>
              
              <div style={{ background: '#111', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Model 
                  data={[{ name: infoModal.name, muscles: infoModal.targetMuscles || [] }]}
                  style={{ width: '12rem', padding: '1rem' }}
                  highlightedColors={['#FF6B00']}
                />
                <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', background: 'rgba(255,107,0,0.1)', padding: '6px 12px', borderRadius: '4px' }}>
                  <Flame size={14} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#FF6B00', marginBottom: '2px' }} />
                  Est. Burn: <strong style={{ color: '#fff' }}>~{calculateSingleSetCalories(infoModal)} kcal</strong> <span style={{fontSize: '11px'}}>/ set</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
