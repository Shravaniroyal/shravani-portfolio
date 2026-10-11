# Shravani R S: AI Twin Portfolio

**Live site: https://shravanirs.vercel.app**

A personal portfolio for an AI / ML engineer, with an **AI twin chatbot** on the side that answers questions about my work and passes recruiter messages to me by email.

The design is hand-drawn (cream, navy and orange), with a small animated 2D scene for each project and a detail page that explains how every project was built.

## What it has

- **Portfolio pages:** about, skills, projects, publications, experience and contact, with scroll animations and counters.
- **Project detail pages** (`/projects/:slug`): the problem, how it was built, measured results, and plans for the future. Future items are clearly labelled as plans, not existing features.
- **AI twin chatbot:** answers questions about me using a curated fact sheet, so it does not invent details. Powered by an LLM through the Groq API.
- **Contact flow in the chat:** a visitor says they want to get in touch, picks a purpose (internship, job or general), gives a company when relevant, their name, and an email or LinkedIn link. The details are emailed to me, and the chat confirms whether the email was sent.
- **Say hi button** that starts a conversation with the twin.

## Projects featured

| Project | What it is |
|---|---|
| [TruthLens](https://github.com/Shravaniroyal/TruthLens) | Document fraud detection (Aadhaar, PAN, driving licence) with EfficientNet-B4 and Grad-CAM explanations |
| [BrainGuard AI](https://github.com/Shravaniroyal/brainGuard-ai) | Multi-model brain MRI screening, built for the MedGemma Impact Challenge 2026 |
| [Biometric Watermarking](https://github.com/Shravaniroyal/Biometric-Watermarking-System) | Rubik's Cube encryption based watermarking (JETIR 2024) |
| [AI Stock Intelligence](https://github.com/Shravaniroyal/stock-intelligence-agent) | Multi-agent stock analysis with CrewAI |
| [Space Traffic Density Prediction](https://github.com/Shravaniroyal/Space-Traffic-Density-Prediction) | Regression-based orbital traffic forecasting |

TruthLens results (98.18% test accuracy, 0.9971 ROC-AUC, macro F1 0.98) are measured on my own held-out test split. See the project repo for the code and evaluation.

## Tech stack

- **Client:** React 18, Vite, React Router, hand-written CSS and SVG scenes
- **Server:** Node.js, Express, CORS, Nodemailer or Resend for email
- **LLM:** Groq API (`openai/gpt-oss-20b`)
- **Hosting:** Vercel (client) and Render (server)

## Project structure

```
shravani-ai-avatar/
├── client/                 React + Vite frontend
│   ├── src/
│   │   ├── App.jsx            layout, chat side panel, routing
│   │   ├── pages/             Home.jsx, ProjectDetail.jsx
│   │   ├── components/        Nav.jsx, ChatPanel.jsx (chat + contact flow)
│   │   ├── data/              projects.js (all project content), heroScenes.js (SVG scenes)
│   │   └── styles.css
│   └── vercel.json            lets /projects/... links work on refresh
└── server/                 Express backend
    └── src/
        ├── index.js           /api/chat, /api/lead, /api/health, admin routes
        ├── groq.js            the chatbot's instructions and fact sheet
        ├── mailer.js          sends the "someone wants to contact you" email
        └── logger.js          chat and lead logs
```

## Run it locally

You need **Node.js 18 or newer**.

**1. Server**

```bash
cd server
npm install
cp .env.example .env      # then fill in your values
npm run dev               # http://localhost:8787
```

**2. Client** (second terminal)

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

Locally the client reaches the server through the Vite dev proxy, so you do not need to set an API address.

### Environment variables (server)

Never commit your real `.env`. It is listed in `.gitignore`.

| Variable | Purpose |
|---|---|
| `LLM_PROVIDER` | Which LLM backend to use (`groq`) |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | Model name, for example `openai/gpt-oss-20b` |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` | Gmail address and an App Password, used for email when running locally |
| `NOTIFY_EMAIL` | Where contact notifications are delivered |
| `RESEND_API_KEY` | Optional. When set, email is sent through Resend (use this online, see below) |
| `ADMIN_PASSCODE` | Protects the admin log page |
| `CLIENT_ORIGIN` | The website address allowed to call the server, for example `https://shravanirs.vercel.app` |

### Environment variable (client)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | The deployed server address, with no trailing slash. Leave it empty locally |

## Deploy

**Server on Render**

- Root directory `server`, build command `npm install`, start command `npm start`.
- Add the server variables above.
- Render's free tier often blocks Gmail's mail port, so set `RESEND_API_KEY` there and keep `NOTIFY_EMAIL` as the address you signed up to Resend with.
- The free server sleeps after about 15 minutes of inactivity. A free uptime monitor pinging `/api/health` every 5 to 10 minutes keeps it awake.

**Client on Vercel**

- Root directory `client`, framework preset Vite.
- Set `VITE_API_URL` to the Render server address, then redeploy.

## Notes

- The chatbot only knows what is in `server/src/groq.js`. To change what it says about me, edit that file.
- On Render's free tier the log files are wiped when the server restarts, so contact emails are the reliable record.
- This repository originally started as a 3D-avatar chatbot experiment. The current version replaces it with the hand-drawn portfolio described above.

## Contact

Email: rsshravani04@gmail.com
LinkedIn: https://linkedin.com/in/shravani-r-s-616b49290
GitHub: https://github.com/Shravaniroyal