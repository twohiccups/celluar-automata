'use client';

import { useCelluarContext } from '@/app/contexts/CelluarContext';
import { useRulesContext } from '../contexts/RulesContext';
import SectionTitle from './SectionTitle';

function getTextContrast(hex: string): 'black' | 'white' {
    // Utility to determine readable text color
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 160 ? 'black' : 'white';
}

export default function RuleEditor() {
    const { colorPalette } = useCelluarContext();
    const { ruleSet, numStates, updateRule } = useRulesContext()

    const sortedKeys = Object.keys(ruleSet).sort(
        (a, b) => parseInt(b, numStates) - parseInt(a, numStates)
    );
    const tooltip = ""

    return (
        <div className="mt-6">
            <SectionTitle title={'Rule Set'} tooltip={tooltip} />
            <div className="h-48 overflow-y-auto border rounded p-2 bg-gray-100 shadow-sm">
                <div className="flex flex-col gap-2 text-sm">
                    {sortedKeys.map((key) => {
                        const value = ruleSet[key];
                        const outputColor = colorPalette[parseInt(value, numStates)] ?? '#ddd';
                        const outputTextColor = getTextContrast(outputColor);

                        return (
                            <div
                                key={key}
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-1 rounded transition"
                                onClick={() => updateRule(key)}
                            >
                                {/* Neighborhood pattern */}
                                <div className="flex gap-1">
                                    {key.split('').map((char, i) => {
                                        const digit = parseInt(char, numStates);
                                        const bgColor = colorPalette[digit] ?? '#ccc';
                                        const textColor = getTextContrast(bgColor);
                                        return (
                                            <div
                                                key={i}
                                                className="w-6 h-6 flex items-center justify-center rounded-sm border border-white"
                                                style={{
                                                    backgroundColor: bgColor,
                                                    color: textColor,
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {char}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Arrow */}
                                <span className="text-gray-500 font-mono text-lg">⇒</span>

                                {/* Output */}
                                <div
                                    className="w-6 h-6 flex items-center justify-center rounded-sm border border-white font-mono text-sm"
                                    style={{
                                        backgroundColor: outputColor,
                                        color: outputTextColor,
                                    }}
                                >
                                    {value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
