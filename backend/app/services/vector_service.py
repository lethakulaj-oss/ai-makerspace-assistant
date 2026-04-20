import chromadb
from app.config import settings
from typing import List, Dict

class VectorService:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="makerspace_projects",
            metadata={"description": "Project descriptions and embeddings"}
        )
    
    async def add_project(self, project_id: int, description: str, metadata: Dict = None):
        """
        Add project to vector database
        """
        try:
            self.collection.add(
                documents=[description],
                ids=[str(project_id)],
                metadatas=[metadata or {}]
            )
        except Exception as e:
            print(f"Error adding to vector DB: {str(e)}")
    
    async def find_similar_projects(self, project_id: int, limit: int = 5) -> List[Dict]:
        """
        Find similar projects using vector search
        """
        try:
            # Get the project description
            result = self.collection.get(ids=[str(project_id)])
            
            if not result['documents']:
                return []
            
            query_text = result['documents'][0]
            
            # Search for similar projects
            results = self.collection.query(
                query_texts=[query_text],
                n_results=limit + 1  # +1 to exclude self
            )
            
            similar_projects = []
            for i, doc_id in enumerate(results['ids'][0]):
                if doc_id != str(project_id):  # Exclude the query project itself
                    similar_projects.append({
                        "project_id": int(doc_id),
                        "description": results['documents'][0][i],
                        "similarity_score": 1.0 - results['distances'][0][i],  # Convert distance to similarity
                        "tools_used": results['metadatas'][0][i].get('tools', [])
                    })
            
            return similar_projects[:limit]
        
        except Exception as e:
            print(f"Error finding similar projects: {str(e)}")
            return []
    
    async def search_by_description(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Search projects by description
        """
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=limit
            )
            
            projects = []
            for i in range(len(results['ids'][0])):
                projects.append({
                    "project_id": int(results['ids'][0][i]),
                    "description": results['documents'][0][i],
                    "similarity_score": 1.0 - results['distances'][0][i],
                    "metadata": results['metadatas'][0][i]
                })
            
            return projects
        except Exception as e:
            print(f"Error searching projects: {str(e)}")
            return []
