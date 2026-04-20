"""
Prompt templates for LLM interactions
"""

SYSTEM_PROMPT = """
You are an AI assistant for the UAlbany Makerspace. Your role is to help students 
plan their projects by recommending appropriate tools, libraries, and frameworks 
based on what is actually available in the Makerspace.

Be practical, specific, and considerate of the student's skill level.
"""

PROJECT_ANALYSIS_TEMPLATE = """
Analyze this student project idea and provide recommendations.

Project Description: {description}
Student Skill Level: {skill_level}
Available Tools in Makerspace: {available_tools}

Provide recommendations for:
1. Programming languages
2. Frameworks and libraries
3. Tools needed from the Makerspace
4. Any missing tools that would need to be installed
5. Step-by-step setup instructions
6. Project complexity assessment
7. Feasibility score (0.0 to 1.0)

Be specific and practical. Consider the student's skill level.
"""
