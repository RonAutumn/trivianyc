/*
  # Initial Schema Setup for NYC Subway Trivia

  1. New Tables
    - users
      - id (uuid, primary key)
      - nickname (text)
      - high_score (integer)
      - games_played (integer)
      - created_at (timestamp)
    
    - questions
      - id (uuid, primary key)
      - question (text)
      - options (jsonb)
      - correct_answer (text)
      - category (text)
      - difficulty (text)
      - created_at (timestamp)
    
    - game_sessions
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - score (integer)
      - questions_answered (integer)
      - completed (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL,
  high_score integer DEFAULT 0,
  games_played integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create game_sessions table
CREATE TABLE game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users,
  score integer DEFAULT 0,
  questions_answered integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Questions are readable by all users"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their own game sessions"
  ON game_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);