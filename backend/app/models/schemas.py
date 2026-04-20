from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class ProjectIdeaRequest(BaseModel):
    description: str = Field(..., min_length=10, description="Project idea description")
    student_name: Optional[str] = Field(None, description="Student name (optional)")
    skill_level: Optional[str] = Field("beginner", description="Skill level: beginner, intermediate, advanced")

# Accepts the frontend's field names from the final project UI
class RecommendRequest(BaseModel):
    name: Optional[str] = None
    project_title: Optional[str] = None
    project_description: str = Field(..., min_length=5)
    skill_level: Optional[str] = "Beginner"
    project_domain: Optional[str] = None
    project_goal: Optional[str] = None
    preferred_hardware: Optional[str] = None
    preferred_software: Optional[str] = None

class Tool(BaseModel):
    name: str
    category: str
    version: Optional[str] = None
    available: bool
    description: Optional[str] = None

class Recommendation(BaseModel):
    project_id: int
    programming_languages: List[str]
    frameworks: List[str]
    libraries: List[str]
    available_tools: List[Tool]
    missing_tools: List[Tool]
    setup_steps: List[str]
    estimated_complexity: str
    feasibility_score: float
    additional_notes: Optional[str] = None

class ProjectResponse(BaseModel):
    project_id: int
    description: str
    student_name: Optional[str]
    skill_level: str
    recommendation: Recommendation
    created_at: datetime

class InstallationRequest(BaseModel):
    tool_name: str
    tool_category: str
    reason: str
    requested_by: Optional[str] = None

class InstallationRequestResponse(BaseModel):
    request_id: int
    tool_name: str
    status: str
    created_at: datetime

class ToolsListResponse(BaseModel):
    tools: List[Tool]
    total_count: int

class SimilarProject(BaseModel):
    project_id: int
    description: str
    similarity_score: float
    tools_used: List[str]

class ChatMessage(BaseModel):
    project_id: int
    message: str

class ChatResponse(BaseModel):
    reply: str
    project_id: int
