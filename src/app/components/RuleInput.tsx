'use client';

import { useEffect, useState } from "react";
import { useCelluarContext } from "../contexts/CelluarContext";
import { useRulesContext } from "../contexts/RulesContext";
import SectionTitle from "./SectionTitle";
import { tooltips } from "../tooltips";

export default function RuleInput() {
    const { initializeState } = useCelluarContext();
    const {
        currentRuleNumber,
        ruleLength,
        numStates,
        selectRule,
    } = useRulesContext();

    const [inputValue, setInputValue] = useState(currentRuleNumber.toString());

    useEffect(() => {
        setInputValue(currentRuleNumber.toString());
    }, [currentRuleNumber]);

    // Apply helper: select rule + initialize immediately
    const applyRuleAndInit = (value: string) => {
        selectRule(value);
        initializeState();
        setInputValue(value); // keep input in sync even if value === currentRuleNumber
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // Remove leading zeros unless it's just "0"
        val = val.replace(/^0+/, '') || '0';

        if (/^\d+$/.test(val)) {
            // Clamp to maxAssignable
            if (BigInt(val) > BigInt(maxAssignable ?? 0)) {
                val = (maxAssignable ?? 0).toString();
            }
        } else {
            val = '0';
        }

        setInputValue(val);
    };

    // When user types a new valid number, apply it
    useEffect(() => {
        if (/^\d+$/.test(inputValue)) {
            applyRuleAndInit(inputValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    const totalAssignments = BigInt(numStates) ** BigInt(numStates ** ruleLength);
    const maxAssignable: number | bigint | undefined =
        totalAssignments <= BigInt(Number.MAX_SAFE_INTEGER)
            ? Number(totalAssignments) - 1
            : totalAssignments - BigInt(1);

    const handleRandom = () => {
        const max = BigInt(numStates) ** (BigInt(numStates) ** BigInt(ruleLength));
        const maxDigits = max.toString().length;

        let randomBigInt = BigInt(0);
        // generate non-zero; can still equal current, which is fine because we force apply below
        while (randomBigInt >= max || randomBigInt === BigInt(0)) {
            let str = '';
            for (let i = 0; i < maxDigits; i++) {
                str += Math.floor(Math.random() * 10);
            }
            str = str.replace(/^0+/, '') || '0';
            randomBigInt = BigInt(str);
        }

        const value = randomBigInt.toString();
        // Apply immediately so initializeState always runs (even if value === current)
        applyRuleAndInit(value);
    };

    const handleStart = () => {
        initializeState(); // Re-start current rule from initial state
    };

    function formatMaxAssignable(): string {
        try {
            const total = BigInt(numStates) ** (BigInt(numStates) ** BigInt(ruleLength));
            if (total < 1_000_000_000_000_000n) {
                return total.toLocaleString();
            }
            const str = total.toString();
            const base = `${str[0]}.${str.slice(1, 4)}`;
            const exponent = str.length - 1;
            return `${base}e+${exponent}`;
        } catch {
            return 'Too large';
        }
    }

    return (
        <section className="space-y-2">
            <SectionTitle title={'Rule Number'} tooltip={tooltips.ruleNumber} />

            <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                className="border rounded px-3 py-2 w-full"
                min={0}
                placeholder="Enter rule number"
            />

            {maxAssignable !== undefined && (
                <p className="text-xs text-gray-600">
                    Max rule number:&nbsp;
                    <span className="font-mono break-all">
                        {formatMaxAssignable()}
                    </span>
                </p>
            )}

            <button
                onClick={handleRandom}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded text-lg font-semibold hover:bg-purple-700 transition"
            >
                Random Rule
            </button>

            <button
                onClick={handleStart}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded text-lg font-semibold hover:bg-blue-700 transition"
            >
                Initialize
            </button>
        </section>
    );
}
