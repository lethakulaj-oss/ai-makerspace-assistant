from app.models.schemas import ProjectIdeaRequest, ProjectResponse, Recommendation, Tool
from app.services.llm_service import LLMService
from app.services.vector_service import VectorService
from app.database.crud import DatabaseOperations
from datetime import datetime
import json

class RecommendationEngine:
    def __init__(self, llm_service: LLMService, vector_service: VectorService, db_ops: DatabaseOperations):
        self.llm_service = llm_service
        self.vector_service = vector_service
        self.db_ops = db_ops
    
    async def analyze_and_recommend(self, request: ProjectIdeaRequest) -> ProjectResponse:
        """
        Main recommendation pipeline
        """
        # Step 1: Load available tools from knowledge base
        available_tools = self.db_ops.load_tools_from_knowledge_base()
        
        # Step 2: Use LLM to analyze project and suggest tools
        llm_analysis = await self.llm_service.analyze_project_idea(
            description=request.description,
            skill_level=request.skill_level,
            available_tools=available_tools
        )
        
        # Step 3: Check tool availability
        available_tool_objects = []
        missing_tool_objects = []
        
        # Check recommended tools against inventory
        all_recommended_tools = (
            llm_analysis.get('tools_needed', []) + 
            llm_analysis.get('libraries', []) +
            llm_analysis.get('frameworks', [])
        )
        
        for tool_name in all_recommended_tools:
            tool_info = self.db_ops.check_tool_availability(tool_name)
            if tool_info:
                available_tool_objects.append(Tool(**tool_info))
            else:
                missing_tool_objects.append(Tool(
                    name=tool_name,
                    category="unknown",
                    available=False,
                    description=f"Recommended but not in inventory"
                ))
        
        # Add missing tools from LLM analysis
        for tool_name in llm_analysis.get('missing_tools', []):
            if not any(t.name == tool_name for t in missing_tool_objects):
                missing_tool_objects.append(Tool(
                    name=tool_name,
                    category="unknown",
                    available=False,
                    description="Identified as missing by AI"
                ))
        
        # Step 4: Save project to database
        project_id = self.db_ops.save_project(
            description=request.description,
            student_name=request.student_name,
            skill_level=request.skill_level,
            recommendation_data=llm_analysis
        )
        
        # Step 5: Add to vector database for similarity search
        await self.vector_service.add_project(
            project_id=project_id,
            description=request.description,
            metadata={
                "skill_level": request.skill_level,
                "tools": all_recommended_tools,
                "languages": llm_analysis.get('programming_languages', [])
            }
        )
        
        # Step 6: Build recommendation response
        recommendation = Recommendation(
            project_id=project_id,
            programming_languages=llm_analysis.get('programming_languages', []),
            frameworks=llm_analysis.get('frameworks', []),
            libraries=llm_analysis.get('libraries', []),
            available_tools=available_tool_objects,
            missing_tools=missing_tool_objects,
            setup_steps=llm_analysis.get('setup_steps', []),
            estimated_complexity=llm_analysis.get('complexity', 'intermediate'),
            feasibility_score=llm_analysis.get('feasibility_score', 0.7),
            additional_notes=llm_analysis.get('notes')
        )
        
        # Step 7: Return complete response
        return ProjectResponse(
            project_id=project_id,
            description=request.description,
            student_name=request.student_name,
            skill_level=request.skill_level,
            recommendation=recommendation,
            created_at=datetime.now()
        )
