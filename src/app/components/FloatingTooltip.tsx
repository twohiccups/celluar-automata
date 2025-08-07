// components/FloatingTooltip.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface FloatingTooltipProps {
    anchorEl: HTMLElement | null;
    text: string;
}

export default function FloatingTooltip({ anchorEl, text }: FloatingTooltipProps) {
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!anchorEl || !tooltipRef.current) return;

        const rect = anchorEl.getBoundingClientRect();
        setPos({
            top: rect.bottom + window.scrollY + 8, // spacing below
            left: rect.left + rect.width / 2 + window.scrollX,
        });
    }, [anchorEl]);

    return createPortal(
        <div
            ref={tooltipRef}
            className="fixed z-50 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg max-w-sm"
            style={{ top: pos.top, left: pos.left }}
        >
            {text}
            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
        </div>,
        document.body
    );
}
