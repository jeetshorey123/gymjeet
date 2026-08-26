-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Daily Weight Logs
CREATE TABLE IF NOT EXISTS daily_weights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  weight NUMERIC NOT NULL,
  UNIQUE(user_id, date)
);

-- Workout Sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  day_plan TEXT NOT NULL,
  calories_burned NUMERIC DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, date)
);

-- Drop the old exercise_logs table if it exists as the schema is changing
DROP TABLE IF EXISTS exercise_logs;

-- Exercise Logs (Now supports JSONB sets and warmup flag)
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  target_muscle TEXT,
  is_warmup BOOLEAN DEFAULT false,
  sets_data JSONB NOT NULL, -- Format: [{ reps: 10, weight: 50, completed: true }]
  completed BOOLEAN DEFAULT false
);

-- Insert initial users
INSERT INTO users (username, password) VALUES ('jeet', 'jeet') ON CONFLICT (username) DO NOTHING;
INSERT INTO users (username, password) VALUES ('guest', 'guest') ON CONFLICT (username) DO NOTHING;
