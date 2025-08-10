'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useCelluarContext } from "../contexts/CelluarContext";
import { tooltips } from "../tooltips";
import SectionTitle from "./SectionTitle";

// IMPORTANT: set the same value in CanvasAutomaton
const VIEWPORT_WIDTH = 1200;

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
  for (let i = 0; i < count; i++) {
    picked.push(values[Math.round(i * step)]);
  }
  // ensure strictly increasing & unique
  return Array.from(new Set(picked)).sort((a, b) => a - b);
}

function nearestIndex(value: number, list: number[]): number {
  if (list.length === 0) return 0;
  let bestIdx = 0;
  let bestDist = Math.abs(list[0] - value);
  for (let i = 1; i < list.length; i++) {
    const d = Math.abs(list[i] - value);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export default function LogicalWidthSelector() {
  const { logicalWidth, setLogicalWidth, initializeState } = useCelluarContext();

  const [bmpW, setBmpW] = useState<number>(
    typeof window === 'undefined' ? VIEWPORT_WIDTH : getBmpWidth()
  );

  // Recompute when DPR/zoom changes
  useEffect(() => {
    const update = () => setBmpW(getBmpWidth());
    update();
    window.addEventListener('resize', update);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      if (window.visualViewport) window.visualViewport.removeEventListener('resize', update);
    };
  }, []);

  const crispWidths = useMemo(() => computeCrispWidths(bmpW), [bmpW]);
  const sliderValues = useMemo(() => pickEvenlySpaced(crispWidths, 6), [crispWidths]);

  // Maintain a safe selected index to avoid NaN issues
  const [selectedIdx, setSelectedIdx] = useState<number>(() =>
    nearestIndex(logicalWidth, sliderValues)
  );

  // If device DPR/zoom changes, re-align selection and context
  useEffect(() => {
    const idx = nearestIndex(logicalWidth, sliderValues);
    setSelectedIdx(idx);
    const snapped = sliderValues[idx];
    if (snapped != null && snapped !== logicalWidth) {
      setLogicalWidth(snapped);
      initializeState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValues]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    const clampedIdx = Math.max(0, Math.min(idx, sliderValues.length - 1));
    setSelectedIdx(clampedIdx);
    const snapped = sliderValues[clampedIdx];
    if (snapped != null && snapped !== logicalWidth) {
      setLogicalWidth(snapped);
      initializeState(); // Reset canvas to fill space
    }
  }, [sliderValues, logicalWidth, setLogicalWidth, initializeState]);

  return (
    <section className="space-y-2">
      <SectionTitle title={'Logical Width'} tooltip={tooltips.logicalWidth} />
      <input
        type="range"
        min={0}
        max={Math.max(0, sliderValues.length - 1)}
        step={1}
        value={selectedIdx}
        onChange={handleChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        {sliderValues.map((v, i) => (
          <span key={v} style={{ transform: 'translateX(-50%)' }}>
            {v}
          </span>
        ))}
      </div>
      <div className="text-sm text-gray-600">
        {sliderValues[selectedIdx] ?? logicalWidth} px wide — approx. {Math.floor((sliderValues[selectedIdx] ?? logicalWidth) / 4)} cells
      </div>
    </section>
  );
}
