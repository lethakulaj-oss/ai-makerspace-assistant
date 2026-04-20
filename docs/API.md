# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Analyze Project

Analyze a project idea and get recommendations.

**Endpoint:** `POST /analyze-project`

**Request Body:**
```json
{
  "description": "I want to build a machine learning model to classify images",
  "student_name": "John Doe",
  "skill_level": "beginner"
}
```

**Response:**
```json
{
  "project_id": 1,
  "description": "...",
  "student_name": "John Doe",
  "skill_level": "beginner",
  "recommendation": {
    "project_id": 1,
    "programming_languages": ["Python"],
    "frameworks": ["PyTorch"],
    "libraries": ["NumPy", "OpenCV"],
    "available_tools": [...],
    "missing_tools": [...],
    "setup_steps": [...],
    "estimated_complexity": "intermediate",
    "feasibility_score": 0.85,
    "additional_notes": "..."
  },
  "created_at": "2024-01-15T10:30:00"
}
```

### 2. Get Tools

Get list of available tools in Makerspace.

**Endpoint:** `GET /tools`

**Query Parameters:**
- `category` (optional): Filter by category
- `available_only` (optional): Show only available tools

**Response:**
```json
{
  "tools": [
    {
      "name": "Python",
      "category": "language",
      "version": "3.11",
      "available": true,
      "description": "..."
    }
  ],
  "total_count": 25
}
```

### 3. Submit Installation Request

Request installation of a missing tool.

**Endpoint:** `POST /installation-request`

**Request Body:**
```json
{
  "tool_name": "Keras",
  "tool_category": "library",
  "reason": "Needed for neural network project",
  "requested_by": "John Doe"
}
```

**Response:**
```json
{
  "request_id": 1,
  "tool_name": "Keras",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00"
}
```

### 4. Get Projects

Get recent project submissions.

**Endpoint:** `GET /projects`

**Query Parameters:**
- `limit` (optional): Number of projects to return (default: 10)

### 5. Get Similar Projects

Find similar projects using vector search.

**Endpoint:** `GET /similar-projects/{project_id}`

**Query Parameters:**
- `limit` (optional): Number of similar projects (default: 5)

## Error Responses

All endpoints return standard error format:

```json
{
  "detail": "Error message here"
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error
