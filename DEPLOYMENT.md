# Deployment Guide

NexusGuard is configured for scalable deployment using Netlify for the frontend and Render for the FastAPI backend.

## Environment Variables

### Backend (`.env`)
```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key_here

# Security
SECRET_KEY=generate_a_secure_random_string

# Environment Configuration
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend-domain.netlify.app
```

### Frontend (`.env`)
```env
VITE_API_URL=https://your-backend-domain.onrender.com/api/v1
```

*(Note: Never expose actual API keys or secrets in version control.)*

## Frontend Deployment (Vercel)

1. Create a free account on [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project** and import your GitHub repository.
3. Vercel will automatically detect that it's a Vite (React) project.
4. **Configuration**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
5. **Environment Variables**: Add `VITE_API_URL` pointing to your Render backend (e.g., `https://your-backend.onrender.com/api/v1`).
6. Click **Deploy**. Vercel will build and host your frontend instantly.

## Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Configure the settings:
   - **Root Directory**: *(Leave this BLANK / Empty)*
   - **Environment**: Python
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set the Environment Variables (`GEMINI_API_KEY`, `SECRET_KEY`, `CORS_ORIGINS`).
5. Deploy. Render will expose the backend URL to link with your frontend.

## Local Production Build

To test the production build locally:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Run the backend:
   ```bash
   cd backend
   # Ensure Python can resolve the local modules (e.g., from backend.api import ...)
   export PYTHONPATH=$PWD
   # Alternatively on Windows PowerShell: $env:PYTHONPATH = $PWD
   ENVIRONMENT=production uvicorn main:app --host 0.0.0.0 --port 8000
   ```
