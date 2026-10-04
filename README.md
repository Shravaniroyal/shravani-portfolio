# Shravani's AI Avatar — Real 3D Chatbot

A chatbot with an actual rigged 3D character (Three.js + React Three Fiber) that walks
to the center, waves and greets, walks to a corner and stands there, then walks back
and waves goodbye when the chat wraps up. Backend logs every conversation and emails
you when someone wants to be contacted.

## What's in here

```
shravani-ai-avatar/
├── server/     ← Node/Express backend: talks to Claude, logs chats, sends email
└── client/     ← React + Three.js frontend: the 3D avatar + chat UI
```

---

## 1. Install prerequisites

- **Node.js 18+** — download from https://nodejs.org (LTS version is fine)
- VS Code is perfect for this, no extra extensions required.

---

## 2. Get a rigged 3D avatar (the actual character model)

This project expects a **rigged, Mixamo-compatible humanoid `.glb` file**. The easiest
free source:

1. Go to **https://readyplayer.me** and create a free avatar (you can upload a photo
   and it'll generate a stylized 3D version, or customize one manually to look like you).
2. Once created, Ready Player Me gives you a **direct `.glb` URL**
   (looks like `https://models.readyplayer.me/xxxxxxxx.glb`). You can either:
   - Point `MODEL_URL` in `client/src/App.jsx` straight at that URL (simplest), **or**
   - Download the `.glb` and place it at `client/public/avatar.glb` (works offline,
     recommended for reliability).
3. Ready Player Me avatars use the same skeleton naming as **Mixamo**, so their
   animations plug in directly — that's why the next step works.

## 3. Get animation clips (idle, walk, wave)

1. Go to **https://www.mixamo.com** (free Adobe account required).
2. Upload your Ready Player Me `.glb` on Mixamo (or use their default character just
   to preview) so animations auto-retarget to your rig.
3. Search for and download these three animations **as `.fbx`, "Without Skin"**:
   - An idle animation (search "Idle" or "Breathing Idle")
   - A walking animation (search "Walking")
   - A waving animation (search "Waving" or "Standing Greeting")
4. Rename them exactly to `idle.fbx`, `walk.fbx`, `wave.fbx` and place them in
   `client/public/animations/`.

That's the whole asset pipeline — same idea as the tutorial you found, just using
Ready Player Me instead of building a custom rig from scratch (which needs Blender
and is a much bigger undertaking).

---

## 4. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Now open `.env` and fill in:
- `ANTHROPIC_API_KEY` — get one at https://console.anthropic.com (Settings → API Keys).
  This is a paid API — check current pricing on Anthropic's site before heavy use.
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — for sending you contact-request emails.
  You need an **App Password** (not your real Gmail password): turn on 2-Step
  Verification on your Google account, then create one at
  https://myaccount.google.com/apppasswords
- `NOTIFY_EMAIL` — where those alerts should land (can be the same Gmail address)
- `ADMIN_PASSCODE` — make up any private passcode; protects your log viewer

Run it:
```bash
npm run dev
```
Server starts at `http://localhost:8787`.

---

## 5. Set up the frontend

In a **second terminal**:
```bash
cd client
npm install
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`).

---

## 6. Reading your chat logs

With the server running, open:
```
http://localhost:8787/admin.html
```
Enter the `ADMIN_PASSCODE` you set in `.env`. You'll see:
- **Conversations** — every visitor session, every question asked and every reply given
- **Contact Leads** — everyone who said they wanted to be contacted, with their name/email

Logs are stored as plain files at `server/logs/chats.jsonl` and `server/logs/leads.jsonl`
— you can open those directly too, one JSON object per line.

---

## 7. Deploying it so it's live on the internet (optional, later)

This is currently set up to run on your own machine. To make it a public link:
- Frontend: build with `npm run build` in `client/`, deploy the `dist/` folder to
  Vercel or Netlify (free tiers work fine).
- Backend: deploy the `server/` folder to something like Render or Railway (free
  tiers available), and set the same environment variables there.
- Update the frontend's API calls to point at your deployed backend URL instead of
  `/api/...` (currently proxied to `localhost:8787` during development).

Ask me when you're ready for this step and I'll walk you through it in detail.

---

## Notes / things that may need tweaking

- **Animation retargeting**: Ready Player Me + Mixamo usually works out of the box,
  but if the character looks distorted when animating, the most common fix is
  re-uploading your specific avatar to Mixamo (not using their default character)
  so the retargeting matches your exact proportions.
- **Model size**: `.glb` files and animation `.fbx` files can be a few MB each —
  totally fine for local dev, just something to be aware of for load times once
  deployed.
- **API costs**: every chat message calls the Claude API, which costs a small amount
  per request. Keep an eye on usage in the Anthropic console.
