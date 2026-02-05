'use client';

import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { isValidPhoneNumber } from 'libphonenumber-js';
import 'react-international-phone/style.css';
import { PhoneOutgoing } from 'lucide-react';

/**
 * PhoneCall Component
 * 
 * Phone number input with country code dropdown and "Call Me" button.
 * Uses react-international-phone for formatting and libphonenumber-js for validation.
 */

interface PhoneCallProps {
    onCall: (phone: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    isLoading?: boolean;
    successMessage?: string | null;
    autoFocus?: boolean;
}

export function PhoneCall({ onCall, onFocus, onBlur, isLoading = false, successMessage = null, autoFocus = false }: PhoneCallProps) {
    const [phone, setPhone] = useState('');

    // We can't easily auto-focus the library component programmatically without a ref, 
    // but react-international-phone doesn't standardly expose an 'inputRef' that works easily with autoFocus.
    // However, we can use the 'autoFocus' prop on the PhoneInput if we render it conditionally, 
    // or just rely on the user clicking.
    // Spec: "cursor is disappearing... have to click one more time".
    // Solution: We pass 'autoFocus' to the library component.


    // Validate using libphonenumber-js
    const isValid = phone.length > 5 && isValidPhoneNumber(phone);

    if (successMessage) {
        return (
            <div style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                textAlign: 'center',
                animation: 'fadeIn 0.5s ease'
            }}>
                <div style={{ marginBottom: '1rem' }}>
                    <PhoneOutgoing size={48} color="white" />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Calling you now...</h3>
                <p style={{ fontSize: '1.1rem', color: '#888' }}>{successMessage}</p>
            </div>
        );
    }

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

            <div
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}
                onClick={(e) => {
                    // Start Call mode if clicking anywhere in this container (including country dropdown)
                    onFocus && onFocus();
                }}
            >
                <PhoneInput
                    defaultCountry="us"
                    value={phone}
                    onChange={(phone: string) => setPhone(phone)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disableDialCodeAndPrefix={true}
                    showDisabledDialCodeAndPrefix={true}
                    inputClassName="phone-input-field"
                    inputProps={{
                        autoFocus: autoFocus
                    }}
                    countrySelectorStyleProps={{
                        buttonClassName: 'phone-country-button',
                        dropdownStyleProps: {
                            className: 'phone-country-dropdown',
                            listItemClassName: 'phone-country-item'
                        }
                    }}
                    dialCodePreviewStyleProps={{
                        className: 'phone-dial-code-preview'
                    }}
                />

                <button
                    onClick={() => isValid && !isLoading && onCall(phone)}
                    disabled={!isValid || isLoading}
                    style={{
                        padding: '0.75rem',
                        background: isValid && !isLoading ? 'white' : '#111',
                        border: isValid && !isLoading ? '2px solid white' : '2px solid #333',
                        color: isValid && !isLoading ? 'black' : '#444',
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        width: '100%',
                        opacity: isLoading ? 0.7 : 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {isLoading ? 'Wait...' : 'Call Me'}
                </button>
            </div>
        </div>
    );
}
