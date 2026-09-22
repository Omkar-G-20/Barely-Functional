-- AgriFeed AI PostgreSQL Schema Setup

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    farm_information TEXT,
    language VARCHAR(50) DEFAULT 'English',
    notifications BOOLEAN DEFAULT true,
    offline_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Analyses Table with all parameters & AI output fields
CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    test_id VARCHAR(50) NOT NULL,
    sample_type VARCHAR(50) NOT NULL,
    image_path TEXT,
    annotated_image_path TEXT,
    output_image_data_url TEXT,
    ai_analysis JSONB,
    moisture NUMERIC,
    protein NUMERIC,
    fiber NUMERIC,
    aflatoxin NUMERIC,
    ph NUMERIC,
    temperature NUMERIC,
    ai_result TEXT,
    confidence NUMERIC,
    quality VARCHAR(50),
    recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
