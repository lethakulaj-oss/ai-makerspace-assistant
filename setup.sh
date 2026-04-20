#!/bin/bash

echo "🚀 AI Makerspace Assistant - Quick Setup"
echo "========================================"

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL 14+"
fi

if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama not found. Please install from https://ollama.ai"
fi

echo "✅ Prerequisites check complete"

# Setup backend
echo ""
echo "Setting up backend..."
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

cd ..

# Setup frontend
echo ""
echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Install Ollama: https://ollama.ai"
echo "2. Pull Llama model: ollama pull llama3.1:8b"
echo "3. Setup PostgreSQL database (see docs/SETUP.md)"
echo "4. Edit backend/.env with your settings"
echo "5. Start backend: cd backend && uvicorn app.main:app --reload"
echo "6. Start frontend: cd frontend && npm run dev"
