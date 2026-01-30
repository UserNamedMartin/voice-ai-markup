import Link from 'next/link';

/**
 * Landing Page
 * Structure: Sticky layout, unscrollable, Black & White
 */
export default function Home() {
  return (
    <main style={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto', // Header, Content, Footer
      height: '100vh',
      padding: '2rem',
      gap: '2rem'
    }}>
      {/* Header: Title + Logo */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        {/* Left: Titles */}
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Voice AI</h1>
          <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Experimental voice interface prototype</p>
        </div>

        {/* Right: Logo Box */}
        <div style={{
          width: '150px',
          height: '75px',
          border: '2px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '2rem', // Visible margin
          textTransform: 'uppercase',
          fontWeight: 'bold',
          fontSize: '0.8rem'
        }}>
          Logo
        </div>
      </header>

      {/* Main Content Grid 
          Rows: Equal height (1fr 1fr) so Description height == Features/Specs height
      */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '1rem',
        height: '100%'
      }}>
        {/* First large section for description - spans full width */}
        <div style={{
          gridColumn: '1 / -1',
          border: '2px solid white',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>Main Project Description</h2>
          <p style={{ lineHeight: '1.5' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* The second section: Features */}
        <div style={{
          border: '2px solid white',
          padding: '1.5rem'
        }}>
          <h3 style={{ marginBottom: '0.5rem', textTransform: 'uppercase' }}>Features</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
            Vivamus hendrerit arcu sed erat molestie vehicula.
          </p>
        </div>

        {/* The third section: Specs */}
        <div style={{
          border: '2px solid white',
          padding: '1.5rem'
        }}>
          <h3 style={{ marginBottom: '0.5rem', textTransform: 'uppercase' }}>Technical Specs</h3>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
            totam rem aperiam.
          </p>
        </div>
      </div>

      {/* Large CTA Button */}
      <Link href="/voice" style={{ display: 'block' }}>
        <button style={{
          width: '100%',
          padding: '2rem',
          fontSize: '1.5rem',
          background: 'white', /* Inverted for high contrast */
          color: 'black',
          border: 'none',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Enter Voice Session
        </button>
      </Link>
    </main>
  );
}
