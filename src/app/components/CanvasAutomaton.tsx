'use client';

import { useEffect, useRef } from 'react';
import { useCelluarContext } from '@/app/contexts/CelluarContext';

export default function CanvasAutomaton() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const {
        logicalWidth,
        scrollSpeed,
        currentState,
        nextStep,
        colorPalette,
    } = useCelluarContext();

    // Refs to avoid resetting animation loop on prop change
    const stateRef = useRef(currentState);
    const nextStepRef = useRef(nextStep);
    const paletteRef = useRef(colorPalette);
    const speedRef = useRef(scrollSpeed);

    // Sync refs on changes
    useEffect(() => {
        stateRef.current = currentState;
    }, [currentState]);

    useEffect(() => {
        nextStepRef.current = nextStep;
    }, [nextStep]);

    useEffect(() => {
        paletteRef.current = colorPalette;
    }, [colorPalette]);

    useEffect(() => {
        speedRef.current = scrollSpeed;
    }, [scrollSpeed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Setup canvas based on logical width
        const maxWidth = 1000;
        const cellSize = Math.floor(maxWidth / logicalWidth);
        const canvasWidth = cellSize * logicalWidth;
        const canvasHeight = canvas.height;

        canvas.width = canvasWidth;

        let pixelsSinceLastRow = 0;
        let rowToDraw = [...stateRef.current];

        let timeoutId: ReturnType<typeof setTimeout>;

        const step = () => {
            const currentSpeed = speedRef.current;
            const currentPalette = paletteRef.current;
            const currentState = stateRef.current;

            ctx.drawImage(canvas, 0, -1); // Scroll up 1 pixel
            pixelsSinceLastRow++;

            if (pixelsSinceLastRow >= cellSize) {
                rowToDraw = [...currentState];
                rowToDraw.forEach((val, col) => {
                    const color = currentPalette[parseInt(val, 10)] ?? '#000';
                    ctx.fillStyle = color;
                    ctx.fillRect(col * cellSize, canvasHeight - cellSize, cellSize, cellSize);
                });

                nextStepRef.current();
                pixelsSinceLastRow = 0;
            }

            timeoutId = setTimeout(step, currentSpeed / cellSize);
        };

        step();

        return () => clearTimeout(timeoutId);
    }, [logicalWidth]); // Only reinitialize canvas on logicalWidth change

    return (
        <canvas
            ref={canvasRef}
            height={800}
            className="w-full h-full max-w-[1000px] border border-gray-300"
            style={{ imageRendering: 'pixelated' }}
        />
    );
}
