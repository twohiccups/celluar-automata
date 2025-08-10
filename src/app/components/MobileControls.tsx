'use client';

import { useEffect, useRef, useState } from 'react';

import RuleInput from '@/app/components/RuleInput';
import { ExportConfigButton } from '@/app/components/ExportConfigButton';
import RuleConfigSelectors from '@/app/components/RuleConfigSelectors';
import RuleEditor from '@/app/components/RuleEditor';
import { ColorThemeSelector } from '@/app/components/ColorThemeSelector';

import InitializationSelector from '@/app/components/InitializationSelector';
import EdgeModeSelector from '@/app/components/EdgeModeSelector';
import LogicalWidthSelector from '@/app/components/LogicalWidthSelector';
import ScrollSpeedSelector from '@/app/components/ScrollSpeedSelector';

import {
    IconChevronUp,
    IconChevronDown,
} from '@/app/components/Icons';

export default function MobileControls() {
    const [open, setOpen] = useState(true);   // open by default
    const [page, setPage] = useState(0);      // 0..4

    const pages = [
        {
            title: 'Rule & Actions',
            render: () => (
                <div className="space-y-4">
                    <RuleInput />
                    <div className="flex gap-2">
                        <ExportConfigButton />
                    </div>
                </div>
            ),
        },
        {
            title: 'Rule Config',
            render: () => (
                <div className="space-y-4">
                    <RuleConfigSelectors />
                    <RuleEditor />
                </div>
            ),
        },
        {
            title: 'Init & Edge',
            render: () => (
                <div className="space-y-4">
                    <InitializationSelector />
                    <EdgeModeSelector />
                </div>
            ),
        },
        {
            title: 'Speed & Width',
            render: () => (
                <div className="space-y-4">
                    <ScrollSpeedSelector />
                    <LogicalWidthSelector />
                </div>
            ),
        },
        {
            title: 'Colors',
            render: () => <ColorThemeSelector />,
        },
    ] as const;

    // Looping navigation
    const last = pages.length - 1;
    const goPrev = () => setPage((p) => (p === 0 ? last : p - 1));
    const goNext = () => setPage((p) => (p === last ? 0 : p + 1));

    // Optional swipe to change pages (content is state-switched)
    let startX = 0;
    let dx = 0;
    const onTouchStart = (e: React.TouchEvent) => { startX = e.touches[0].clientX; dx = 0; };
    const onTouchMove = (e: React.TouchEvent) => { dx = e.touches[0].clientX - startX; };
    const onTouchEnd = () => {
        const t = 48;
        if (dx > t) goPrev();
        else if (dx < -t) goNext();
    };

    // Keep the selected chip visible
    const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
    useEffect(() => {
        const el = chipRefs.current[page];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [page]);

    return (
        <div className="md:hidden fixed inset-x-0 top-0 z-30">
            {/* Semi-transparent, blurred panel; fixed height when open for stable layout */}
            <div
                className={[
                    'mx-auto w-full bg-white/60 backdrop-blur-sm border-b shadow flex flex-col overflow-hidden transition-[height] duration-300',
                    open ? 'h-[66vh]' : 'h-[56px]',
                ].join(' ')}
            >
                {/* Header */}
                <div
                    className="w-full flex items-center justify-between px-4 py-3"
                    style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 0.75rem)' }}
                >
                    <span className="font-semibold">Settings</span>
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="p-1 rounded hover:bg-black/5"
                        aria-label={open ? 'Collapse settings' : 'Expand settings'}
                    >
                        {open ? <IconChevronUp className="w-5 h-5" /> : <IconChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                {/* Tabs row */}
                {open && (
                    <div className="shrink-0 flex items-center gap-2 px-3 pb-2">

                        {/* Scrollable chip row */}
                        <div className="flex-1 min-w-0">
                            <div className="chipScroller flex gap-2 overflow-x-auto whitespace-nowrap px-1">
                                {pages.map((p, i) => {
                                    const active = i === page;
                                    return (
                                        <button
                                            key={p.title}
                                            ref={(el) => { chipRefs.current[i] = el; }}
                                            onClick={() => setPage(i)}
                                            aria-pressed={active}
                                            className={[
                                                'h-9 px-3 rounded-full border text-sm shrink-0 transition',
                                                active
                                                    ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 font-semibold'
                                                    : 'bg-white/70 hover:bg-white/90',
                                            ].join(' ')}
                                        >
                                            {p.title}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                    </div>
                )}

                {/* Content area: render ONLY the active page; scroll inside */}
                {open && (
                    <div
                        className="min-h-0 flex-1 overflow-hidden"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <div className="h-full overflow-y-auto px-4 pb-4 space-y-4">
                            {pages[page].render()}
                        </div>
                    </div>
                )}
            </div>

            {/* soft separator below panel */}
            {open && <div className="h-1 w-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />}

            {/* Local-only styles to hide chip scroller scrollbars (no global CSS) */}
            <style jsx>{`
        .chipScroller {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .chipScroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
