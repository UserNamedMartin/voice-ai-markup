import Link from 'next/link';

/**
 * Landing Page
 * 
 * Introduction and entry point.
 * Minimal content: description + CTA to voice screen.
 */
export default function Home() {
  return (
    <main>
      <h1>Voice AI</h1>
      <p>Talk to an AI assistant using your voice.</p>

      {/* TODO: Add more description about the solution */}

      <Link href="/voice">
        <button>Start Voice Session</button>
      </Link>
    </main>
  );
}
