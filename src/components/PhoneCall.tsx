'use client';

import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import { isValidPhoneNumber } from 'libphonenumber-js';
import 'react-international-phone/style.css';

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
}

export function PhoneCall({ onCall, onFocus, onBlur }: PhoneCallProps) {
    const [phone, setPhone] = useState('');

    // Validate using libphonenumber-js
    const isValid = phone.length > 3 && isValidPhoneNumber(phone);

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
                <PhoneInput
                    defaultCountry="us"
                    value={phone}
                    onChange={(phone: string) => setPhone(phone)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disableDialCodeAndPrefix={true}
                    showDisabledDialCodeAndPrefix={true}
                    inputClassName="phone-input-field"
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
                    onClick={() => isValid && onCall(phone)}
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
