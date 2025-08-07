'use client';

import {
    InitializationMode,
    EdgeMode,
    useCelluarContext,
} from '@/app/contexts/CelluarContext';

import RuleEditor from '@/app/components/RuleEditor';

import RuleInput from './RuleInput';
import { ColorThemeSelector } from './ColorThemeSelector';
import { useRulesContext } from '../contexts/RulesContext';
import { ExportConfigButton } from './ExportConfigButton';



function InitializationSelector() {
    const { initializationMode, setInitializationMode } = useCelluarContext();

    return (
        <section>
            <h3 className="text-lg font-semibold mb-2">Initialization Mode</h3>
            <div className="flex flex-wrap gap-2">
                {Object.entries(InitializationMode)
                    .filter(([key]) => isNaN(Number(key)))
                    .map(([label, value]) => (
                        <button
                            key={label}
                            onClick={() => setInitializationMode(value as InitializationMode)}
                            className={`px-3 py-1 border rounded ${initializationMode === value
                                ? 'bg-blue-100 font-bold'
                                : 'hover:bg-gray-100'
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
    const { edgeMode, setEdgeMode } = useCelluarContext()
    return (
        <section className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Edge Mode</h3>
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

function RuleConfigSelectors() {

    const {
    } = useCelluarContext()

    const {
        numStates,
        setNumStatesAndReset,
        ruleLength,
        setRuleLengthAndReset,

    } = useRulesContext()
    return (
        <>
            <div className="mt-4 flex items-center gap-2">
                <label className="font-medium">Rule Length:</label>
                <select
                    className="border rounded px-2 py-1"
                    value={ruleLength}
                    onChange={(e) => setRuleLengthAndReset(Number(e.target.value))}
                >
                    {[2, 3, 4, 5].map((len) => (
                        <option key={len} value={len}>
                            {len}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <label className="font-medium">Number of States:</label>
                <select
                    className="border rounded px-2 py-1"
                    value={numStates}
                    onChange={(e) => setNumStatesAndReset(Number(e.target.value))}
                >
                    {[2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}


function LogicalWidthSelector() {
    const {
        logicalWidth,
        setLogicalWidth,
        initializeState,
    } = useCelluarContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setLogicalWidth(newWidth);
        initializeState(); // Reset canvas to fill space
    };

    return (
        <section className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Logical Width</h3>
            <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={logicalWidth}
                onChange={handleChange}
                className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">
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
        <section className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Scroll Speed</h3>
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
        <div className="mb-6 p-4 bg-gray-50 rounded shadow">
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
