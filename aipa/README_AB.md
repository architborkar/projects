# AIPA

AIPA (AI Personal Assistant) is a local AI-powered productivity operating system built with Next.js and OpenRouter.

It behaves like a conversational personal assistant that helps track:

- Business goals
- Weekly tasks
- Diet and nutrition
- Exercise and fitness
- Long-term AI memory

The interface is designed to feel like chatting with a real PA through a WhatsApp-style UI.

---

# Features

## AI Assistant Chat
- Conversational AI assistant
- Persistent chat history
- Daily startup conversations
- Smart contextual responses

## Smart AI Memory
AIPA intelligently:
- summarizes progress
- extracts useful updates
- categorizes memories
- avoids bloated context

Instead of saving every message blindly, AIPA stores concise AI-generated summaries.

---

# Modules

## Business Module
- Monthly goals
- Weekly tasks
- AI-generated progress notes

## Diet Module
- Diet goals
- Daily food logs
- Nutrition tracking memory

## Exercise Module
- Workout plans
- Exercise logs
- AI fitness tracking

---

# Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- OpenRouter API
- DeepSeek Chat

---

# Local-First Architecture

AIPA currently runs fully locally.

Data is stored in JSON files:

```text
data/
  business.json
  diet.json
  exercise.json
  chat.json
```

This keeps the setup simple and private.

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your-repo-url>
```

---

## 2. Open Project

```bash
cd aipa
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Create Environment File

Create a file named:

```text
.env.local
```

Add:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Get API key from:

https://openrouter.ai

---

## 5. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Optional One-Click Local Launcher

You can create:

```text
start-aipa.bat
```

with:

```bat
@echo off

cd /d YOUR_PROJECT_PATH

start cmd /k "npm run dev"

timeout /t 5

start chrome http://localhost:3000
```

This launches AIPA automatically in Chrome.

---

# Current Capabilities

- Persistent AI chat
- Smart memory summarization
- Business/diet/exercise segregation
- AI-generated notes
- Daily startup review
- Dark modern UI
- Local JSON persistence

---

# Future Improvements

- Mobile responsiveness
- Notifications/reminders
- Dashboard metrics
- Calendar integration
- Voice assistant mode
- Cloud sync
- Authentication
- Electron desktop app

---

# Security Notes

Do NOT upload:

```text
.env.local
node_modules
.next
```

Your `.gitignore` already handles this.

---

# License

MIT