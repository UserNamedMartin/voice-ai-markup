/**
 * VoiceButton Component
 * 
 * Start/stop voice conversation with AI.
 * Includes prominent visual button.
 */

interface VoiceButtonProps {
    isActive?: boolean;
    onClick: () => void;
    fullWidth?: boolean;
}

export function VoiceButton({ isActive = false, onClick, fullWidth = false }: VoiceButtonProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: fullWidth ? '0' : '2rem',
            height: fullWidth ? 'auto' : '100%',
            width: '100%'
        }}>
            {(!isActive && !fullWidth) && (
                <div style={{
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textAlign: 'center'
                }}>
                    Talk with the AI Agent Here
                </div>
            )}

            <button
                onClick={onClick}
                style={{
                    width: fullWidth ? '100%' : '200px',
                    height: '60px',
                    border: '2px solid white',
                    background: isActive ? 'white' : 'black',
                    color: isActive ? 'black' : 'white',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                }}
            >
                {isActive ? 'Stop Session' : 'Start Session'}
            </button>
        </div>
    );
}
