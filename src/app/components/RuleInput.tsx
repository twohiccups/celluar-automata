'use client';

import { useEffect, useState } from "react";
import { useCelluarContext } from "../contexts/CelluarContext";
import { useRulesContext } from "../contexts/RulesContext";
import SectionTitle from "./SectionTitle";

export default function RuleInput() {

    const ruleNumTooltip = ''

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



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        if (/^\d+$/.test(inputValue)) {
            selectRule(inputValue);
            initializeState();
        }
    }, [inputValue]);



    const totalAssignments = BigInt(numStates) ** BigInt(numStates ** ruleLength);
    const maxAssignable: number | bigint | undefined =
        totalAssignments <= BigInt(Number.MAX_SAFE_INTEGER)
            ? Number(totalAssignments) - 1
            : totalAssignments - BigInt(1);

    const handleRandom = () => {
        const max = BigInt(numStates) ** (BigInt(numStates) ** BigInt(ruleLength));

        // Generate a random bigint within [0, max)
        const maxDigits = max.toString().length;

        let randomBigInt = BigInt(0);
        while (randomBigInt >= max || randomBigInt === BigInt(0)) {
            let str = '';
            for (let i = 0; i < maxDigits; i++) {
                str += Math.floor(Math.random() * 10);
            }
            str = str.replace(/^0+/, '') || '0';
            randomBigInt = BigInt(str);
        }

        setInputValue(randomBigInt.toString());
    };



    const handleStart = () => {
        initializeState(); // Re-start current rule from initial state
    };

    function formatMaxAssignable(): string {
        try {
            const total = BigInt(numStates) ** (BigInt(numStates) ** BigInt(ruleLength));

            // If total is small enough, show full number with commas
            if (total < 1_000_000_000_000_000n) {
                return total.toLocaleString();
            }

            // Otherwise, format in scientific notation
            const str = total.toString();
            const base = `${str[0]}.${str.slice(1, 4)}`;
            const exponent = str.length - 1;
            return `${base}e+${exponent}`;
        } catch {
            return 'Too large';
        }
    }




    return (
        <section className="mt-6">
            <SectionTitle title={'Rule Number'} tooltip={ruleNumTooltip} />

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
                className="w-full mt-2 mb-2 py-2 px-4 bg-blue-600 text-white rounded text-lg font-semibold hover:bg-blue-700 transition"
            >
                Initialize
            </button>


        </section>
    );
}
