/**
 * EventLog Component
 * 
 * Display system events as they happen.
 * Examples: "Connecting...", "AI is thinking...", "Processing audio..."
 * Helps user understand what's happening in the background.
 */

interface Event {
    id: string;
    time: string;
    message: string;
}

interface EventLogProps {
    events?: Event[];
}

export function EventLog({ events = [] }: EventLogProps) {
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
                minHeight: 0, // CRITICAL: Allows flex child to scroll instead of pushing parent
                border: '1px solid #333', // Subtle inner border
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '1rem',
                backgroundColor: '#000'
            }}>
                {events.length === 0 ? (
                    <div style={{ opacity: 0.5 }}>Waiting for system events...</div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            border: '1px solid #333',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                opacity: 0.5,
                                fontSize: '0.8rem',
                                minWidth: '70px'
                            }}>[{event.time}]</span>
                            <span style={{ color: '#ccc' }}>{event.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
