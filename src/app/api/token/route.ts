import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST() {
    try {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'OPENAI_API_KEY is not set' },
                { status: 500 }
            );
        }

        // Use 'gpt-realtime' which aliases to the latest stable model version
        const model = 'gpt-realtime';

        const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                voice: 'marin',
                instructions: SYSTEM_PROMPT,
                // Session behavior settings (previously set client-side)
                modalities: ['text', 'audio'],
                input_audio_transcription: {
                    model: 'gpt-4o-transcribe',
                },
                turn_detection: {
                    type: 'semantic_vad',
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `OpenAI API error: ${response.status} ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating session:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
