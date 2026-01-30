/**
 * Transcript Component
 * 
 * Real-time display of conversation messages.
 * Shows both user speech and AI responses as text.
 * Auto-scrolls to latest message.
 */

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
}

interface TranscriptProps {
    messages?: Message[];
}

export function Transcript({ messages = [] }: TranscriptProps) {
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
                Auto Transcribing
            </h3>

            {/* Nested Window for Data */}
            <div style={{
                overflowY: 'auto',
                flexGrow: 1,
                minHeight: 0, // CRITICAL: Allows flex child to scroll instead of pushing parent
                border: '1px solid #333',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                fontSize: '1rem',
                backgroundColor: '#000'
            }}>
                {messages.length === 0 ? (
                    <div style={{ opacity: 0.5 }}>Conversation will appear here...</div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            maxWidth: '80%',
                            padding: '1rem',
                            border: '1px solid white',
                            backgroundColor: msg.role === 'user' ? '#111' : 'black',
                        }}>
                            <strong style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                fontSize: '0.7rem',
                                opacity: 0.7,
                                letterSpacing: '1px'
                            }}>
                                {msg.role === 'user' ? 'You' : 'AI Agent'}
                            </strong>
                            <span style={{ lineHeight: '1.4' }}>{msg.text}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
