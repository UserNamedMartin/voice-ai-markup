'use client'; // Client component for interactivity

import { useState } from 'react';
import Link from 'next/link';
import { VoiceButton } from '@/components/VoiceButton';
import { PhoneCall } from '@/components/PhoneCall';
import { EventLog } from '@/components/EventLog';
import { Transcript } from '@/components/Transcript';

/**
 * Voice Agent Screen
 * 
 * Layout:
 * - Header (Same as Home)
 * - Grid 30/70 (Left: Controls, Right: Events/Transcript)
 */

export default function VoicePage() {
  // --- STATE ---
  const [isActive, setIsActive] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  return (
    <main style={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr', // Header, Content
      height: '100vh',
      padding: '2rem',
      gap: '2rem'
    }}>
      {/* Header: Title + Logo (Copied from Landing for consistency) */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        {/* Left: Titles */}
        <div>
          <Link href="/">
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Voice AI</h1>
          </Link>
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
          marginLeft: '2rem',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          fontSize: '0.8rem'
        }}>
          Logo
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 30%) 1fr', // 30% Left (min 300px), Remainder Right
        gap: '2rem',
        height: '100%',
        overflow: 'hidden' // Prevent internal scroll from breaking layout
      }}>

        {/* Left Column: Controls (Single Box) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid white',
          height: '100%',
          position: 'relative',
          backgroundColor: 'black'
        }}>
          {/* Top Half: Voice Button */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <VoiceButton
              isActive={isActive}
              onClick={() => setIsActive(!isActive)}
            />
          </div>

          {/* Separator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            color: '#666',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            flexShrink: 0
          }}>
            <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
            <span style={{ padding: '0 1rem' }}>OR</span>
            <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
          </div>

          {/* Bottom Half: Phone Call */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <PhoneCall
              onCall={(phone) => console.log('Calling:', phone)}
            />
          </div>
        </div>

        {/* Right Column: Information */}
        <div style={{
          display: 'grid',
          gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)', // Equal height for logs and transcript, prevents blowout
          gap: '2rem',
          height: '100%',
          minHeight: 0 // CRITICAL for grid children scrolling
        }}>
          {/* Top: Under the Hood (Event Log) */}
          <EventLog events={events} />

          {/* Bottom: Auto Transcribing (Transcript) */}
          <Transcript messages={messages} />
        </div>

      </div>
    </main>
  );
}

