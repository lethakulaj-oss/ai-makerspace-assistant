from groq import Groq
from app.config import settings
from typing import Dict, Any
import json
import re

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL

    def _extract_json(self, text: str) -> Dict:
        """Robustly extract JSON from LLM response regardless of formatting."""
        # 1. Try direct parse first
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            pass

        # 2. Extract from ```json ... ``` or ``` ... ```
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass

        # 3. Find first { ... } block in the text
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass

        # 4. Nothing worked — return fallback
        return None

    async def generate_response(self, prompt: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI assistant for UAlbany Makerspace. Help students with project recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"LLM generation failed: {str(e)}")

    async def analyze_project_idea(self, description: str, skill_level: str, available_tools: list) -> Dict[str, Any]:
        tools_list = ", ".join([tool['name'] for tool in available_tools])

        prompt = f"""You are a technical advisor for UAlbany Makerspace.
A student wants to build the following project. Analyze it carefully and recommend tools SPECIFIC to this exact project type.

Project Description: {description}
Student Skill Level: {skill_level}
Tools Available in Makerspace: {tools_list}

IMPORTANT RULES:
- Recommendations MUST be specific to the project described, not generic
- A web app project should NOT get the same tools as a computer vision project
- A hardware project should NOT get the same tools as an NLP project
- Only recommend tools that are actually relevant to THIS specific project
- Pick tools from the Available Tools list where possible

Respond with ONLY this JSON structure, no explanation:
{{
  "programming_languages": ["only languages needed for THIS project"],
  "frameworks": ["only frameworks relevant to THIS project type"],
  "libraries": ["specific libraries for THIS project domain"],
  "tools_needed": ["tools from available list that apply"],
  "missing_tools": ["tools NOT in available list but needed"],
  "setup_steps": [
    "Step 1: specific to this project",
    "Step 2: specific to this project",
    "Step 3: specific to this project",
    "Step 4: specific to this project",
    "Step 5: specific to this project"
  ],
  "complexity": "beginner or intermediate or advanced",
  "feasibility_score": 0.0,
  "notes": "specific advice for this exact project"
}}

Only return the JSON. No markdown, no extra text."""

        response = await self.generate_response(prompt)
        result = self._extract_json(response)

        if result:
            return result

        # Domain-aware fallback based on keywords
        desc_lower = description.lower()
        if any(w in desc_lower for w in ["web", "website", "app", "frontend", "backend", "api", "ecommerce"]):
            return {
                "programming_languages": ["JavaScript", "Python"],
                "frameworks": ["React", "FastAPI"],
                "libraries": ["Axios", "SQLAlchemy"],
                "tools_needed": ["Node.js", "VS Code", "Git", "PostgreSQL"],
                "missing_tools": [],
                "setup_steps": [
                    "Step 1: Set up Node.js and create React frontend",
                    "Step 2: Set up Python FastAPI backend",
                    "Step 3: Connect frontend to backend via REST API",
                    "Step 4: Set up PostgreSQL database",
                    "Step 5: Test all endpoints and deploy locally"
                ],
                "complexity": skill_level, "feasibility_score": 0.85,
                "notes": f"Web application stack for: {description[:80]}"
            }
        elif any(w in desc_lower for w in ["vision", "image", "camera", "webcam", "detect", "opencv", "yolo"]):
            return {
                "programming_languages": ["Python"],
                "frameworks": ["PyTorch", "TensorFlow"],
                "libraries": ["OpenCV", "NumPy", "Matplotlib"],
                "tools_needed": ["Python", "Jupyter", "VS Code", "NVIDIA RTX 3080"],
                "missing_tools": ["Webcam"],
                "setup_steps": [
                    "Step 1: Install OpenCV and test camera feed",
                    "Step 2: Download a pre-trained detection model",
                    "Step 3: Write detection pipeline",
                    "Step 4: Add real-time processing loop",
                    "Step 5: Test and optimize performance"
                ],
                "complexity": skill_level, "feasibility_score": 0.8,
                "notes": f"Computer vision stack for: {description[:80]}"
            }
        elif any(w in desc_lower for w in ["arduino", "raspberry", "robot", "sensor", "iot", "hardware"]):
            return {
                "programming_languages": ["Python", "C++"],
                "frameworks": [],
                "libraries": ["RPi.GPIO", "pyserial", "NumPy"],
                "tools_needed": ["Arduino Uno", "Raspberry Pi", "VS Code"],
                "missing_tools": [],
                "setup_steps": [
                    "Step 1: Set up hardware connections",
                    "Step 2: Install required drivers and libraries",
                    "Step 3: Write sensor reading code",
                    "Step 4: Add control logic",
                    "Step 5: Test and calibrate the system"
                ],
                "complexity": skill_level, "feasibility_score": 0.75,
                "notes": f"Hardware/IoT stack for: {description[:80]}"
            }
        elif any(w in desc_lower for w in ["nlp", "text", "language", "chatbot", "sentiment", "classification"]):
            return {
                "programming_languages": ["Python"],
                "frameworks": ["Hugging Face Transformers"],
                "libraries": ["NLTK", "spaCy", "Pandas", "Scikit-learn"],
                "tools_needed": ["Python", "Jupyter", "VS Code"],
                "missing_tools": [],
                "setup_steps": [
                    "Step 1: Set up Python environment and install NLP libraries",
                    "Step 2: Collect and preprocess text dataset",
                    "Step 3: Choose and load a pre-trained language model",
                    "Step 4: Fine-tune or apply model to your task",
                    "Step 5: Evaluate results and build demo interface"
                ],
                "complexity": skill_level, "feasibility_score": 0.82,
                "notes": f"NLP stack for: {description[:80]}"
            }
        else:
            return {
                "programming_languages": ["Python"],
                "frameworks": ["Scikit-learn"],
                "libraries": ["Pandas", "NumPy", "Matplotlib"],
                "tools_needed": ["Jupyter", "VS Code", "Git"],
                "missing_tools": [],
                "setup_steps": [
                    "Step 1: Set up Python virtual environment",
                    "Step 2: Install required libraries with pip",
                    "Step 3: Load and explore your dataset",
                    "Step 4: Build and train your model",
                    "Step 5: Evaluate and visualize results"
                ],
                "complexity": skill_level, "feasibility_score": 0.8,
                "notes": f"ML/Data science stack for: {description[:80]}"
            }
