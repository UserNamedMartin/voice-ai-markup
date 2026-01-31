import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    stream: MediaStream | null;
    label: string;
    width?: string | number; // CSS width or number
    height?: string | number;
    // barCount removed or ignored
}

export function AudioVisualizer({ stream, label, width = '120px', height = '80px' }: AudioVisualizerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!stream || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            // Initialize Audio Content
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Visual Settings
            const barWidth = 2; // Fixed match border width (2px)
            const gap = 4; // Fixed gap between bars
            const sidePadding = 16; // Space on left and right

            const draw = () => {
                animationRef.current = requestAnimationFrame(draw);

                // Dynamic Resizing for sharp lines
                const dpr = window.devicePixelRatio || 1;
                const rect = container.getBoundingClientRect();

                // Set backing store dimensions if changed
                const targetWidth = Math.floor(rect.width * dpr);
                const targetHeight = Math.floor(rect.height * dpr);

                if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    ctx.scale(dpr, dpr);
                }

                // Drawing dimensions (CSS pixels)
                const w = rect.width;
                const h = rect.height;

                analyser.getByteFrequencyData(dataArray);

                ctx.fillStyle = '#000000';
                ctx.clearRect(0, 0, w, h); // Clear canvas

                // Calculate Layout
                const availableWidth = w - (sidePadding * 2);
                if (availableWidth <= 0) return;

                // Adaptive Bar Count
                const barCount = Math.floor(availableWidth / (barWidth + gap));
                if (barCount < 1) return;

                const step = Math.floor((bufferLength * 0.5) / barCount);
                const safeStep = Math.max(1, step);

                ctx.fillStyle = '#ffffff';

                // Center the bars
                const totalBarBlockWidth = barCount * barWidth + (barCount - 1) * gap;
                const startOffset = sidePadding + (availableWidth - totalBarBlockWidth) / 2;

                for (let i = 0; i < barCount; i++) {
                    let sum = 0;
                    for (let j = 0; j < safeStep; j++) {
                        sum += dataArray[(i * safeStep + j) % bufferLength] || 0;
                    }
                    const avg = sum / safeStep;

                    // Height (max 80% of container)
                    const barHeight = Math.max(2, (avg / 255) * h * 0.8);

                    const x = startOffset + (i * (barWidth + gap));
                    const y = (h - barHeight) / 2;

                    ctx.fillRect(x, y, barWidth, barHeight);
                }
            };

            draw();

        } catch (err) {
            console.error('Error initializing visualizer:', err);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [stream]);

    return (
        <div ref={containerRef} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            width: typeof width === 'number' ? `${width}px` : width,
            height: '100%',
        }}>
            <div style={{
                width: '100%',
                height: typeof height === 'number' ? `${height}px` : height,
                border: '2px solid white',
                background: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {stream ? (
                    <canvas
                        ref={canvasRef}
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    <div style={{ fontSize: '0.8rem', color: '#333' }}>Waiting...</div>
                )}
            </div>
        </div>
    );
}
