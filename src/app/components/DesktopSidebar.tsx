'use client';

import { useEffect, useState } from 'react';
import ControlPanel from '@/app/components/ControlPanel';
import { IconChevronLeft, IconX } from './Icons';

export default function DesktopSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('panel-collapsed') : null;
        if (saved === 'true') setCollapsed(true);
    }, []);
    useEffect(() => {
        if (typeof window !== 'undefined') localStorage.setItem('panel-collapsed', String(collapsed));
    }, [collapsed]);

    return (
        <>
            {/* Fixed open button (visible only when collapsed) */}
            {collapsed && (
                <button
                    type="button"
                    onClick={() => setCollapsed(false)}
                    className="hidden md:flex fixed top-4 right-4 z-30 items-center justify-center gap-1.5 rounded-full border bg-white/90 px-3 py-2 shadow hover:bg-white transition"
                    aria-label="Open settings panel"
                >
                    <IconChevronLeft className="h-5 w-5" />
                    <span className="text-sm leading-none">Settings</span>
                </button>
            )}

            {/* Collapsible rail that NEVER unmounts children */}
            <aside
                className={[
                    'hidden md:block relative shrink-0 bg-white shadow transition-[width] duration-300 h-full', // <- h-full here
                    collapsed ? 'w-0' : 'w-[350px]',
                ].join(' ')}
                aria-hidden={collapsed}
            >
                {/* Content stays mounted; visually hidden when collapsed */}
                <div
                    className={[
                        'h-full flex flex-col', // column layout: sticky header + scroll area
                        collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto',
                    ].join(' ')}
                >
                    {/* Sticky header with big × */}
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b flex items-center justify-between px-3 py-2">
                        <span className="text-xl font-semibold">Settings</span>
                        <button
                            type="button"
                            onClick={() => setCollapsed(true)}
                            className="rounded-full p-2 hover:bg-gray-200 transition"
                            aria-label="Close settings panel"
                        >
                            <IconX className="h-7 w-7" />
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                        <ControlPanel />
                    </div>
                </div>
            </aside>
        </>
    );
}
