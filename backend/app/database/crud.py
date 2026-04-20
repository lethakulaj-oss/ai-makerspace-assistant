from app.database.connection import db_connection
from app.models.schemas import InstallationRequest, InstallationRequestResponse
from datetime import datetime
from typing import List, Dict, Optional
import json
import os

class DatabaseOperations:
    
    def load_tools_from_knowledge_base(self) -> List[Dict]:
        """
        Load tools from knowledge base JSON file
        """
        kb_path = os.path.join(os.path.dirname(__file__), '..', '..', 'knowledge_base', 'tools_inventory.json')
        try:
            with open(kb_path, 'r') as f:
                data = json.load(f)
                return data.get('tools', [])
        except FileNotFoundError:
            return []
    
    def check_tool_availability(self, tool_name: str) -> Optional[Dict]:
        """
        Check if a tool is available in the Makerspace
        """
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            cursor.execute(
                "SELECT * FROM tools WHERE LOWER(name) = LOWER(%s)",
                (tool_name,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None

    def save_project(self, description: str, student_name: Optional[str], 
                    skill_level: str, recommendation_data: Dict) -> int:
        """
        Save project to database and return project_id
        """
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            cursor.execute(
                """
                INSERT INTO projects (description, student_name, skill_level, recommendation_data, created_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (description, student_name, skill_level, json.dumps(recommendation_data), datetime.now())
            )
            result = cursor.fetchone()
            return result['id']
    
    def get_tools(self, category: Optional[str] = None, available_only: bool = False) -> List[Dict]:
        """
        Get list of tools from database
        """
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            
            query = "SELECT * FROM tools WHERE 1=1"
            params = []
            
            if category:
                query += " AND category = %s"
                params.append(category)
            
            if available_only:
                query += " AND available = TRUE"
            
            cursor.execute(query, params)
            return [dict(row) for row in cursor.fetchall()]

    def create_installation_request(self, request: InstallationRequest) -> InstallationRequestResponse:
        """
        Create an installation request for a missing tool
        """
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            cursor.execute(
                """
                INSERT INTO installation_requests (tool_name, tool_category, reason, requested_by, status, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, created_at
                """,
                (request.tool_name, request.tool_category, request.reason, 
                 request.requested_by, 'pending', datetime.now())
            )
            result = cursor.fetchone()
            return InstallationRequestResponse(
                request_id=result['id'],
                tool_name=request.tool_name,
                status='pending',
                created_at=result['created_at']
            )
    
    def get_recent_projects(self, limit: int = 10) -> List[Dict]:
        """
        Get recent project submissions
        """
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            cursor.execute(
                "SELECT * FROM projects ORDER BY created_at DESC LIMIT %s",
                (limit,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def get_project_by_id(self, project_id: int) -> Optional[Dict]:
        """
        Get project details by ID
        """
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
            result = cursor.fetchone()
            return dict(result) if result else None

    def save_chat_message(self, project_id: int, role: str, content: str):
        """Save a chat message to conversation history"""
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            cursor.execute(
                """
                INSERT INTO conversation_history (project_id, role, content, created_at)
                VALUES (%s, %s, %s, %s)
                """,
                (project_id, role, content, datetime.now())
            )

    def get_chat_history(self, project_id: int, limit: int = 10) -> List[Dict]:
        """Get recent conversation history for a project"""
        with db_connection.get_connection() as conn:
            cursor = db_connection.get_cursor(conn)
            cursor.execute(
                """
                SELECT role, content FROM conversation_history
                WHERE project_id = %s
                ORDER BY created_at DESC LIMIT %s
                """,
                (project_id, limit)
            )
            rows = cursor.fetchall()
            return list(reversed([dict(r) for r in rows]))
