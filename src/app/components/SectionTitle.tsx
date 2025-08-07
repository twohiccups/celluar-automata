'use client';

import { useRef, useState } from 'react';
import FloatingTooltip from './FloatingTooltip';

interface SectionTitleProps {
    title: string;
    tooltip?: string;
}

export default function SectionTitle({ title, tooltip }: SectionTitleProps) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLHeadingElement>(null);

    return (
        <div className="relative inline-block mb-2">
            <h3
                ref={ref}
                className="text-lg font-semibold select-none cursor-default"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {title}
            </h3>
            {tooltip && hovered && <FloatingTooltip anchorEl={ref.current} text={tooltip} />}
        </div>
    );
}
