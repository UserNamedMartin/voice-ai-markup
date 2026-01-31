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
  const [isConnecting, setIsConnecting] = useState(false); // Loading state
  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Realtime Client & Streams
  const realtimeClientRef = useRef<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Initialize client on mount
    async function init() {
      // ... same init logic ...
      // Note: For brevity in this tool call, I'm assuming the existing useEffect content 
      // will validly merge if I don't change lines 36-72. 
      // BUT replace_file_content requires exact target match. 
      // I need to replace the whole file content or a large chunk to be safe with the new state hook insertion.
      // Let's replace the whole upper part of the component including handleToggleSession.
      const RealtimeClient = (await import('@/lib/realtime')).default;
      realtimeClientRef.current = new RealtimeClient((event) => {
        // ... (event handling logic identical to before)
        const uiEvent = {
          id: Date.now() + Math.random().toString(),
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          message: '',
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

        setEvents(prev => [...prev, uiEvent].slice(-50));

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

  // Handle Muting Logic
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, localStream]);

  const handleToggleSession = async () => {
    if (!isActive && !isConnecting) {
      // Start Request
      setIsConnecting(true);

      // Clear previous session data immediately
      setEvents([]);
      setMessages([]);

      try {
        if (realtimeClientRef.current) {
          await realtimeClientRef.current.connect();
          // Connected! Now switch UI
          setLocalStream(realtimeClientRef.current.getLocalStream());
          setRemoteStream(realtimeClientRef.current.getRemoteStream());

          setIsActive(true);
        }
      } catch (e) {
        console.error("Connection failed", e);
        // Handle error state if needed
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Stop
      setIsActive(false);
      setIsConnecting(false);
      setIsMuted(false);
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
            {isActive ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '450px',
                padding: '0 2rem'
              }}>

                {/* Row 1: Visualizers */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  height: '60px',
                  width: '100%',
                  alignItems: 'stretch'
                }}>
                  {/* Agent Voice */}
                  <div style={{ flex: 1, height: '100%' }}>
                    <AudioVisualizer
                      stream={remoteStream}
                      label="Agent"
                      width="100%"
                      height="100%"
                    />
                  </div>

                  {/* User Mic */}
                  {/* User Mic (Fixed Width) - Clickable Mute Toggle */}
                  <div
                    onClick={() => setIsMuted(!isMuted)}
                    style={{
                      width: '60px',
                      height: '100%',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    <AudioVisualizer
                      stream={isMuted ? null : localStream}
                      label="You"
                      width="100%"
                      height="100%"
                    />
                    {/* Mic Icon Overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none' // Let clicks pass through to container
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                        {isMuted ? (
                          <>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                          </>
                        ) : (
                          <>
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                          </>
                        )}
                      </svg>
                    </div>
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
            ) : (
              /* IDLE / LOADING STATE: Start Button */
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <VoiceButton
                  isActive={isActive}
                  isLoading={isConnecting}
                  onClick={handleToggleSession}
                />
              </div>
            )}

          </div>

          {/* Idle State Elements (Only visible when NOT active) */}
          {!isActive && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1
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
          )}

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
