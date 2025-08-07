export interface RuleSet {
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
    TWO,
    SPORADIC,
    RANDOM,
}


export interface AppSnapshot {
    ruleLength: number;
    currentRuleNumber: string;
    numStates: number;

    logicalWidth: number;
    scrollSpeed: number;
    initializationMode: InitializationMode;
    edgeMode: EdgeMode;
    colorPalette: string[];
}