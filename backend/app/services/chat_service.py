from groq import Groq
from app.config import settings
from typing import List, Dict
import asyncio

class ChatService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL

    async def chat(self, user_message: str, project_context: Dict, history: List[Dict]) -> str:
        """
        Generate a context-aware chat response using project info and conversation history.
        """
        rec = project_context.get("recommendation_data", {})
        languages = ", ".join(rec.get("programming_languages", []))
        frameworks = ", ".join(rec.get("frameworks", []))
        libraries = ", ".join(rec.get("libraries", []))
        steps = rec.get("setup_steps", [])
        steps_text = "\n".join([f"{i+1}. {s}" for i, s in enumerate(steps)])

        system_prompt = f"""You are a helpful assistant for the UAlbany Makerspace.
A student is working on this project: {project_context.get('description', '')}
Skill level: {project_context.get('skill_level', 'beginner')}

Their recommended stack:
- Languages: {languages}
- Frameworks: {frameworks}
- Libraries: {libraries}

Setup steps they are following:
{steps_text}

Help them with specific, practical answers based on this context.
Keep answers concise and beginner-friendly if needed."""

        messages = [{"role": "system", "content": system_prompt}]
        for msg in history[-6:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})

        # Run sync Groq client in thread to avoid blocking async event loop
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )
        )
        return response.choices[0].message.content
