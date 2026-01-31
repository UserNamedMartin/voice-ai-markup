/**
 * MobileBlocker Component
 * 
 * Displays a full-screen blocking overlay on mobile devices.
 * Visible only when screen width is < 768px.
 */

export function MobileBlocker() {
    return (
        <div className="mobile-blocker" style={{
            display: 'none', // Hidden by default (desktop)
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: 'black',
            color: 'white',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            border: '8px solid white' // Emphasize the "barrier"
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textTransform: 'uppercase'
            }}>
                Desktop Only
            </h1>
            <p style={{
                fontSize: '1rem',
                lineHeight: '1.5',
                maxWidth: '300px'
            }}>
                This prototype is currently designed for desktop experience only. <br /><br />
                Please switch to a larger screen.
            </p>
        </div>
    );
}
