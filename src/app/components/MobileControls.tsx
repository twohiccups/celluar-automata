'use client';

import { useState } from 'react';

import RuleInput from '@/app/components/RuleInput';
import { ExportConfigButton } from '@/app/components/ExportConfigButton';
import RuleConfigSelectors from '@/app/components/RuleConfigSelectors';
import SectionTitle from '@/app/components/SectionTitle';
import { ColorThemeSelector } from '@/app/components/ColorThemeSelector';
import RuleEditor from '@/app/components/RuleEditor';

import {
    InitializationMode,
    EdgeMode,
    useCelluarContext,
} from '@/app/contexts/CelluarContext';

import { tooltips } from '@/app/tooltips';
import { IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight } from './Icons';



// Reuse your existing small selectors
function InitializationSelector() {
    const { initializationMode, setInitializationMode } = useCelluarContext();
    return (
        <section className="space-y-2">
            <SectionTitle title="Initialization Mode" tooltip={tooltips.initializationMode} />
            <div className="flex flex-wrap gap-2">
                {Object.entries(InitializationMode)
                    .filter(([k]) => isNaN(Number(k)))
                    .map(([label, value]) => (
                        <button
                            key={label}
                            onClick={() => setInitializationMode(value as InitializationMode)}
                            className={`px-3 py-1 border rounded ${initializationMode === value ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
            </div>
        </section>
    );
}

function EdgeModeSelector() {
    const { edgeMode, setEdgeMode } = useCelluarContext();
    return (
        <section className="space-y-2">
            <SectionTitle title="Edge Mode" tooltip={tooltips.edgeMode} />
            <div className="flex flex-wrap gap-2">
                {Object.entries(EdgeMode)
                    .filter(([k]) => isNaN(Number(k)))
                    .map(([label, value]) => (
                        <button
                            key={label}
                            onClick={() => setEdgeMode(value as EdgeMode)}
                            className={`px-3 py-1 border rounded ${edgeMode === value ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
            </div>
        </section>
    );
}

function LogicalWidthSelector() {
    const { logicalWidth, setLogicalWidth, initializeState } = useCelluarContext();
    return (
        <section className="space-y-2">
            <SectionTitle title="Logical Width" tooltip={tooltips.logicalWidth} />
            <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={logicalWidth}
                onChange={(e) => {
                    const v = Number(e.target.value);
                    setLogicalWidth(v);
                    initializeState();
                }}
                className="w-full"
            />
            <div className="text-sm text-gray-600">
                {logicalWidth} px wide — approx. {Math.floor(logicalWidth / 4)} cells
            </div>
        </section>
    );
}

function ScrollSpeedSelector() {
    const { scrollSpeed, setScrollSpeed } = useCelluarContext();
    const min = 1,
        max = 150;
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
                    onChange={(e) => {
                        const raw = Number(e.target.value);
                        setScrollSpeed(max + min - raw);
                    }}
                    className="w-full"
                />
                <span className="text-sm text-gray-600 shrink-0">Faster</span>
            </div>
        </section>
    );
}

export default function MobileControls() {
    const [open, setOpen] = useState(true);
    const [page, setPage] = useState(0);
    const pages = [
        {
            title: 'Rule',
            content: (
                <div className="space-y-4">
                    <RuleInput />
                    <div className="flex gap-2">
                        <ExportConfigButton />
                    </div>
                    <RuleConfigSelectors />
                    <RuleEditor />
                </div>
            ),
        },
        {
            title: 'Behavior',
            content: (
                <div className="space-y-4">
                    <InitializationSelector />
                    <EdgeModeSelector />
                    <ScrollSpeedSelector />
                </div>
            ),
        },
        {
            title: 'Display',
            content: (
                <div className="space-y-4">
                    <LogicalWidthSelector />
                    <ColorThemeSelector />
                </div>
            ),
        },
    ];

    // Touch swipe detection
    let startX = 0;
    let deltaX = 0;
    const onTouchStart = (e: React.TouchEvent) => {
        startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        deltaX = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
        const threshold = 48;
        if (deltaX > threshold && page > 0) setPage(page - 1);
        else if (deltaX < -threshold && page < pages.length - 1) setPage(page + 1);
    };

    return (
        <div className="md:hidden">
            <div className="sticky top-0 z-20 bg-white border-b">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-4 py-3"
                >
                    <span className="font-semibold">Settings</span>
                    {open ? <IconChevronUp className="w-5 h-5" /> : <IconChevronDown className="w-5 h-5" />}
                </button>

                {open && (
                    <div className="flex items-center gap-2 px-2 pb-2">
                        <button
                            className="p-2 rounded border disabled:opacity-40"
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                        >
                            <IconChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-center gap-2">
                                {pages.map((p, i) => (
                                    <button
                                        key={p.title}
                                        className={`px-3 py-1 rounded-full text-sm border ${i === page
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'hover:bg-gray-100'
                                            }`}
                                        onClick={() => setPage(i)}
                                    >
                                        {p.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            className="p-2 rounded border disabled:opacity-40"
                            onClick={() => setPage(Math.min(pages.length - 1, page + 1))}
                            disabled={page === pages.length - 1}
                        >
                            <IconChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div
                className={`bg-gray-50 border-b ${open ? 'max-h-[75vh]' : 'max-h-0'
                    } overflow-hidden transition-[max-height] duration-300`}
            >
                <div
                    className="relative w-full overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-300"
                        style={{
                            transform: `translateX(-${page * 100}%)`,
                            width: `${pages.length * 100}%`,
                        }}
                    >
                        {pages.map((p) => (
                            <div
                                key={p.title}
                                className="w-full shrink-0 px-4 py-4 space-y-4"
                                style={{ width: `${100 / pages.length}%` }}
                            >
                                {p.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
