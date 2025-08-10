'use client';

import { createContext, useContext, useState } from 'react';

export interface RuleSet {
  [key: string]: string;
}

interface RulesContextProps {
  ruleLength: number;
  ruleSet: RuleSet;
  currentRuleNumber: string; // decimal string
  numStates: number;

  // Core logic
  selectRule: (ruleNumber: string) => void;
  updateRule: (key: string, newValue?: string) => void;

  // Setters
  setNumStates: (numStates: number) => void;
  setRuleSet: (ruleSet: RuleSet) => void;
  setCurrentRuleNumber: (ruleNumber: string) => void;
  setRuleLength: (length: number) => void;

  // Helpers
  setRuleLengthAndReset: (length: number) => void;
  setNumStatesAndReset: (count: number) => void;
  generateRuleSet: (length?: number, states?: number) => void;
}

const RulesContext = createContext<RulesContextProps | undefined>(undefined);

export const RulesProvider = ({ children }: { children: React.ReactNode }) => {
  const [ruleSet, setRuleSet] = useState<RuleSet>({});
  const [currentRuleNumber, setCurrentRuleNumber] = useState<string>('90');
  const [ruleLength, setRuleLength] = useState<number>(3);
  const [numStates, setNumStates] = useState<number>(2);

  function generateRuleSet(customLength = ruleLength, customStates = numStates) {
    const totalRules = customStates ** customLength;
    const newRuleSet: RuleSet = {};

    for (let i = 0; i < totalRules; i++) {
      const key = i.toString(customStates).padStart(customLength, '0');
      newRuleSet[key] = '0';
    }

    setRuleSet(newRuleSet);
    setCurrentRuleNumber('0');
  }

  function selectRule(ruleStr: string) {
    const totalKeys = numStates ** ruleLength;

    const keys: string[] = [];
    for (let i = 0; i < totalKeys; i++) {
      keys.push(i.toString(numStates).padStart(ruleLength, '0'));
    }
    keys.reverse();

    // Convert decimal string -> base-(numStates) string with left padding
    let baseN = '0';
    try {
      baseN = BigInt(ruleStr).toString(numStates).padStart(keys.length, '0');
    } catch {
      baseN = '0'.padStart(keys.length, '0');
    }

    const newRules: RuleSet = {};
    for (let i = 0; i < keys.length; i++) {
      newRules[keys[i]] = baseN[i] ?? '0';
    }

    setRuleSet(newRules);
    setCurrentRuleNumber(ruleStr);
  }

  // --- BigInt-safe base-N digits -> decimal string
  function digitsBaseNToDecimalString(digits: string, base: number): string {
    let acc = 0n;
    const B = BigInt(base);
    for (let i = 0; i < digits.length; i++) {
      const d = BigInt(parseInt(digits[i], base)); // digit value (0..base-1)
      acc = acc * B + d;
    }
    return acc.toString(); // decimal string
  }

  function updateRule(key: string, newValue?: string) {
    setRuleSet((prev) => {
      const current = prev[key];
      if (current === undefined) return prev;

      const updatedValue =
        newValue !== undefined ? newValue : ((parseInt(current) + 1) % numStates).toString();

      const newRules = {
        ...prev,
        [key]: updatedValue,
      };

      // Recalculate rule number EXACTLY (no Number, no binary hop)
      // Sort keys descending as your decode expects (highest pattern first)
      const keys = Object.keys(newRules).sort().reverse();
      const digits = keys.map((k) => newRules[k] ?? '0').join(''); // base-(numStates) digit string

      try {
        const decimal = digitsBaseNToDecimalString(digits, numStates);
        setCurrentRuleNumber(decimal);
      } catch {
        setCurrentRuleNumber('0'); // fallback
      }

      return newRules;
    });
  }

  function setRuleLengthAndReset(length: number) {
    setRuleLength(length);
    generateRuleSet(length, numStates);
  }

  function setNumStatesAndReset(count: number) {
    setNumStates(count);
    generateRuleSet(ruleLength, count);
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
