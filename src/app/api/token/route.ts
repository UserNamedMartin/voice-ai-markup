/**
 * OpenAI Realtime API Token Endpoint
 * 
 * Returns an ephemeral token for WebRTC connection.
 * This keeps the OPENAI_API_KEY server-side only.
 */

import { NextResponse } from 'next/server';

export async function POST() {
    // TODO: Call OpenAI API to get ephemeral session token
    // TODO: Return token to client

    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
