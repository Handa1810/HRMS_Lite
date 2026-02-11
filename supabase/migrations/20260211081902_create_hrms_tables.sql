/*
  # HRMS Database Schema

  ## Overview
  Creates the complete database schema for the HR Management System including employees and attendance tracking.

  ## Tables Created
  
  ### 1. employees
  - `id` (serial, primary key) - Auto-incrementing employee ID
  - `employee_id` (text, unique) - Human-readable employee identifier (e.g., EMP-001)
  - `full_name` (text) - Employee's full name
  - `email` (text, unique) - Employee's email address
  - `department` (text) - Department name
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ### 2. attendance
  - `id` (serial, primary key) - Auto-incrementing attendance record ID
  - `employee_id` (text) - References employees.employee_id
  - `date` (date) - Attendance date
  - `status` (text) - Attendance status (Present/Absent)
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Indexes
  - Unique index on (employee_id, date) to prevent duplicate attendance records
  - Index on employee_id for faster lookups
  - Index on date for date-range queries

  ## Security
  - Row Level Security (RLS) enabled on both tables
  - Public read/write access policies (can be restricted based on auth requirements)
  
  ## Constraints
  - Foreign key constraint linking attendance to employees
  - Check constraint ensuring status is either 'Present' or 'Absent'
  - Unique constraint preventing duplicate employee_ids and emails
*/

-- Create employees table
-- Sequence for employee_code generation
CREATE SEQUENCE IF NOT EXISTS employee_code_seq START 1;

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  -- Human-readable employee code (e.g. Emp-001). Uses sequence for default generation.
  employee_code TEXT NOT NULL DEFAULT CONCAT('Emp-', LPAD(nextval('employee_code_seq')::text, 3, '0')),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
  ,
  CONSTRAINT employees_employee_code_unique UNIQUE (employee_code)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent')),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_employee
    FOREIGN KEY (employee_id)
    REFERENCES employees(employee_id)
    ON DELETE CASCADE,
  CONSTRAINT unique_attendance UNIQUE (employee_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for employees table
CREATE POLICY "Allow public read access to employees"
  ON employees
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to employees"
  ON employees
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to employees"
  ON employees
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to employees"
  ON employees
  FOR DELETE
  USING (true);

-- Create RLS policies for attendance table
CREATE POLICY "Allow public read access to attendance"
  ON attendance
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to attendance"
  ON attendance
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to attendance"
  ON attendance
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to attendance"
  ON attendance
  FOR DELETE
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Populate `employee_code` for existing rows (if any) using the sequence
UPDATE employees
SET employee_code = CONCAT('Emp-', LPAD(nextval('employee_code_seq')::text, 3, '0'))
WHERE employee_code IS NULL;
