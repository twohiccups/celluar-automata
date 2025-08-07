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

    // 👇 Automatically apply rule + re-initialize when inputValue is a valid number
    useEffect(() => {
        const parsed = parseInt(inputValue, 10);
        if (!isNaN(parsed)) {
            selectRule(parsed);
            initializeState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);


    const totalAssignments = BigInt(numStates) ** BigInt(numStates ** ruleLength);
    const maxAssignable: number | bigint | undefined =
        totalAssignments <= BigInt(Number.MAX_SAFE_INTEGER)
            ? Number(totalAssignments) - 1
            : totalAssignments - BigInt(1);

    const handleRandom = () => {
        if (typeof maxAssignable === 'number') {
            const random = Math.floor(Math.random() * (maxAssignable + 1));
            setInputValue(random.toString());
        } else if (typeof maxAssignable === 'bigint') {
            // Generate a random bigint with the same number of digits as the max
            const digits = maxAssignable.toString().length;

            let randomStr = '';
            for (let i = 0; i < digits; i++) {
                randomStr += Math.floor(Math.random() * 10); // random digit 0–9
            }

            // Trim leading zeros and cap if it goes over maxAssignable
            let randomBig = BigInt(randomStr.replace(/^0+/, '') || '0');
            if (randomBig > maxAssignable) {
                randomBig = maxAssignable - (randomBig % maxAssignable); // pull it back within range
            }

            setInputValue(randomBig.toString());
        }
    };


    const handleStart = () => {
        initializeState(); // Re-start current rule from initial state
    };

    function formatMaxAssignable(max: number | bigint | undefined): string {
        if (max === undefined) return '';
        if (typeof max === 'number') {
            return max > 7625597484986 ? max.toExponential(3) : max.toLocaleString();
        }
        const str = max.toString();
        const base = `${str[0]}.${str.slice(1, 4)}`;
        const exponent = str.length - 1;
        return `${base}e+${exponent}`;
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
                        {formatMaxAssignable(maxAssignable)}
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
