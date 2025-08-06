'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { themes, ThemeName } from '@/app/themes';


interface RuleSet {
    [key: string]: string;
}

export enum EdgeMode {
    STATIC,
    MODULAR,
}

export enum InitializationMode {
    CENTER,
    RIGHT,
    LEFT,
    FEW,
    SPORADIC,
    RANDOM,
}



interface CelluarContextProps {
    logicalWidth: number;
    scrollSpeed: number;
    currentState: string[];
    ruleLength: number;
    numStates: number;
    colorScheme: string;
    initializationMode: InitializationMode;
    ruleSet: RuleSet;
    edgeMode: EdgeMode;
    currentRuleNumber: number;
    colorPalette: string[];
    applyTheme: (themeName: ThemeName) => void;

    // Functions
    generateRuleSet: () => void;
    selectRule: (ruleNumber: number) => void;
    updateRule: (key: string, newValue?: string) => void;
    initializeState: () => void;
    nextStep: () => void;
    setup: (rule: number, mode: InitializationMode) => void;

    // Setters
    setLogicalWidth: (v: number) => void;
    setScrollSpeed: (v: number) => void;
    setInitializationMode: (mode: InitializationMode) => void;
    setRuleLengthAndReset: (length: number) => void;
    setNumStatesAndReset: (count: number) => void;
    setCurrentState: (state: string[]) => void;
    setEdgeMode: (mode: EdgeMode) => void;
    setColorScheme: (scheme: string) => void;
    setColorPalette: (colors: string[]) => void;

}

export const CelluarContext = createContext<CelluarContextProps | undefined>(undefined);

export const CelluarContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentState, setCurrentState] = useState<string[]>([]);
    const [scrollSpeed, setScrollSpeed] = useState<number>(40)
    const [ruleLength, setRuleLength] = useState(3);
    const [numStates, setNumStates] = useState(2); // default binary
    const [colorScheme, setColorScheme] = useState('default');
    const [initializationMode, setInitializationMode] = useState<InitializationMode>(InitializationMode.CENTER);
    const [ruleSet, setRuleSet] = useState<RuleSet>({});
    const [edgeMode, setEdgeMode] = useState(EdgeMode.STATIC);
    const [currentRuleNumber, setCurrentRuleNumber] = useState(90);
    const [colorPalette, setColorPalette] = useState<string[]>(themes.Basic); // default palette
    const [logicalWidth, setLogicalWidth] = useState<number>(300);


    function generateRuleSet() {
        const totalRules = numStates ** ruleLength;
        const newRuleSet: RuleSet = {};

        for (let i = 0; i < totalRules; i++) {
            const key = i.toString(numStates).padStart(ruleLength, '0');
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

        keys.reverse(); // high-order patterns first

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

            // Recompute rule number
            const keys = Object.keys(newRules).sort().reverse();
            const digits = keys.map((k) => newRules[k] ?? '0').join('');
            const newRuleNum = parseInt(digits, numStates);
            setCurrentRuleNumber(newRuleNum);

            return newRules;
        });
    }

    function initializeState() {
        const width = logicalWidth;
        const newState = Array(width).fill('0');

        switch (initializationMode) {
            case InitializationMode.CENTER:
                newState[Math.floor(width / 2)] = '1';
                break;
            case InitializationMode.RIGHT:
                newState[width - 1] = '1';
                break;
            case InitializationMode.LEFT:
                newState[0] = '1';
                break;
            case InitializationMode.FEW:
                newState[Math.floor(width / 3)] = '1';
                newState[Math.floor((2 * width) / 3)] = '1';
                break;
            case InitializationMode.SPORADIC:
                for (let i = 0; i < width; i++) {
                    newState[i] = Math.random() < 0.1 ? '1' : '0';
                }
                break;
            case InitializationMode.RANDOM:
                for (let i = 0; i < width; i++) {
                    newState[i] = Math.random() < 0.5 ? '1' : '0';
                }
                break;
        }

        setCurrentState(newState);
    }


    function setup(rule: number) {
        selectRule(rule);
        initializeState();
    }

    function nextStep() {
        const len = currentState.length;
        const newState: string[] = [];
        const offset = Math.floor(ruleLength / 2);

        for (let i = 0; i < len; i++) {
            let key = '';

            for (let j = 0; j < ruleLength; j++) {
                const index = i - offset + j;

                if (edgeMode === EdgeMode.STATIC) {
                    key += index < 0 || index >= len ? '0' : currentState[index];
                } else if (edgeMode === EdgeMode.MODULAR) {
                    key += currentState[(index + len) % len];
                }
            }

            const result = ruleSet[key];
            newState.push(result ?? '0');
        }

        setCurrentState(newState);
    }


    function setRuleLengthAndReset(length: number) {
        setRuleLength(length);
        generateRuleSet();
        setCurrentRuleNumber(0);
    }

    function setNumStatesAndReset(count: number) {
        setNumStates(count);
        generateRuleSet();
        setCurrentRuleNumber(0);
    }

    function applyTheme(themeName: ThemeName) {
        const theme = themes[themeName];
        if (theme) {
            setColorPalette([...theme]); // copy, so it's editable without affecting base
        }
    }

    const value: CelluarContextProps = {
        logicalWidth,
        scrollSpeed,
        currentState,
        ruleLength,
        colorScheme,
        initializationMode,
        ruleSet,
        edgeMode,
        currentRuleNumber,
        numStates,
        colorPalette,


        generateRuleSet,
        selectRule,
        nextStep,
        updateRule,
        initializeState,
        setup,
        applyTheme,

        setLogicalWidth,
        setScrollSpeed,
        setInitializationMode,
        setRuleLengthAndReset,
        setNumStatesAndReset,
        setCurrentState,
        setEdgeMode,
        setColorScheme,
        setColorPalette,
    };

    useEffect(() => {
        initializeState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logicalWidth]);


    return <CelluarContext.Provider value={value}>{children}</CelluarContext.Provider>;
};

export function useCelluarContext() {
    const context = useContext(CelluarContext);
    if (!context) {
        throw new Error('useCelluarContext must be used within a CelluarContextProvider');
    }
    return context;
}
