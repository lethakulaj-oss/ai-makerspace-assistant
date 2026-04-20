# Architecture Documentation

## System Overview

The AI Makerspace Assistant is a full-stack application that helps students get intelligent project recommendations based on available resources.

## Architecture Layers

### 1. Frontend Layer (React + Vite)
- **Technology:** React 18, Vite, Axios
- **Responsibility:** User interface and interaction
- **Components:**
  - ProjectForm: Input project ideas
  - RecommendationCard: Display AI recommendations
  - ToolsList: Show available/missing tools
  - InstallationRequest: Request missing tools

### 2. API Layer (FastAPI)
- **Technology:** Python FastAPI
- **Responsibility:** REST API endpoints
- **Routes:**
  - `/api/analyze-project`: Main recommendation endpoint
  - `/api/tools`: Tool inventory management
  - `/api/installation-request`: Tool requests
  - `/api/projects`: Project history
  - `/api/similar-projects`: Vector search

### 3. Business Logic Layer
- **RecommendationEngine:** Core recommendation logic
- **LLMService:** Ollama integration for AI analysis
- **VectorService:** ChromaDB for similarity search
- **DatabaseOperations:** CRUD operations

### 4. Data Layer
- **PostgreSQL:** Primary database
  - projects table
  - tools table
  - installation_requests table
- **ChromaDB:** Vector database for similarity search
- **Knowledge Base:** JSON files with tool inventory

### 5. AI Layer
- **Ollama + Llama 3.1 8B:** Local LLM
- **Purpose:** Analyze project ideas and generate recommendations
- **Benefits:** No API costs, privacy, offline capability

## Data Flow

1. Student submits project idea via frontend
2. Frontend sends POST request to `/api/analyze-project`
3. Backend loads available tools from knowledge base
4. LLMService sends structured prompt to Ollama
5. LLM analyzes and returns recommendations
6. RecommendationEngine checks tool availability
7. Project saved to PostgreSQL
8. Project embedding added to ChromaDB
9. Complete recommendation returned to frontend
10. Frontend displays results

## Key Design Decisions

### Why Ollama + Llama 3.1?
- Free and open source
- Runs locally (no API costs)
- Good performance for this use case
- Privacy-friendly

### Why ChromaDB?
- Lightweight vector database
- Easy to set up
- Perfect for similarity search
- No external dependencies

### Why FastAPI?
- Modern Python framework
- Automatic API documentation
- Fast performance
- Easy async support

### Why PostgreSQL?
- Reliable relational database
- JSONB support for flexible data
- Good for structured data

## Scalability Considerations

For production deployment:
1. Use connection pooling for database
2. Add Redis for caching
3. Deploy LLM on dedicated GPU server
4. Use load balancer for API
5. Implement rate limiting
6. Add authentication/authorization

## Security

Current implementation (demo):
- No authentication (add for production)
- CORS enabled for localhost
- SQL injection protected (parameterized queries)
- Input validation via Pydantic

Production additions needed:
- JWT authentication
- API rate limiting
- Input sanitization
- HTTPS only
- Environment variable protection
