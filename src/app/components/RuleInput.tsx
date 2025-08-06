'use client';

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
    const maxAssignable: number | bigint | undefined =
        totalAssignments <= BigInt(Number.MAX_SAFE_INTEGER)
            ? Number(totalAssignments) - 1
            : totalAssignments - BigInt(1);

    const handleRandom = () => {
        if (typeof maxAssignable === 'number') {
            const random = Math.floor(Math.random() * (maxAssignable + 1));
            setInputValue(random.toString());
            setup(random, initializationMode);
        } else if (typeof maxAssignable === 'bigint') {
            const randomBig = BigInt.asUintN(64, crypto.getRandomValues(new BigUint64Array(1))[0]) % totalAssignments;
            setInputValue(randomBig.toString());
            setup(Number(randomBig), initializationMode);
        }
    };

    function formatMaxAssignable(max: number | bigint | undefined): string {
        if (max === undefined) return '';

        if (typeof max === 'number') {
            return max > 7625597484986
                ? max.toExponential(3)
                : max.toLocaleString();
        }

        const str = max.toString();
        const digits = str.length;

        // Convert to float string manually: take first digit, decimal, next 2, then exponent
        const base = `${str[0]}.${str.slice(1, 4)}`;
        const exponent = digits - 1;

        return `${base}e+${exponent}`;
    }


    return (
        <section className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Rule Number</h3>

            <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                className="border rounded px-3 py-2 w-full mb-1"
                min={0}
                placeholder="Enter rule number"
            />

            {maxAssignable !== undefined && (
                <p className="text-xs text-gray-600 mb-3">
                    Max rule number:&nbsp;
                    <span className="font-mono break-all">
                        {formatMaxAssignable(maxAssignable)}
                    </span>
                </p>
            )}

            <button
                onClick={handleStart}
                className="w-full mb-2 py-2 px-4 bg-blue-600 text-white rounded text-lg font-semibold hover:bg-blue-700 transition"
            >
                Start
            </button>

            <button
                onClick={handleRandom}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded text-lg font-semibold hover:bg-purple-700 transition"
            >
                Random Rule
            </button>
        </section>


    );
}
