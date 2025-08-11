'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useCelluarContext } from "../contexts/CelluarContext";
import { tooltips } from "../tooltips";
import SectionTitle from "./SectionTitle";
import { VIEWPORT_WIDTH } from '../const';

// IMPORTANT: keep this in sync with CanvasAutomaton

function getBmpWidth(): number {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    return Math.round(VIEWPORT_WIDTH * dpr);
}

function computeCrispWidths(bmpW: number): number[] {
    const out: number[] = [];
    for (let w = 100; w <= 1000; w++) {
        if (bmpW % w === 0) out.push(w);
    }
    return out;
}

function pickEvenlySpaced(values: number[], count: number): number[] {
    if (values.length === 0) return [];
    if (values.length <= count) return [...values];
    const step = (values.length - 1) / (count - 1);
    const picked: number[] = [];
    for (let i = 0; i < count; i++) picked.push(values[Math.round(i * step)]);
    return Array.from(new Set(picked)).sort((a, b) => a - b);
}

function nearestIndex(value: number | undefined, list: number[]): number {
    if (!list.length) return 0;
    if (value == null) return 0;
    let bestIdx = 0, bestDist = Math.abs(list[0] - value);
    for (let i = 1; i < list.length; i++) {
        const d = Math.abs(list[i] - value);
        if (d < bestDist) { bestIdx = i; bestDist = d; }
    }
    return bestIdx;
}

export default function LogicalWidthSelector() {
    const { logicalWidth, setLogicalWidth, initializeState } = useCelluarContext();

    // 1) Mount gate for DPR-dependent stuff
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // 2) bmpW: safe default for SSR, real value after mount
    const [bmpW, setBmpW] = useState<number>(VIEWPORT_WIDTH);
    useEffect(() => {
        if (!mounted) return;
        const update = () => setBmpW(getBmpWidth());
        update();
        window.addEventListener('resize', update);
        if (window.visualViewport) window.visualViewport.addEventListener('resize', update);
        return () => {
            window.removeEventListener('resize', update);
            if (window.visualViewport) window.visualViewport.removeEventListener('resize', update);
        };
    }, [mounted]);

    const crispWidths = useMemo(
        () => (mounted ? computeCrispWidths(bmpW) : []),
        [mounted, bmpW]
    );
    const sliderValues = useMemo(
        () => (mounted ? pickEvenlySpaced(crispWidths, 6) : []),
        [mounted, crispWidths]
    );

    // 3) Controlled slider index at all times (never undefined)
    const [selectedIdx, setSelectedIdx] = useState(0);

    // Align with context value when options change
    useEffect(() => {
        if (!mounted || sliderValues.length === 0) return;
        const idx = nearestIndex(logicalWidth, sliderValues);
        setSelectedIdx(idx);
        const snapped = sliderValues[idx];
        if (snapped != null && snapped !== logicalWidth) {
            setLogicalWidth(snapped);
            initializeState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, sliderValues]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const idx = Number(e.target.value);
        const clampedIdx = Math.max(0, Math.min(idx, Math.max(0, sliderValues.length - 1)));
        setSelectedIdx(clampedIdx);
        const snapped = sliderValues[clampedIdx];
        if (snapped != null && snapped !== logicalWidth) {
            setLogicalWidth(snapped);
            initializeState();
        }
    }, [sliderValues, logicalWidth, setLogicalWidth, initializeState]);

    // --- Always-controlled slider (no uncontrolled/controlled flip) ---
    const maxIdx = Math.max(0, sliderValues.length - 1);
    const currentIdx = Math.min(selectedIdx, maxIdx);
    const currentWidth = sliderValues[currentIdx];

    return (
        <section className="space-y-2">
            <SectionTitle title={'Logical Width'} tooltip={tooltips.logicalWidth} />
            <input
                type="range"
                min={0}
                max={maxIdx}
                step={1}
                value={currentIdx}          // <-- controlled from first render
                onChange={handleChange}
                className="w-full"
                disabled={!mounted || sliderValues.length === 0}
                suppressHydrationWarning    // avoid warnings if attributes differ before/after mount
            />

            {/* Show ticks only when mounted to avoid SSR text mismatch */}
            {mounted && sliderValues.length > 0 && (
                <div className="flex justify-between text-xs text-gray-500" suppressHydrationWarning>
                    {sliderValues.map((v) => (
                        <span key={v} style={{ transform: 'translateX(-50%)' }}>{v}</span>
                    ))}
                </div>
            )}

            <div className="text-sm text-gray-600">
                {currentWidth ?? '—'} px wide — approx. {currentWidth ? Math.floor(currentWidth / 4) : '—'} cells
            </div>
        </section>
    );
}
