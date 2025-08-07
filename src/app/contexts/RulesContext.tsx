'use client';

import { createContext, useContext, useState } from 'react';

export interface RuleSet {
    [key: string]: string;
}

interface RulesContextProps {
    ruleLength: number;
    ruleSet: RuleSet;
    currentRuleNumber: number;
    numStates: number;

    // Core logic
    selectRule: (ruleNumber: number) => void;
    updateRule: (key: string, newValue?: string) => void;

    // Setters
    setNumStates: (numStates: number) => void;
    setRuleSet: (ruleSet: RuleSet) => void;
    setCurrentRuleNumber: (ruleNumber: number) => void;
    setRuleLength: (length: number) => void;

    // Helpers
    setRuleLengthAndReset: (length: number) => void;
    setNumStatesAndReset: (count: number) => void;
    generateRuleSet: (length?: number, states?: number) => void;
}

const RulesContext = createContext<RulesContextProps | undefined>(undefined);

export const RulesProvider = ({ children }: { children: React.ReactNode }) => {
    const [ruleSet, setRuleSet] = useState<RuleSet>({});
    const [currentRuleNumber, setCurrentRuleNumber] = useState(90);
    const [ruleLength, setRuleLength] = useState(3);
    const [numStates, setNumStates] = useState(2);

    // Always generate rule set based on latest inputs
    function generateRuleSet(customLength = ruleLength, customStates = numStates) {
        const totalRules = customStates ** customLength;
        const newRuleSet: RuleSet = {};

        for (let i = 0; i < totalRules; i++) {
            const key = i.toString(customStates).padStart(customLength, '0');
            newRuleSet[key] = '0';
        }

        setRuleSet(newRuleSet);
        setCurrentRuleNumber(0);
    }

    function selectRule(ruleNumber: number) {
        const totalRules = numStates ** ruleLength;
        const keys: string[] = [];

        for (let i = 0; i < totalRules; i++) {
            keys.push(i.toString(numStates).padStart(ruleLength, '0'));
        }

        keys.reverse();

        const ruleString = ruleNumber.toString(numStates).padStart(totalRules, '0');

        const newRules: RuleSet = {};
        for (let i = 0; i < totalRules; i++) {
            newRules[keys[i]] = ruleString[i] ?? '0';
        }

        setRuleSet(newRules);
        setCurrentRuleNumber(ruleNumber);
    }

    function updateRule(key: string, newValue?: string) {
        setRuleSet((prev) => {
            const current = prev[key];
            if (current === undefined) return prev;

            const updatedValue =
                newValue !== undefined
                    ? newValue
                    : ((parseInt(current) + 1) % numStates).toString();

            const newRules = {
                ...prev,
                [key]: updatedValue,
            };

            // Recalculate rule number
            const keys = Object.keys(newRules).sort().reverse();
            const digits = keys.map((k) => newRules[k] ?? '0').join('');
            const newRuleNum = parseInt(digits, numStates);
            setCurrentRuleNumber(newRuleNum);

            return newRules;
        });
    }

    function setRuleLengthAndReset(length: number) {
        setRuleLength(length);
        generateRuleSet(length, numStates); // use new length with current numStates
    }

    function setNumStatesAndReset(count: number) {
        setNumStates(count);
        generateRuleSet(ruleLength, count); // use current ruleLength with new numStates
    }

    return (
        <RulesContext.Provider
            value={{
                ruleSet,
                currentRuleNumber,
                ruleLength,
                numStates,
                selectRule,
                updateRule,
                generateRuleSet,
                setNumStates,
                setRuleSet,
                setCurrentRuleNumber,
                setRuleLength,
                setRuleLengthAndReset,
                setNumStatesAndReset,
            }}
        >
            {children}
        </RulesContext.Provider>
    );
};

export const useRulesContext = () => {
    const context = useContext(RulesContext);
    if (!context) {
        throw new Error('useRulesContext must be used within a RulesProvider');
    }
    return context;
};
