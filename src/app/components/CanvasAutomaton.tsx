'use client';

import { useEffect, useRef } from 'react';
import { useCelluarContext } from '@/app/contexts/CelluarContext';

export default function CanvasAutomaton() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { logicalWidth, scrollSpeed, currentState, nextStep, colorPalette } = useCelluarContext();

    // Fixed viewport size in CSS pixels (tweak as you like)
    const VIEWPORT_WIDTH = 1000;   // stays constant on screen
    const VIEWPORT_HEIGHT = 800;   // can adjust this if you want taller/shorter

    // Refs so we don't restart the loop on every prop change
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

        // High‑DPI backbuffer: keep CSS size fixed, scale the bitmap by DPR
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const bmpW = Math.round(VIEWPORT_WIDTH * dpr);
        const bmpH = Math.round(VIEWPORT_HEIGHT * dpr);

        canvas.width = bmpW;
        canvas.height = bmpH;

        // Important: the CSS size is fixed, independent of bitmap size
        canvas.style.width = `${VIEWPORT_WIDTH}px`;
        canvas.style.height = `${VIEWPORT_HEIGHT}px`;

        // Reset + clear
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, bmpW, bmpH);

        // Cell size in *device pixels* so the logical width fills the entire bitmap
        const cellW = bmpW / Math.max(1, logicalWidth); // can be fractional
        const cellH = cellW; // square cells; adjust if you prefer a different aspect

        // Accumulate sub‑pixel scroll until we’ve scrolled one cell “row”
        let pxSinceRow = 0;

        // Draw one bottom row given the latest state, scaled to fill width exactly
        const drawBottomRow = (row: string[]) => {
            // Map each logical column to integer x pixel spans to avoid gaps at the right edge
            for (let col = 0; col < row.length; col++) {
                const x0 = Math.floor(col * cellW);
                const x1 = Math.floor((col + 1) * cellW);
                const w = Math.max(1, x1 - x0); // ensure at least 1px when collapsing many cells
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
            // Scroll up by 1 device pixel
            ctx.drawImage(canvas, 0, -1);

            pxSinceRow += 1;

            // When we've scrolled a full cell height, draw a new bottom row and advance the CA
            if (pxSinceRow >= cellH) {
                drawBottomRow([...stateRef.current]); // snapshot row
                nextStepRef.current();
                pxSinceRow -= cellH; // keep fractional remainder to stay smooth
            }

            // Keep perceived speed consistent as cells get smaller/larger:
            // scale delay by cell height so visual “row rate” stays similar.
            const delay = Math.max(1, Math.floor(speedRef.current / Math.max(1, cellH)));
            timeoutId = setTimeout(() => {
                raf = requestAnimationFrame(loop);
            }, delay);
        };

        // Kick off
        raf = requestAnimationFrame(loop);

        // Cleanup on deps change/unmount
        return () => {
            if (raf) cancelAnimationFrame(raf);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [logicalWidth]); // recompute mapping when logical width changes

    return (
        <canvas
            ref={canvasRef}
            className="border border-gray-300"
            style={{ imageRendering: 'pixelated' }}
        />
    );
}
