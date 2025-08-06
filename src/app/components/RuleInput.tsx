import { useEffect, useState } from "react";
import { useCelluarContext } from "../CelluarContext";

export default function RuleInput() {
    const {
        currentRuleNumber,
        initializationMode,
        ruleLength,
        numStates,
        setup,
    } = useCelluarContext();

    const [inputValue, setInputValue] = useState(currentRuleNumber.toString());

    useEffect(() => {
        setInputValue(currentRuleNumber.toString());
    }, [currentRuleNumber]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleStart = () => {
        const parsed = parseInt(inputValue, 10);
        if (!isNaN(parsed)) {
            setup(parsed, initializationMode);
        }
    };

    const totalAssignments = BigInt(numStates) ** BigInt(numStates ** ruleLength);
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
