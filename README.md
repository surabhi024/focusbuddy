# FocusBuddy (Full-Stack Web App)

FocusBuddy is a productivity and focus companion web application built for coursework.  
It includes a Pomodoro-style focus timer, breaks, personalisation (theme/layout/background), motivational quotes and music, tab-switch focus enforcement, and streak tracking.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MySQL
- Auth/Security: bcrypt, JWT, CORS, rate limiting, Helmet (if enabled)

## Key Features
- User registration and login (JWT-based session)
- Focus timer with timestamp-based accuracy (prevents drift/tab freeze)
- Short and long break modes
- Theme, background, and layout customisation
- Motivational quotes + optional music
- Streak tracking based on completed focus sessions
- Secure API routes + protected user data

## Project Structure
focusbuddy/
frontend/
backend/
database.sql
README.md

## Setup Instructions

### 1) Database (MySQL)
Open MySQL Workbench and run:
- `database.sql` (or run the commands in order)
- Ensure database name is: `focusbuddy`

### 2) Backend
```bash
cd backend
npm install
# create .env from .env.example and fill DB + JWT secret
node src/server.js

## Setup Instructions

### 1) Database (MySQL)
Open MySQL Workbench and run:
- `database.sql` (or run the commands in order)
- Ensure database name is: `focusbuddy`

### 2) Backend
```bash
cd backend
npm install
# create .env from .env.example and fill DB + JWT secret
node src/server.js
## Coursework Submission Links
- GitHub Repository: https://github.com/surabhi024/focusbuddy
- Demo Video (Unlisted):https://youtu.be/3R8Z7snwCpc
