'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { themes, ThemeName } from '@/app/themes';
import { useRulesContext } from './RulesContext';
import { ColorThemeSelector } from '../components/ColorThemeSelector';



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
    colorScheme: string;
    initializationMode: InitializationMode;
    edgeMode: EdgeMode;
    colorPalette: string[];
    applyTheme: (themeName: ThemeName) => void;

    // Functions
    initializeState: () => void;
    nextStep: () => void;

    // Setters
    setLogicalWidth: (v: number) => void;
    setScrollSpeed: (v: number) => void;
    setInitializationMode: (mode: InitializationMode) => void;
    setCurrentState: (state: string[]) => void;
    setEdgeMode: (mode: EdgeMode) => void;
    setColorScheme: (scheme: string) => void;
    setColorPalette: (colors: string[]) => void;

}

export const CelluarContext = createContext<CelluarContextProps | undefined>(undefined);

export const CelluarContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentState, setCurrentState] = useState<string[]>([]);
    const [scrollSpeed, setScrollSpeed] = useState<number>(40)
    const [colorScheme, setColorScheme] = useState("Basic");
    const [initializationMode, setInitializationMode] = useState<InitializationMode>(InitializationMode.CENTER);
    const [edgeMode, setEdgeMode] = useState(EdgeMode.STATIC);
    const [colorPalette, setColorPalette] = useState<string[]>(themes.Basic); // default palette
    const [logicalWidth, setLogicalWidth] = useState<number>(300);

    const { ruleLength, ruleSet } = useRulesContext()



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
        colorScheme,
        initializationMode,
        edgeMode,
        colorPalette,
        nextStep,
        initializeState,
        applyTheme,
        setLogicalWidth,
        setScrollSpeed,
        setInitializationMode,
        setCurrentState,
        setEdgeMode,
        setColorScheme,
        setColorPalette,
    };

    useEffect(() => {
        applyTheme('Basic');
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
