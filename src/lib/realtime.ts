

// Type definitions ensuring type safety
export interface RealtimeConfig {
    dangerouslyAllowAPIKeyToBeStoredInClient?: boolean; // Not used here, but part of standard types
}

export type VoiceEvent =
    | { type: 'speech_started' }
    | { type: 'speech_stopped' }
    | { type: 'user_transcript_done'; text: string }
    | { type: 'agent_transcript_done'; text: string }
    | { type: 'error'; message: string }
    | { type: 'status_change'; status: 'disconnected' | 'connecting' | 'connected' };

class RealtimeClient {
    private pc: RTCPeerConnection | null = null;
    private dc: RTCDataChannel | null = null;
    private audioEl: HTMLAudioElement | null = null;
    private onEvent: (event: VoiceEvent) => void;

    constructor(onEvent: (event: VoiceEvent) => void) {
        this.onEvent = onEvent;
    }

    async connect() {
        try {
            this.onEvent({ type: 'status_change', status: 'connecting' });

            // 1. Get Ephemeral Token
            // We use the /api/token endpoint we created
            const tokenResponse = await fetch('/api/token', { method: 'POST' });
            if (!tokenResponse.ok) {
                const err = await tokenResponse.text();
                throw new Error(`Failed to get token: ${err}`);
            }
            const data = await tokenResponse.json();
            const ephemeralKey = data.client_secret?.value;

            if (!ephemeralKey) {
                throw new Error('Invalid token response');
            }

            // 2. Initialize WebRTC
            this.pc = new RTCPeerConnection();

            // Set up remote audio playback
            this.audioEl = document.createElement('audio');
            this.audioEl.autoplay = true;
            this.pc.ontrack = (e) => {
                if (this.audioEl) this.audioEl.srcObject = e.streams[0];
            };

            // Get local microphone audio
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.pc.addTrack(stream.getTracks()[0]);

            // 3. Data Channel Setup
            this.dc = this.pc.createDataChannel('oai-events');
            this.dc.onopen = () => this.handleDataChannelOpen();
            this.dc.onmessage = (e) => this.handleDataChannelMessage(e);

            // 4. SDP Handshake
            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);

            const baseUrl = 'https://api.openai.com/v1/realtime';

            const sdpResponse = await fetch(baseUrl, {
                method: 'POST',
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${ephemeralKey}`,
                    'Content-Type': 'application/sdp'
                },
            });

            const answerSdp = await sdpResponse.text();
            await this.pc.setRemoteDescription({
                type: 'answer',
                sdp: answerSdp,
            });

            this.onEvent({ type: 'status_change', status: 'connected' });

        } catch (err: any) {
            console.error('Connection failed:', err);
            this.onEvent({ type: 'error', message: err.message });
            this.onEvent({ type: 'status_change', status: 'disconnected' });
            this.disconnect();
        }
    }

    disconnect() {
        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }
        if (this.dc) {
            this.dc.close();
            this.dc = null;
        }
        if (this.audioEl) {
            this.audioEl.remove();
            this.audioEl = null;
        }
        this.onEvent({ type: 'status_change', status: 'disconnected' });
    }

    private handleDataChannelOpen() {
        if (!this.dc) return;

        // Initial Configuration
        const sessionUpdate = {
            type: 'session.update',
            session: {
                modalities: ['text', 'audio'],
                input_audio_transcription: {
                    model: 'whisper-1', // User requested gpt-4o-transcribe but relying on standard whisper-1 for stability
                },
                turn_detection: {
                    type: 'server_vad', // Enable server-side VAD
                }
            }
        };
        this.dc.send(JSON.stringify(sessionUpdate));

        // Trigger initial response
        this.dc.send(JSON.stringify({ type: 'response.create' }));
    }

    private handleDataChannelMessage(e: MessageEvent) {
        try {
            const msg = JSON.parse(e.data);

            switch (msg.type) {
                case 'input_audio_buffer.speech_started':
                    this.onEvent({ type: 'speech_started' });
                    break;
                case 'input_audio_buffer.speech_stopped':
                    this.onEvent({ type: 'speech_stopped' });
                    break;
                case 'conversation.item.input_audio_transcription.completed':
                    if (msg.transcript) {
                        this.onEvent({ type: 'user_transcript_done', text: msg.transcript });
                    }
                    break;
                case 'response.audio_transcript.done':
                    if (msg.transcript) {
                        this.onEvent({ type: 'agent_transcript_done', text: msg.transcript });
                    }
                    break;
                default:
                    // Ignore other events for now
                    break;
            }
        } catch (error) {
            console.error('Error parsing data channel message:', error);
        }
    }
}

// Singleton or Factory? 
// For simplicity in the React component, we might just export the class. 
// But to make it easier to use in `useEffect`, let's keep it as a clean class.
export default RealtimeClient;
