/**
 * ElevenLabs Phone Call Endpoint
 * 
 * Initiates an outbound phone call via ElevenLabs + Twilio.
 * Endpoint: https://api.elevenlabs.io/v1/convai/twilio/outbound-call
 */

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone } = body;

        if (!phone) {
            return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
        }

        const agentId = process.env.ELEVENLABS_AGENT_ID;
        const apiKey = process.env.ELEVENLABS_API_KEY;
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

        if (!agentId || !apiKey || !twilioPhone) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch(`https://api.elevenlabs.io/v1/convai/outbound-call`, {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agent_id: agentId,
                call_settings: {
                    to_number: phone,
                    from_number: twilioPhone
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Call endpoint error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
