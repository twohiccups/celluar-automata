'use client';
import SectionTitle from '@/app/components/SectionTitle';
import { tooltips } from '@/app/tooltips';
import { InitializationMode, useCelluarContext } from '@/app/contexts/CelluarContext';

export default function InitializationSelector() {
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
