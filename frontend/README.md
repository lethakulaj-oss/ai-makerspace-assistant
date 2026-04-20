# UAlbany AI Makerspace Portal Frontend

This is a React + Vite frontend redesign for the AI-Guided Project Development System for the AI Makerspace.

## Included UI
- Purple and gold University at Albany styling
- Dashboard hero section
- Project Assistant workspace
- Hardware resources
- Software/tools
- User management
- Templates
- Learning resources
- Events
- Policies

## Backend integration
The Project Assistant form supports a POST request.

Environment variables:
- `VITE_API_BASE_URL`
- `VITE_RECOMMEND_ENDPOINT`

Example:
- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_RECOMMEND_ENDPOINT=/recommend`

If the backend is unavailable, the UI shows a demo recommendation so the page still works for presentations.
