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

-- Drop tables if they exist for clean relational schema
DROP TABLE IF EXISTS exercise_sets;
DROP TABLE IF EXISTS exercise_logs;

-- Exercise Logs (Master record for an exercise performed in a session)
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  target_muscle TEXT,
  is_warmup BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false
);

-- Exercise Sets (Child records for individual sets, reps, and weights)
CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID REFERENCES exercise_logs(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight_kg NUMERIC,
  completed BOOLEAN DEFAULT false
);

-- Insert initial users
INSERT INTO users (username, password) VALUES ('jeet', 'jeet') ON CONFLICT (username) DO NOTHING;
INSERT INTO users (username, password) VALUES ('guest', 'guest') ON CONFLICT (username) DO NOTHING;
