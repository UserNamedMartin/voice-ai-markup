/**
 * EventLog Component
 * 
 * Display system events as they happen.
 * Formatted to look like raw JSON logs from a Realtime API.
 */

import { useEffect, useRef } from 'react';

interface Event {
    id: string;
    time: string;
    message: string;
}

interface EventLogProps {
    events?: Event[];
}

export function EventLog({ events = [] }: EventLogProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [events]);

    const formatMessageToJSON = (msg: string) => {
        // Heuristic to make logs look technical
        if (msg.startsWith('User: ')) {
            return `{ "type": "conversation.item.created", "role": "user", "content": "${msg.replace('User: ', '')}" }`;
        }
        if (msg.startsWith('Agent: ')) {
            return `{ "type": "response.audio_transcript.done", "role": "assistant", "content": "${msg.replace('Agent: ', '')}" }`;
        }
        if (msg.includes('Speech started')) {
            return `{ "type": "input_audio_buffer.speech_started" }`;
        }
        if (msg.includes('Speech stopped')) {
            return `{ "type": "input_audio_buffer.speech_stopped" }`;
        }
        if (msg.startsWith('Status: ')) {
            return `{ "type": "connection.status", "status": "${msg.replace('Status: ', '')}" }`;
        }
        if (msg.startsWith('Error: ')) {
            return `{ "type": "error", "message": "${msg.replace('Error: ', '')}" }`;
        }

        // Default generic wrapper
        return `{ "type": "log", "message": "${msg}" }`;
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            border: '2px solid white',
            padding: '1rem',
            backgroundColor: 'black'
        }}>
            <h3 style={{
                textTransform: 'uppercase',
                borderBottom: '2px solid white',
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
            }}>
                Under the Hood
            </h3>

            {/* Nested Window for Data */}
            <div style={{
                overflowY: 'auto',
                flexGrow: 1,
                minHeight: 0,
                border: '1px solid #333',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                fontSize: '0.85rem',
                backgroundColor: '#0a0a0a',
                color: '#888', // Base gray color
                fontFamily: 'Overpass Mono, monospace' // Assuming available or fallback
            }}>
                {events.length === 0 ? (
                    <div style={{ opacity: 0.5 }}>Waiting for socket events...</div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} style={{
                            display: 'flex',
                            gap: '1rem',
                            borderBottom: '1px solid #1a1a1a',
                            paddingBottom: '0.2rem',
                            alignItems: 'baseline'
                        }}>
                            <span style={{
                                color: '#444', // Very dim timestamp
                                fontSize: '0.75rem',
                                minWidth: '70px',
                                flexShrink: 0,
                                userSelect: 'none'
                            }}>
                                {event.time}
                            </span>
                            <span style={{
                                wordBreak: 'break-all',
                                color: '#999' // Light gray for technical text
                            }}>
                                {formatMessageToJSON(event.message)}
                            </span>
                        </div>
                    ))
                )}
                {/* Invisible element to scroll to */}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
