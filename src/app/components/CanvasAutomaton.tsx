'use client';

import { useEffect, useRef } from 'react';
import { useCelluarContext } from '@/app/contexts/CelluarContext';

export default function CanvasAutomaton() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { logicalWidth, scrollSpeed, currentState, nextStep, colorPalette } = useCelluarContext();

    const VIEWPORT_WIDTH = 1000;
    const VIEWPORT_HEIGHT = 800;

    const stateRef = useRef(currentState);
    const nextStepRef = useRef(nextStep);
    const paletteRef = useRef(colorPalette);
    const speedRef = useRef(scrollSpeed);

    useEffect(() => { stateRef.current = currentState; }, [currentState]);
    useEffect(() => { nextStepRef.current = nextStep; }, [nextStep]);
    useEffect(() => { paletteRef.current = colorPalette; }, [colorPalette]);
    useEffect(() => { speedRef.current = scrollSpeed; }, [scrollSpeed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const bmpW = Math.round(VIEWPORT_WIDTH * dpr);
        const bmpH = Math.round(VIEWPORT_HEIGHT * dpr);

        canvas.width = bmpW;
        canvas.height = bmpH;
        canvas.style.width = `${VIEWPORT_WIDTH}px`;
        canvas.style.height = `${VIEWPORT_HEIGHT}px`;

        const cellW = bmpW / Math.max(1, logicalWidth);
        const cellH = cellW;

        let pxSinceRow = 0;

        // --- PREFILL CANVAS BLACK ---
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, bmpW, bmpH);

        const drawBottomRow = (row: string[]) => {
            for (let col = 0; col < row.length; col++) {
                const x0 = Math.floor(col * cellW);
                const x1 = Math.floor((col + 1) * cellW);
                const w = Math.max(1, x1 - x0);
                const y = bmpH - Math.ceil(cellH);
                const h = Math.ceil(cellH);

                const idx = parseInt(row[col], 10);
                ctx.fillStyle = paletteRef.current[idx] ?? '#000';
                ctx.fillRect(x0, y, w, h);
            }
        };

        let raf: number | null = null;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const loop = () => {
            ctx.drawImage(canvas, 0, -1);
            pxSinceRow += 1;

            if (pxSinceRow >= cellH) {
                drawBottomRow([...stateRef.current]);
                nextStepRef.current();
                pxSinceRow -= cellH;
            }

            const delay = Math.max(1, Math.floor(speedRef.current / Math.max(1, cellH)));
            timeoutId = setTimeout(() => {
                raf = requestAnimationFrame(loop);
            }, delay);
        };

        raf = requestAnimationFrame(loop);

        return () => {
            if (raf) cancelAnimationFrame(raf);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [logicalWidth]);

    return (
        <div
            className="fixed md:static left-0 right-0 bottom-0 md:bottom-auto z-10 flex justify-center"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <canvas
                ref={canvasRef}
                className="border border-gray-300"
                style={{ imageRendering: 'pixelated', width: `${VIEWPORT_WIDTH}px`, height: `${VIEWPORT_HEIGHT}px` }}
            />
        </div>
    );

}
