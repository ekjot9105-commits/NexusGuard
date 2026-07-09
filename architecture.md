# AegisFlow: AI Stadium Operations Copilot
## System Architecture & Design Document

### 1. Overall System Architecture
AegisFlow is designed as a modern, decoupled web application utilizing a microservices-inspired monolithic architecture for ease of deployment while maintaining clear domain boundaries.
- **Frontend**: A React single-page application built with TypeScript, Tailwind CSS, and Vite. It serves as the primary dashboard for stadium organizers and volunteers.
- **Backend**: A high-performance async Python backend powered by FastAPI. It handles API routing, WebSocket connections for real-time updates, and orchestrates the AI agents.
- **Data Layer**: SQLite for structured relational data (incidents, sensor logs, historical data) and an in-memory Redis-like simulation for caching and fast-access transient data.
- **AI Layer**: A simulated Gemini API integration acting as the core reasoning engine, structured via LangChain/LlamaIndex paradigms into distinct specialized agents.

### 2. Folder Structure
The enterprise-grade modular architecture is structured as follows:

```text
AegisFlow/
├── frontend/                 # React, Vite, Tailwind CSS, TypeScript
│   ├── src/
│   │   ├── components/       # Reusable UI components (buttons, cards, modals)
│   │   ├── pages/            # View components (Dashboard, Volunteers, Settings)
│   │   ├── hooks/            # Custom React hooks for API and WebSocket
│   │   ├── services/         # API client layer
│   │   ├── store/            # State management (Zustand or Context)
│   │   ├── types/            # TypeScript interfaces
│   │   └── assets/           # Static assets, icons, styles
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # FastAPI, Python
│   ├── main.py               # Entry point
│   ├── api/
│   │   ├── routers/          # API route definitions
│   │   ├── middleware/       # JWT Auth, PII Sanitization, Rate Limiting
│   │   └── dependencies.py   # FastAPI dependencies (auth checks, db sessions)
│   ├── core/
│   │   ├── config.py         # Environment variables and settings
│   │   ├── security.py       # JWT generation/validation, password hashing
│   │   └── exceptions.py     # Custom error handlers
│   ├── db/
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── session.py        # Database connection setup
│   ├── services/             # Business logic and external service integrations
│   ├── ai/                   # AI Agent architecture
│   │   ├── agents/           # Specific agent implementations
│   │   ├── prompts/          # Managed prompt templates
│   │   ├── memory/           # Semantic caching and conversation history
│   │   └── core.py           # Base LLM interaction layer
│   ├── simulators/           # Mock data generators for stadium telemetry
│   └── utils/                # Helper functions
├── tests/                    # Pytest and Jest test suites
│   ├── backend/
│   │   ├── unit/
│   │   └── integration/
│   └── frontend/
├── docs/                     # Additional documentation
├── scripts/                  # Deployment, DB migration, and seeding scripts
├── requirements.txt          # Python dependencies
└── README.md                 # Project overview and run instructions
```

### 3. Data Flow
1. **Ingestion**: The `simulators/` module continuously generates telemetry (crowd density, metro arrivals, medical alerts) and sends it to the backend via background tasks or internal endpoints.
2. **Processing & Sanitization**: Data passes through the `middleware/` where the **PII Sanitizer** strips any personal information (ticket IDs, emails, names) before logging or processing.
3. **Storage & State**: Clean data is written to the SQLite database and cached in memory for immediate access.
4. **AI Analysis**: The **Crowd Intelligence Agent** continuously polls or receives event triggers based on the cached data to predict congestion up to 15 minutes ahead.
5. **Reasoning & Recommendation**: When a risk is detected, the **Operations Copilot Agent** analyzes the context, determines root causes, and formulates mitigation plans containing risk levels and expected impacts.
6. **Real-time Distribution**: Recommendations and alerts are pushed via WebSockets to the React frontend.
7. **Action**: The Operator reviews the dashboard and approves actions, which triggers the **Multilingual Communication Agent** and **Volunteer Assistant Agent** to generate exact phrasing and dispatch task instructions.

### 4. AI Agent Interactions
AegisFlow utilizes a Multi-Agent architecture where agents collaborate autonomously:
- **Crowd Intelligence Agent**: Acts as the "Watcher". Analyzes numeric and categorical data from sensors. If predicted risk > threshold, it triggers the Copilot.
- **Operations Copilot Agent**: Acts as the "Brain". Receives risk reports, queries historical data, and generates a structured JSON response containing Root Cause, Confidence, Mitigation Protocol, and Priority Level.
- **Emergency Response Agent**: A high-priority interrupt agent. If a fire/medical incident is logged, it preempts other agents to immediately generate critical evacuation/response guidelines.
- **Multilingual Communication Agent**: Acts as the "Voice". Takes the mitigation plan and translates it into English, Spanish, and French announcements tailored for PA systems and mobile apps (concise, culturally neutral).
- **Volunteer Assistant Agent**: Acts as the "Dispatcher". Converts mitigation plans into actionable, step-by-step tasks assigned to specific volunteer zones.

### 5. Security Architecture
- **Authentication**: JWT-based stateless authentication. All API routes (except public webhooks/simulators) require valid tokens.
- **RBAC (Role-Based Access Control)**: Enforced via FastAPI dependencies. Roles include `Admin`, `Operator`, and `Volunteer`.
- **PII Sanitization Middleware**: Intercepts outgoing requests to the LLM. Uses regex and text processing rules to mask emails, phone numbers, names, and ticket IDs before they reach the Generative AI.
- **Prompt Injection Protection**: Input validation via Pydantic schemas and structured prompting (clear delimiters, explicit system constraints) to prevent malicious input from overriding agent instructions.
- **Rate Limiting**: Protects endpoints (especially AI generation endpoints) from abuse, using memory-based token bucket algorithms.
- **Secure Error Handling**: Global exception handlers ensure no stack traces, DB queries, or internal system details leak to the client.

### 6. Performance Optimizations
- **Semantic Caching**: AI responses for similar incidents (e.g., "Gate 4 Congestion") within a short timeframe are cached to prevent redundant, slow LLM calls.
- **Asynchronous Architecture**: FastAPI and `asyncio` ensure the backend can handle thousands of concurrent simulator updates and WebSocket connections without blocking.
- **Batching & Lazy Loading**: Sensor updates are batched before database insertion to reduce SQLite write-locks. The frontend utilizes lazy loading for non-critical dashboard panels and debouncing for high-frequency map updates.
- **Efficient Querying**: Connection pooling and optimized indexing ensure fast data retrieval even during simulated peak load.

### 7. Scalability Strategy
- **Stateless Backend**: The FastAPI application is completely stateless (state lives in DB/Cache), allowing horizontal scaling across multiple containers.
- **Modular Monolith**: While currently a monolith, the `services/` and `ai/` directories have strict boundaries. They can be trivially extracted into separate microservices (e.g., an independent AI Inference Service) as load increases.
- **Decoupled Data**: Transitioning from SQLite to PostgreSQL and simulated memory to Redis requires changing only the `db/session.py` and `core/config.py` configuration files.

### 8. Maintainability Considerations
- **SOLID & Clean Architecture**: Strict separation of concerns. Dependency injection in FastAPI ensures components are decoupled and easily mockable for testing.
- **Type Safety**: Pydantic for Python and TypeScript for React ensure strong contracts between the frontend and backend.
- **Documentation**: Comprehensive docstrings (Google format) and auto-generated Swagger UI/Redoc for all APIs.
- **DRY & KISS**: Shared generic utility functions and intuitive service layers prevent code duplication.

### 9. Testing Strategy
- **Unit Testing**: Pytest for testing individual utility functions, PII sanitizers, and Pydantic validation rules independently.
- **Integration Testing**: FastAPI `TestClient` for end-to-end API testing using a separate test database.
- **AI Simulation Tests**: Mocking the Gemini API to simulate timeouts, malformed JSON responses, and prompt injection attacks to ensure the backend degrades gracefully.
- **Frontend Testing**: Jest and React Testing Library for component rendering, routing, and state management logic.

### 10. Addressing the FIFA World Cup Challenge
AegisFlow shifts stadium management from **reactive** to **proactive**. 
Instead of waiting for a crowd crush at Gate 4, the **Crowd Intelligence Agent** analyzes metro arrivals and ticketing velocity to predict the crush 15 minutes in advance. The **Operations Copilot** doesn't just sound an alarm; it provides a concrete, reasoned plan (e.g., "Reroute 2000 fans to Gate 6, deploy 5 volunteers"). The **Multilingual Agent** instantly generates the required PA announcements. This transforms a chaotic avalanche of raw data into actionable intelligence—drastically reducing cognitive load on operators, accelerating response times, and ultimately ensuring the safety and satisfaction of thousands of global fans.
