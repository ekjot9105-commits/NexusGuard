# AegisFlow - AI Stadium Operations Copilot

AegisFlow is an enterprise-grade AI operations copilot designed for managing crowd safety, sensor telemetry, and incident mitigation at the FIFA World Cup 2026.

## Architecture

This project operates on a decoupled modular monolith structure:

### Frontend
- **React 18 & Vite**: Fast, module-based development and optimized production bundling.
- **TypeScript**: Strict type-checking across all data models and React props.
- **Tailwind CSS v3**: Tailwind utility classes powering a custom "Microsoft Fluent + Glassmorphism" UI.
- **Zustand**: Lightweight global state management for UI preferences (Dark Mode, Reduced Motion).
- **TanStack Query & Axios**: Robust API layer with global interceptors, polling fallbacks, caching, and retry logic.
- **Framer Motion**: Smooth entry, exit, and state-change animations optimized for enterprise interfaces.
- **React Router**: Client-side routing with deep lazy-loading for code splitting.

### Backend (FastAPI)
- **FastAPI**: Asynchronous Python server.
- **Pydantic**: Deep request/response validation.
- **AI Core Interface**: Abstract layer connecting to Gemini AI for reasoning.
- **PII Sanitizer**: Regex-based recursive request sanitizer middleware to protect sensitive data.
- **Semantic Cache**: In-memory caching layer preventing duplicate LLM calls for identical incident telemetry.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

### Running the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Accessibility Features
- Fully functional `prefers-reduced-motion` integration togglable via UI Settings.
- Full ARIA compliance across navigation links, switches, and interactive elements.
- WCAG AA compliant contrast ratios within the primary dark-mode theme.
