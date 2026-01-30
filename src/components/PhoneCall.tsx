'use client';

import { useState } from 'react';

/**
 * PhoneCall Component
 * 
 * Phone number input with country code dropdown and "Call Me" button.
 * Initiates voice call to the provided number.
 */

interface PhoneCallProps {
    onCall: (phone: string) => void;
}

export function PhoneCall({ onCall }: PhoneCallProps) {
    const [phoneNumber, setPhoneNumber] = useState('');

    // Basic validation: ensure phone number has enough digits (e.g., 7+)
    const isValid = phoneNumber.replace(/\D/g, '').length >= 7;

    return (
        <div style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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
                Let the AI Agent call you
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={{
                        padding: '0.75rem',
                        background: 'black',
                        border: '2px solid white',
                        color: 'white',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        outline: 'none',
                        textAlign: 'center'
                    }}
                />

                <button
                    onClick={() => isValid && onCall(phoneNumber)}
                    disabled={!isValid}
                    style={{
                        padding: '0.75rem',
                        background: isValid ? 'white' : '#333',
                        border: isValid ? '2px solid white' : '2px solid #333',
                        color: isValid ? 'black' : '#666',
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        cursor: isValid ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        width: '100%'
                    }}
                >
                    Call Me
                </button>
            </div>
        </div>
    );
}
