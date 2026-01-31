'use client'; // Client component for interactivity

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { VoiceButton } from '@/components/VoiceButton';
import { PhoneCall } from '@/components/PhoneCall';
import { EventLog } from '@/components/EventLog';
import { Transcript } from '@/components/Transcript';
import { AudioVisualizer } from '@/components/AudioVisualizer';

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

  // Realtime Client & Streams
  // We use a ref to keep the client instance stable across renders
  // Realtime Client & Streams

  // Actually, we need to import the class. Let's assume standard import at top.
  // But we need to define the refs first.
  const realtimeClientRef = useRef<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Initialize client on mount (or lazy load when needed, but mount is fine)
    // We need to dynamically import RealtimeClient because it uses browser APIs
    async function init() {
      const RealtimeClient = (await import('@/lib/realtime')).default;
      realtimeClientRef.current = new RealtimeClient((event) => {
        // Transform internal event to UI event
        const uiEvent = {
          id: Date.now() + Math.random().toString(),
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          message: '', // Will be filled below
        };

        switch (event.type) {
          case 'speech_started': uiEvent.message = 'Speech started'; break;
          case 'speech_stopped': uiEvent.message = 'Speech stopped'; break;
          case 'user_transcript_done': uiEvent.message = `User: ${event.text}`; break;
          case 'agent_transcript_done': uiEvent.message = `Agent: ${event.text}`; break;
          case 'status_change': uiEvent.message = `Status: ${event.status}`; break;
          case 'error': uiEvent.message = `Error: ${event.message}`; break;
          default: uiEvent.message = `Unknown event: ${(event as any).type}`;
        }

        setEvents(prev => [uiEvent, ...prev].slice(0, 50)); // Keep last 50 events

        if (event.type === 'user_transcript_done') {
          setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role: 'user', text: event.text }]);
        } else if (event.type === 'agent_transcript_done') {
          setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role: 'agent', text: event.text }]);
        }
      });
    }
    init();

    return () => {
      realtimeClientRef.current?.disconnect();
    };
  }, []);

  const handleToggleSession = async () => {
    if (!isActive) {
      // Start
      setIsActive(true);
      if (realtimeClientRef.current) {
        await realtimeClientRef.current.connect();
        // Get Access to streams for visualizers
        setLocalStream(realtimeClientRef.current.getLocalStream());
        setRemoteStream(realtimeClientRef.current.getRemoteStream());
      }
    } else {
      // Stop
      setIsActive(false);
      if (realtimeClientRef.current) {
        realtimeClientRef.current.disconnect();
        setLocalStream(null);
        setRemoteStream(null);
      }
    }
  };

  return (
    <main style={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      height: '100vh',
      padding: '2rem',
      gap: '2rem'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <Link href="/">
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Voice AI</h1>
          </Link>
          <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>Experimental voice interface prototype</p>
        </div>
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
        gridTemplateColumns: 'minmax(300px, 30%) 1fr',
        gap: '2rem',
        height: '100%',
        overflow: 'hidden'
      }}>

        {/* Left Column: Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid white',
          height: '100%',
          position: 'relative',
          backgroundColor: 'black',
          transition: 'all 0.5s ease'
        }}>

          {/* Container for Centered Content */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>

            {/* ACTIVE STATE: The "Cockpit" */}
            {/* ACTIVE STATE: The "Cockpit" */}
            {isActive && (
              <div className="fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '450px', // Slightly wider to accommodate visualizers
                padding: '0 2rem'
              }}>

                {/* Row 1: Visualizers */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  height: '60px', // Matches Stop Button height
                  width: '100%',
                  alignItems: 'stretch'
                }}>
                  {/* Agent Voice (Takes remaining space) */}
                  <div style={{ flex: 1, height: '100%' }}>
                    <AudioVisualizer
                      stream={remoteStream}
                      label="Agent"
                      width="100%"
                      height="100%"
                    />
                  </div>

                  {/* User Mic (Fixed Width) */}
                  <div style={{ width: '60px', height: '100%' }}>
                    <AudioVisualizer
                      stream={localStream}
                      label="You"
                      width="100%"
                      height="100%"
                    />
                  </div>
                </div>

                {/* Row 2: Stop Button */}
                <div style={{ width: '100%' }}>
                  <VoiceButton
                    isActive={isActive}
                    onClick={handleToggleSession}
                    fullWidth={true}
                  />
                </div>
              </div>
            )}

            {/* IDLE STATE: Start Button */}
            {!isActive && (
              <div style={{
                transition: 'opacity 0.3s ease',
                opacity: isActive ? 0 : 1, // Fade out
                pointerEvents: isActive ? 'none' : 'auto'
              }}>
                <VoiceButton
                  isActive={isActive}
                  onClick={handleToggleSession}
                />
              </div>
            )}

          </div>

          {/* Idle State Elements (Slide Down & Hide) */}
          <div className={`transition-all ${isActive ? 'slide-down-hidden' : ''}`} style={{
            display: 'flex',
            flexDirection: 'column',
            flex: isActive ? 0 : 1 // Collapse space when active
          }}>
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

            {/* Phone Call Input */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <PhoneCall
                onCall={(phone) => console.log('Calling:', phone)}
              />
            </div>
          </div>

        </div>

        {/* Right Column: Information */}
        <div style={{
          display: 'grid',
          gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '2rem',
          height: '100%',
          minHeight: 0
        }}>
          <EventLog events={events} />
          <Transcript messages={messages} />
        </div>

      </div>
    </main>
  );
}
