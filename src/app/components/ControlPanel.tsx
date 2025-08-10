'use client';

import {
    InitializationMode,
    EdgeMode,
    useCelluarContext,
} from '@/app/contexts/CelluarContext';

import RuleEditor from '@/app/components/RuleEditor';

import RuleInput from './RuleInput';
import { ColorThemeSelector } from './ColorThemeSelector';
import { ExportConfigButton } from './ExportConfigButton';
import RuleConfigSelectors from './RuleConfigSelectors';
import SectionTitle from './SectionTitle';
import { tooltips } from '../tooltips';

function InitializationSelector() {
    const { initializationMode, setInitializationMode } = useCelluarContext();

    return (
        <section className="space-y-2">
            <SectionTitle title={'Initialization Mode'} tooltip={tooltips.initializationMode} />
            <div className="flex flex-wrap gap-2">
                {Object.entries(InitializationMode)
                    .filter(([key]) => isNaN(Number(key)))
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
            <SectionTitle title={'Edge Mode'} tooltip={tooltips.edgeMode} />
            <div className="flex flex-wrap gap-2">
                {Object.entries(EdgeMode)
                    .filter(([key]) => isNaN(Number(key)))
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setLogicalWidth(newWidth);
        initializeState(); // Reset canvas to fill space
    };

    return (
        <section className="space-y-2">
            <SectionTitle title={'Logical Width'} tooltip={tooltips.logicalWidth} />
            <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={logicalWidth}
                onChange={handleChange}
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

    const min = 1;
    const max = 150;

    // Invert value so that left = slow, right = fast
    const displayedValue = max + min - scrollSpeed;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = Number(e.target.value);
        const inverted = max + min - rawValue;
        setScrollSpeed(inverted);
    };

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
                    onChange={handleChange}
                    className="w-full"
                />
                <span className="text-sm text-gray-600 shrink-0">Faster</span>
            </div>
        </section>
    );
}

export default function ControlPanel() {
    return (
        <div className="mb-6 p-4 bg-gray-50 rounded shadow space-y-6">
            <RuleInput />
            <ExportConfigButton />
            <RuleConfigSelectors />
            <RuleEditor />
            <InitializationSelector />
            <EdgeModeSelector />
            <LogicalWidthSelector />
            <ScrollSpeedSelector />
            <ColorThemeSelector />
        </div>
    );
}
