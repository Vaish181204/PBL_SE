/*
  # Initial Schema for Road Accident Analysis

  1. New Tables
    - `accidents`
      - `id` (uuid, primary key)
      - `location` (point, not null)
      - `vehicle_type` (text, not null)
      - `speed` (integer)
      - `weather_condition` (text)
      - `road_condition` (text)
      - `severity` (integer)
      - `survival_probability` (decimal)
      - `created_at` (timestamp with time zone)
      - `user_id` (uuid, foreign key to auth.users)

    - `emergency_facilities`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `location` (point, not null)
      - `type` (text, not null)
      - `capacity` (integer)
      - `created_at` (timestamp with time zone)

    - `risk_alerts`
      - `id` (uuid, primary key)
      - `location` (point, not null)
      - `risk_level` (text, not null)
      - `description` (text)
      - `active` (boolean)
      - `created_at` (timestamp with time zone)
      - `expires_at` (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable PostGIS extension for geographical data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Accidents table
CREATE TABLE IF NOT EXISTS accidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location geometry(Point, 4326) NOT NULL,
  vehicle_type text NOT NULL,
  speed integer,
  weather_condition text,
  road_condition text,
  severity integer,
  survival_probability decimal,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Emergency facilities table
CREATE TABLE IF NOT EXISTS emergency_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location geometry(Point, 4326) NOT NULL,
  type text NOT NULL,
  capacity integer,
  created_at timestamptz DEFAULT now()
);

-- Risk alerts table
CREATE TABLE IF NOT EXISTS risk_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location geometry(Point, 4326) NOT NULL,
  risk_level text NOT NULL,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE accidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for accidents
CREATE POLICY "Users can read all accidents"
  ON accidents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own accidents"
  ON accidents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for emergency facilities
CREATE POLICY "Anyone can read emergency facilities"
  ON emergency_facilities
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for risk alerts
CREATE POLICY "Anyone can read active risk alerts"
  ON risk_alerts
  FOR SELECT
  TO authenticated
  USING (active = true);