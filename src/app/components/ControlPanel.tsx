'use client';

import { useEffect, useState } from 'react';
import {
    InitializationMode,
    EdgeMode,
    useCelluarContext,
} from '@/app/CelluarContext';

import RuleEditor from '@/app/components/RuleEditor';

import { ThemeName, themeNames } from '@/app/themes';


function getTotalRuleAssignments(numStates: number, ruleLength: number): bigint {
    return BigInt(numStates) ** BigInt(numStates ** ruleLength);
}



export function ColorThemeSelector() {
    const {
        colorPalette,
        setColorPalette,
        applyTheme,
    } = useCelluarContext();

    const [selectedTheme, setSelectedTheme] = useState<ThemeName>('Default');

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const themeName = e.target.value as ThemeName;
        setSelectedTheme(themeName);
        applyTheme(themeName);
    };

    const handleColorChange = (index: number, newColor: string) => {
        const updated = [...colorPalette];
        updated[index] = newColor;
        setColorPalette(updated);
    };

    return (
        <section className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Color Theme</h3>

            {/* Theme dropdown */}
            <div className="flex items-center gap-2 mb-4">
                <label className="font-medium">Select Theme:</label>
                <select
                    className="border rounded px-2 py-1"
                    value={selectedTheme}
                    onChange={handleThemeChange}
                >
                    {themeNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Color pickers */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {colorPalette.map((color, index) => (
                    <div key={index} className="flex flex-col items-center text-sm">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="w-10 h-10 border rounded"
                        />
                        <span className="mt-1 font-mono">S{index}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

function InitializationSelector({
    setInitMode,
}: {
    initMode: InitializationMode;
    setInitMode: (mode: InitializationMode) => void;
}) {
    return (
        <section>
            <h3 className="text-lg font-semibold mb-2">Initialization Mode</h3>
            <div className="flex flex-wrap gap-2">
                {Object.entries(InitializationMode)
                    .filter(([key]) => isNaN(Number(key)))
                    .map(([label, value]) => (
                        <button
                            key={label}
                            onClick={() => setInitMode(value as InitializationMode)}
                            className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                            {label}
                        </button>
                    ))}
            </div>
        </section>
    );
}

function EdgeModeSelector({
    edgeMode,
    setEdgeMode,
}: {
    edgeMode: EdgeMode;
    setEdgeMode: (mode: EdgeMode) => void;
}) {
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

function RuleConfigSelectors({
    ruleLength,
    numStates,
    setRuleLengthAndReset,
    setNumStatesAndReset,
}: {
    ruleLength: number;
    numStates: number;
    setRuleLengthAndReset: (length: number) => void;
    setNumStatesAndReset: (count: number) => void;
}) {
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

function RuleInput({
    inputValue,
    handleInputChange,
    handleStart,
    totalAssignments,
}: {
    inputValue: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleStart: () => void;
    totalAssignments: bigint;
}) {
    const maxAssignable = totalAssignments <= BigInt(Number.MAX_SAFE_INTEGER)
        ? Number(totalAssignments) - 1
        : undefined;

    return (
        <section className="mt-4">
            <div className="flex items-center gap-2 mt-1">
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1 w-32"
                    min={0}
                    max={maxAssignable}
                />
                <button
                    onClick={handleStart}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Start
                </button>
            </div>
            <div className="text-sm text-gray-700 mt-2 space-y-1">
                {maxAssignable !== undefined && (
                    <div>
                        Max rule number: <span className="font-mono">{maxAssignable}</span>
                    </div>
                )}
            </div>
        </section>
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
        initializeState(InitializationMode.CENTER); // Reset canvas to fill space
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
    const { scrollSpeed, setScrollSpeed } = useCelluarContext()
    return (
        <section className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Scroll Speed</h3>
            <input
                type="range"
                min={1}
                max={150}
                step={1}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">
                {scrollSpeed}
            </div>
        </section>
    );
}


export default function ControlPanel() {

    const {
        setup,
        setEdgeMode,
        edgeMode,
        currentRuleNumber,
        setRuleLengthAndReset,
        setNumStatesAndReset,
        ruleLength,
        numStates,
    } = useCelluarContext();

    const [initMode, setInitMode] = useState<InitializationMode>(InitializationMode.CENTER);
    const [inputValue, setInputValue] = useState(currentRuleNumber.toString());

    const totalRuleInputs = numStates ** ruleLength;
    const totalAssignments = getTotalRuleAssignments(numStates, ruleLength);

    useEffect(() => {
        setInputValue(currentRuleNumber.toString());
    }, [currentRuleNumber]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleStart = () => {
        const parsed = parseInt(inputValue, 10);
        if (!isNaN(parsed)) {
            setup(parsed, initMode);
        }
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded shadow">
            <ScrollSpeedSelector />
            <LogicalWidthSelector />
            <InitializationSelector initMode={initMode} setInitMode={setInitMode} />
            <EdgeModeSelector edgeMode={edgeMode} setEdgeMode={setEdgeMode} />
            <RuleConfigSelectors
                ruleLength={ruleLength}
                numStates={numStates}
                setRuleLengthAndReset={setRuleLengthAndReset}
                setNumStatesAndReset={setNumStatesAndReset}
            />
            <RuleInput
                inputValue={inputValue}
                handleInputChange={handleInputChange}
                handleStart={handleStart}
                totalAssignments={totalAssignments}
            />
            <ColorThemeSelector />
            <RuleEditor />
        </div>
    );
}
