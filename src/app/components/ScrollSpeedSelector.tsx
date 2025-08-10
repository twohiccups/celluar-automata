'use client';
import { useCelluarContext } from '@/app/contexts/CelluarContext';

export default function ScrollSpeedSelector() {
    const { scrollSpeed, setScrollSpeed } = useCelluarContext();
    const min = 1, max = 150;
    const displayedValue = max + min - scrollSpeed;
    return (
        <section className="space-y-2">
            <h3 className="text-lg font-semibold">Scroll Speed</h3>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 shrink-0">Slower</span>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={displayedValue}
                    onChange={(e) => setScrollSpeed(max + min - Number(e.target.value))}
                    className="w-full"
                />
                <span className="text-sm text-gray-600 shrink-0">Faster</span>
            </div>
        </section>
    );
}
