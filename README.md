# Voice AI Application

> **For AI Agents**: This README is designed for agent onboarding. Read this first before making any changes.

## What This App Is

A voice AI application built with Next.js that enables:
1. **Browser-based voice conversations** with AI via OpenAI Realtime API (WebRTC)
2. **Phone call initiation** via ElevenLabs + Twilio integration

## Design Philosophy: Markup First

This is a **minimal markup version** - function over form:
- **Black background, white text** (inverted high-contrast theme)
- Simple rectangular shapes (no rounded corners)
- Minimal styling - just enough to be functional
- No branding, polish, or aesthetic decisions yet

**Why**: This bare-bones version will be converted to a branded, polished app later. The skeleton must work first.

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Minimal B&W styles
│   │
│   ├── voice/
│   │   └── page.tsx              # Voice agent screen
│   │
│   └── api/                      # Server-side routes (API keys stay here)
│       ├── token/route.ts        # Returns ephemeral token + session config
│       └── call/route.ts         # Initiates ElevenLabs phone call (placeholder)
│
├── components/                   # UI Components
│   ├── VoiceButton.tsx           # Start/stop with mic animations
│   ├── Transcript.tsx            # Live conversation display
│   ├── EventLog.tsx              # System events display
│   ├── PhoneCall.tsx             # Phone input + call button
│   └── AudioVisualizer.tsx       # Real-time frequency bars animation
│
└── lib/                          # Core business logic
    ├── realtime.ts               # OpenAI Realtime API (WebRTC client)
    ├── prompts.ts                # System prompts and instructions
    └── calling.ts                # ElevenLabs phone call logic
```

### Why This Structure

| Layer | Purpose | Key Constraint |
|-------|---------|----------------|
| `app/api/*` | Server-side only | **API keys cannot be in browser code** |
| `lib/` | Core logic | Framework-agnostic, all WebRTC/calling logic lives here |
| `components/` | UI pieces | Each handles its own complexity (e.g., mic animations) |
| `app/voice/page.tsx` | Page composition | Glues components + lib together |

---

## API Integrations

### OpenAI Realtime API (WebRTC)

- **Connection method**: WebRTC (not WebSocket - that's deprecated for browsers)
- **Auth flow**: 
  1. Client calls `/api/token` to get ephemeral session token
  2. Client uses token to establish WebRTC connection
  3. Audio streams bidirectionally, events via DataChannel

#### Session Configuration (All Server-Side)

All session settings are configured in **`/api/token/route.ts`** when creating the ephemeral token. This is the single source of truth.

| Setting | Value | Purpose |
|---------|-------|---------|
| `model` | `gpt-realtime` | Latest stable Realtime model |
| `voice` | `marin` | AI voice selection |
| `instructions` | `SYSTEM_PROMPT` | System prompt from `lib/prompts.ts` |
| `modalities` | `['text', 'audio']` | Enable both text and audio output |
| `input_audio_transcription.model` | `gpt-4o-transcribe` | Transcription model for user speech |
| `turn_detection.type` | `semantic_vad` | AI-powered turn detection |

The client (`lib/realtime.ts`) does **not** send session.update - it only triggers the initial response after connection.

### ElevenLabs Phone Calls

- **Status**: Not implemented (placeholder)
- **Endpoint**: `https://api.elevenlabs.io/v1/convai/twilio/outbound-call`
- **Flow**: Client → `/api/call` → ElevenLabs API → Twilio → User's phone

---

## Environment Variables

```
OPENAI_API_KEY=         # Required for Realtime API
ELEVENLABS_API_KEY=     # Required for phone calls (not implemented)
ELEVENLABS_AGENT_ID=    # Required for phone calls (not implemented)
```

---

## Implementation Status

### Done
- [x] Project structure scaffolded
- [x] Placeholder files created
- [x] Landing page (Grid layout, Black & White)

### TODO (Priority Order)
1. [x] Voice page layout
2. [x] `/api/token` endpoint (OpenAI ephemeral token)
3. [x] `lib/realtime.ts` (WebRTC connection)
4. [x] VoiceButton component (start/stop)
5. [x] Transcript component (live messages)
6. [x] EventLog component (system events)
7. [ ] `/api/call` endpoint (ElevenLabs)
8. [x] PhoneCall component

---

## Agent Guidelines

### CRITICAL: Architecture Feedback Required

**If at any point you determine that:**
- The current architecture doesn't fit the requirements
- A different approach would be significantly better
- What you're being asked to implement conflicts with the existing structure
- The implementation is heading in a wrong direction
- There's a better way to do something

**YOU MUST TELL THE USER IMMEDIATELY.**

Don't silently adapt or work around issues. Speak up. The architecture can and should evolve as we learn more during implementation.

### Development Approach

1. **Build incrementally**: One feature at a time, test as you go
2. **Keep it simple**: Hard-code values initially if needed
3. **Ask questions**: If integration details are unclear, ask
4. **Markup first**: Don't spend time on aesthetics yet

### Code Style

- TypeScript with explicit types
- Comments for complex logic only (not obvious code)
- Each file has a header comment explaining its purpose

---

## Running the App

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## Key Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| WebRTC over WebSocket | OpenAI recommends WebRTC for browsers (WebSocket deprecated) | 2026-01-30 |
| Ephemeral token pattern | Can't expose API key in browser; server generates short-lived token | 2026-01-30 |
| Single `lib/` folder | Simpler than `lib/realtime/` + `lib/elevenlabs/`; can split later if needed | 2026-01-30 |
| No `types/` folder | Types defined in the files that use them; can extract later if shared | 2026-01-30 |
| Prompts as Code | System prompts stored in `lib/prompts.ts` instead of markdown files for reliability | 2026-01-31 |
| Centered "Cockpit" Layout | Transitioning elements (Square User + Wide Agent visualizers) focuses user on the session | 2026-01-31 |
| Server-Side Session Config | All session settings (model, voice, instructions) moved to `/api/token` for single source of truth | 2026-01-31 |
| Lucide Icons | Switched from inline SVGs to Lucide React for cleaner code and maintainability | 2026-01-31 |

---

*Last updated: 2026-01-31*
