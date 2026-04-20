# Setup Guide

Complete setup instructions for the AI Makerspace Assistant.

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Ollama (for running local LLM)

## Step 1: Install Ollama

### Windows
Download from: https://ollama.ai/download/windows

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

After installation, pull the Llama model:
```bash
ollama pull llama3.1:8b
```

## Step 2: Setup PostgreSQL

1. Install PostgreSQL
2. Create database and run schema:
```bash
psql -U postgres -c "CREATE DATABASE makerspace_db;"
psql -U postgres -d makerspace_db -f database/init.sql
psql -U postgres -d makerspace_db -f database/seed_data.sql
```

3. Run initialization script:
```bash
psql -U postgres -d makerspace_db -f database/init.sql
```

4. Load seed data:
```bash
psql -U postgres -d makerspace_db -f database/seed_data.sql
```

## Step 3: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials.

6. Start backend server:
```bash
uvicorn app.main:app --reload
```

Backend will run at: http://localhost:8000

## Step 4: Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run at: http://localhost:5173

## Step 5: Verify Installation

1. Open browser to http://localhost:5173
2. Enter a test project description
3. Check that recommendations are generated

## Troubleshooting

### Ollama not responding
- Ensure Ollama service is running
- Check: `ollama list` to see installed models

### Database connection error
- Verify PostgreSQL is running
- Check credentials in `.env` file

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check CORS settings in backend config

## Demo Mode

For quick demo without full setup:
- Use SQLite instead of PostgreSQL (modify connection.py)
- Pre-populate with sample data
- Run both servers locally
