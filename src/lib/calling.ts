/**
 * ElevenLabs Calling Client
 * 
 * Handles phone call initiation via ElevenLabs + Twilio.
 * This is a thin client that calls /api/call endpoint.
 */

export interface CallState {
    status: 'idle' | 'initiating' | 'calling' | 'connected' | 'ended' | 'error';
    phoneNumber: string | null;
    errorMessage?: string;
}

// TODO: Implement initiateCall function
// - Validate phone number
// - Call /api/call endpoint
// - Return call status
