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
| `input_audio_noise_reduction` | `near_field` | Server-side noise suppression |

| `input_audio_noise_reduction` | `near_field` | Server-side noise suppression |

The client (`lib/realtime.ts`) does **not** send session.update - it only triggers the initial response after connection.

### Audio Pipeline Strategy

To avoid "double processing" artifacts (robotic/underwater voice), we split responsibilities:
1.  **Browser (`lib/realtime.ts`)**: Handles `echoCancellation` (mandatory) and `autoGainControl`. **`noiseSuppression` is DISABLED** here.
2.  **Server (OpenAI)**: Handles `noiseReduction` (via `input_audio_noise_reduction: 'near_field'`).

**Flow**: `Microphone` → `Browser Echo Cancellation` → `OpenAI Server Noise Reduction` → `Model`

### ElevenLabs Phone Calls

- **Status**: Implemented (Basic "Managed Service" integration)
- **Endpoint**: `https://api.elevenlabs.io/v1/convai/twilio/outbound-call`
- **Flow**: Client → `/api/call` → ElevenLabs API → Twilio → User's phone
- **Note**: This uses the "Easy" mode where ElevenLabs manages the call leg. Live transcripts are not available in this mode.

---

## Environment Variables

```
OPENAI_API_KEY=         # Required for Realtime API
ELEVENLABS_API_KEY=     # Required for outbound calls
ELEVENLABS_AGENT_ID=    # Required for outbound calls
ELEVENLABS_PHONE_NUMBER_ID= # Required for outbound calls (ID from ElevenLabs dashboard, starts with phnum_)
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
7. [x] `/api/call` endpoint (ElevenLabs)
8. [x] PhoneCall component (with validation & loading states)

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
| ElevenLabs Managed Mode | Selected "Managed Service" integration for phone calls to avoid complex WebSocket relay infrastructure for MVP | 2026-02-05 |
| Unified Idle Layout | Kept `PhoneCall` component mounted during state transitions to preserve focus and dropdown interactions | 2026-02-05 |
| Phone Number ID | Switched from raw `TWILIO_PHONE_NUMBER` to `ELEVENLABS_PHONE_NUMBER_ID` as Managed Service requires the ID, not the number string | 2026-02-05 |
| Explicit Audio Constraints | Explicitly enabled `echoCancellation` and `autoGainControl` in WebRTC client; disabled `noiseSuppression` to use server-side alternative | 2026-02-05 |
| Server-Side Noise Cancellation | Enabled `input_audio_noise_reduction: 'near_field'` in OpenAI session config to replace browser's inferior suppression | 2026-02-05 |

---

*Last updated: 2026-02-05*
