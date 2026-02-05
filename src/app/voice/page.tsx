'use client'; // Client component for interactivity

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mic, MicOff } from 'lucide-react';
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
  const [isPhoneMode, setIsPhoneMode] = useState(false); // New state for Phone Mode focus
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState<string | null>(null);

  // ... (existing effects remain the same) ...

  // Realtime Client & Streams
  const realtimeClientRef = useRef<any>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function init() {
      const RealtimeClient = (await import('@/lib/realtime')).default;
      realtimeClientRef.current = new RealtimeClient((event) => {
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

  const handlePhoneCall = async (phone: string) => {
    setPhoneLoading(true);
    setPhoneSuccess(null);
    try {
      const res = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (res.ok) {
        setPhoneSuccess("You will receive a call in a moment.");
      } else {
        const error = await res.json();
        alert(`Failed to initiate call: ${error.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error initiating call");
    } finally {
      setPhoneLoading(false);
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
      {/* ... Header ... */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        {/* ... (Header content same as before) ... */}
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



          {/* Left Column content container */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: '100%',
            overflow: 'hidden'
          }}>

            {/* CASE 1: Active Voice Session ("Cockpit") */}
            {isActive ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '450px',
                padding: '0 2rem'
              }}>
                {/* Visualizers Row */}
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
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}>
                      {isMuted ? (
                        <MicOff size={24} color="white" style={{ opacity: 0.5 }} />
                      ) : (
                        <Mic size={24} color="white" style={{ opacity: 0.5 }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Stop Button Row */}
                <div style={{ width: '100%' }}>
                  <VoiceButton
                    isActive={isActive}
                    onClick={handleToggleSession}
                    fullWidth={true}
                  />
                </div>
              </div>
            ) : (
              /* CASE 2: Idle State (Unified Container) */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%', // full width
                height: '100%' // full height
              }}>

                {/* Back Button (Only in Phone Mode) */}
                {isPhoneMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent re-triggering focus
                      setIsPhoneMode(false);
                      setPhoneSuccess(null); // Reset success state so input form appears again
                    }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      zIndex: 20,
                      lineHeight: 1
                    }}
                  >
                    <span style={{ position: 'relative', top: '-1.5px' }}>←</span> Back
                  </button>
                )}

                {/* Top Section: Voice Button (Hidden in Phone Mode) */}
                {/* We conditionally render it so it unmounts, allowing PhoneCall to take up space. */}
                {!isPhoneMode && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0 // Allow shrinking
                  }}>
                    <VoiceButton
                      isActive={isActive}
                      isLoading={isConnecting}
                      onClick={handleToggleSession}
                    />
                  </div>
                )}

                {/* Separator (Hidden in Phone Mode) */}
                {!isPhoneMode && (
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
                )}

                {/* Bottom Section: Phone Call (Always mounted so it preserves state) */}
                {/* It expands to fill available space (flex: 1) */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 0,
                  transition: 'all 0.3s ease' // Smooth transition if possible
                }}>
                  <div style={{ width: '100%', maxWidth: '350px' }}>
                    <PhoneCall
                      onCall={handlePhoneCall}
                      // When clicking, we switch to Phone Mode. 
                      // Since component stays mounted, focus/dropdown state should persist.
                      onFocus={() => {
                        if (!isPhoneMode) setIsPhoneMode(true);
                      }}
                      isLoading={phoneLoading}
                      successMessage={phoneSuccess}
                    // autoFocus logic:
                    // If we are already in phone mode, we probably don't need to force focus via prop if the user clicked.
                    // But if we want consistent behavior, passing correct prop helps.
                    // Actually, if we preserve instance, the 'autoFocus' prop on mount doesn't re-run.
                    />
                  </div>
                </div>

              </div>
            )}

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
