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
    FEW,
    SPORADIC,
    RANDOM,
}


export interface AppSnapshot {
    ruleSet: RuleSet;
    ruleLength: number;
    currentRuleNumber: number;
    numStates: number;

    logicalWidth: number;
    scrollSpeed: number;
    initializationMode: InitializationMode;
    edgeMode: EdgeMode;
    colorPalette: string[];
}
