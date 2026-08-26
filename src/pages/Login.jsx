import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Activity } from 'lucide-react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    const userLower = username.toLowerCase()
    const passLower = password.toLowerCase()

    // As requested, simple auth checking 'jeet' or 'guest'
    if ((userLower === 'jeet' && passLower === 'jeet') || 
        (userLower === 'guest' && passLower === 'guest')) {
      
      // Let's also check if user exists in our supabase users table (since we seeded it)
      // If we don't have supabase connected yet, fallback to direct login for dev
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', userLower)
          .eq('password', passLower)
          .single()
        
        if (data) {
          onLogin(data)
        } else {
          // If supabase fails but credentials match, allow for now 
          // (assuming db might not be setup yet by user)
          onLogin({ id: 'local-id', username })
        }
      } catch (err) {
        onLogin({ id: 'local-id', username })
      }
    } else {
      setError('Invalid credentials. Use jeet/jeet or guest/guest.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(17, 17, 17, 0.8), rgba(17, 17, 17, 0.9)), url(/bg1.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Activity color="#FF6B00" size={48} style={{ margin: '0 auto 20px' }} />
        <h1 style={{ marginBottom: '30px' }}>JeetFit Login</h1>
        
        {error && <div style={{ color: '#FF6B00', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={{ marginTop: '10px' }}>ELEVATE YOUR JOURNEY</button>
        </form>
      </div>
    </div>
  )
}
