from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import (
    ProjectIdeaRequest,
    RecommendRequest,
    ProjectResponse,
    InstallationRequest,
    InstallationRequestResponse,
    ToolsListResponse,
    SimilarProject,
    ChatMessage,
    ChatResponse
)
from app.services.recommendation_engine import RecommendationEngine
from app.services.llm_service import LLMService
from app.services.vector_service import VectorService
from app.services.chat_service import ChatService
from app.database.crud import DatabaseOperations

router = APIRouter()

llm_service = LLMService()
vector_service = VectorService()
db_ops = DatabaseOperations()
recommendation_engine = RecommendationEngine(llm_service, vector_service, db_ops)
chat_service = ChatService()

@router.post("/recommend")
async def recommend(request: RecommendRequest):
    """
    Accepts the final project frontend's field names and returns recommendations
    """
    try:
        # Build description from all available fields
        description = request.project_description
        if request.project_domain:
            description += f" Domain: {request.project_domain}."
        if request.project_goal:
            description += f" Goal: {request.project_goal}."

        idea = ProjectIdeaRequest(
            description=description,
            student_name=request.name,
            skill_level=request.skill_level or "beginner"
        )
        result = await recommendation_engine.analyze_and_recommend(idea)

        return {
            "summary": result.recommendation.additional_notes or f"Recommendations for your {request.project_domain or ''} project.",
            "difficulty": result.recommendation.estimated_complexity,
            "recommendedHardware": [t.name for t in result.recommendation.available_tools if t.category == "hardware"] or ["NVIDIA RTX 3080 (Makerspace GPU)", "Raspberry Pi 4B"],
            "recommendedSoftware": result.recommendation.programming_languages + result.recommendation.frameworks + result.recommendation.libraries,
            "nextSteps": result.recommendation.setup_steps,
            "project_id": result.project_id,
            "missing_tools": [t.name for t in result.recommendation.missing_tools],
            "feasibility_score": result.recommendation.feasibility_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.post("/analyze-project", response_model=ProjectResponse)
async def analyze_project(request: ProjectIdeaRequest):
    """
    Analyze a project idea and provide recommendations
    """
    try:
        result = await recommendation_engine.analyze_and_recommend(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing project: {str(e)}")

@router.get("/tools", response_model=ToolsListResponse)
async def get_tools(category: str = None, available_only: bool = False):
    """
    Get list of tools in the Makerspace
    """
    try:
        tools = db_ops.get_tools(category=category, available_only=available_only)
        return ToolsListResponse(tools=tools, total_count=len(tools))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tools: {str(e)}")

@router.post("/installation-request", response_model=InstallationRequestResponse)
async def create_installation_request(request: InstallationRequest):
    """
    Submit a request for installing a missing tool
    """
    try:
        result = db_ops.create_installation_request(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating request: {str(e)}")

@router.get("/projects")
async def get_projects(limit: int = 10):
    """
    Get recent project submissions
    """
    try:
        projects = db_ops.get_recent_projects(limit=limit)
        return {"projects": projects, "count": len(projects)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")

@router.get("/projects/{project_id}")
async def get_project(project_id: int):
    """
    Get details of a specific project
    """
    try:
        project = db_ops.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching project: {str(e)}")

@router.get("/similar-projects/{project_id}", response_model=List[SimilarProject])
async def get_similar_projects(project_id: int, limit: int = 5):
    """
    Find similar projects using vector search
    """
    try:
        similar = await vector_service.find_similar_projects(project_id, limit=limit)
        return similar
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding similar projects: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    """
    Chat with context of a specific project
    """
    try:
        project = db_ops.get_project_by_id(request.project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        history = db_ops.get_chat_history(request.project_id)
        reply = await chat_service.chat(request.message, project, history)

        db_ops.save_chat_message(request.project_id, "user", request.message)
        db_ops.save_chat_message(request.project_id, "assistant", reply)

        return ChatResponse(reply=reply, project_id=request.project_id)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Chat error detail: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
