'use client';
import SectionTitle from '@/app/components/SectionTitle';
import { tooltips } from '@/app/tooltips';
import { EdgeMode, useCelluarContext } from '@/app/contexts/CelluarContext';

export default function EdgeModeSelector() {
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
