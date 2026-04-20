-- Run this as: psql -U postgres -c "CREATE DATABASE makerspace_db;" then:
-- psql -U postgres -d makerspace_db -f database/init.sql

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    student_name VARCHAR(255),
    skill_level VARCHAR(50) DEFAULT 'beginner',
    recommendation_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    available BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Installation requests table
CREATE TABLE IF NOT EXISTS installation_requests (
    id SERIAL PRIMARY KEY,
    tool_name VARCHAR(255) NOT NULL,
    tool_category VARCHAR(100),
    reason TEXT NOT NULL,
    requested_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_available ON tools(available);
CREATE INDEX idx_installation_requests_status ON installation_requests(status);
