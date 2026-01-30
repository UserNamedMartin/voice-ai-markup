# Voice AI Application

> **For AI Agents**: This README is designed for agent onboarding. Read this first before making any changes.

## What This App Is

A voice AI application built with Next.js that enables:
1. **Browser-based voice conversations** with AI via OpenAI Realtime API (WebRTC)
2. **Phone call initiation** via ElevenLabs + Twilio integration

## Design Philosophy: Markup First

This is a **minimal markup version** - function over form:
- Black and white colors only
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
│       ├── token/route.ts        # Returns ephemeral token for WebRTC
│       └── call/route.ts         # Initiates ElevenLabs phone call
│
├── components/                   # UI Components
│   ├── VoiceButton.tsx           # Start/stop with mic animations
│   ├── Transcript.tsx            # Live conversation display
│   ├── EventLog.tsx              # System events display
│   └── PhoneCall.tsx             # Phone input + call button
│
└── lib/                          # Core business logic
    ├── realtime.ts               # OpenAI Realtime API (WebRTC client)
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
- **Key file**: `src/lib/realtime.ts`

### ElevenLabs Phone Calls

- **Endpoint**: `https://api.elevenlabs.io/v1/convai/twilio/outbound-call`
- **Flow**: Client → `/api/call` → ElevenLabs API → Twilio → User's phone
- **Key file**: `src/lib/calling.ts`

---

## Environment Variables

```
OPENAI_API_KEY=         # Required for Realtime API
ELEVENLABS_API_KEY=     # Required for phone calls
ELEVENLABS_AGENT_ID=    # Required for phone calls (Conversational AI agent)
```

---

## Implementation Status

### Done
- [x] Project structure scaffolded
- [x] Placeholder files created

### TODO (Priority Order)
1. [ ] Landing page (basic content)
2. [ ] Voice page layout
3. [ ] `/api/token` endpoint (OpenAI ephemeral token)
4. [ ] `lib/realtime.ts` (WebRTC connection)
5. [ ] VoiceButton component (start/stop)
6. [ ] Transcript component (live messages)
7. [ ] EventLog component (system events)
8. [ ] `/api/call` endpoint (ElevenLabs)
9. [ ] PhoneCall component

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
| WebRTC over WebSocket | OpenAI recommends WebRTC for browsers (WebSocket deprecated) | 2024-01-30 |
| Ephemeral token pattern | Can't expose API key in browser; server generates short-lived token | 2024-01-30 |
| Single `lib/` folder | Simpler than `lib/realtime/` + `lib/elevenlabs/`; can split later if needed | 2024-01-30 |
| No `types/` folder | Types defined in the files that use them; can extract later if shared | 2024-01-30 |

---

*Last updated: 2024-01-30*
