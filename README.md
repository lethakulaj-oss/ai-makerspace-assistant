# AI Makerspace Assistant

An intelligent system that helps students at UAlbany Makerspace get personalized project recommendations based on available tools and resources.

## Problem Statement

Students come to the Makerspace with great ideas but struggle with:
- Not knowing which tools or libraries to use
- Uncertainty about what's already installed
- Wasting time on environment setup instead of building
- Feasibility of their project ideas with available resources

## Solution

An AI-powered recommendation system that:
- Analyzes student project ideas
- Recommends appropriate tools, libraries, and frameworks
- Checks availability against Makerspace inventory
- Generates step-by-step project plans
- Allows installation requests for missing tools

## Tech Stack

### Frontend
- React + Vite
- Axios for API calls
- CSS for styling

### Backend
- Python FastAPI
- PostgreSQL (database)
- ChromaDB (vector search)
- Ollama + Llama 3.1 8B (local LLM)

### Key Features
- ✅ Project idea analysis
- ✅ Tool recommendations
- ✅ Availability checking
- ✅ Installation request system
- ✅ Project history tracking
- ✅ Similar project suggestions

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Ollama installed

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd ai-makerspace-assistant
```

2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Setup Database
```bash
psql -U postgres -f database/init.sql
psql -U postgres -d makerspace_db -f database/seed_data.sql
```

4. Setup Ollama
```bash
ollama pull llama3.1:8b
```

5. Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit .env with your settings
```

6. Start Backend
```bash
cd backend
uvicorn app.main:app --reload
```

7. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

8. Access the application at `http://localhost:5173`

## Project Structure

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## API Documentation

See [API.md](docs/API.md) for API endpoint details.

## License

MIT License - University at Albany Project
