/**
 * VoiceButton Component
 * 
 * Start/stop voice conversation with AI.
 * Includes prominent visual button.
 */

interface VoiceButtonProps {
    isActive?: boolean;
    onClick: () => void;
}

export function VoiceButton({ isActive = false, onClick }: VoiceButtonProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            height: '100%',
            width: '100%'
        }}>
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

            <button
                onClick={onClick}
                style={{
                    width: '200px',
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
