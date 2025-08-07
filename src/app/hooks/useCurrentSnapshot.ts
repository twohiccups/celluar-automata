// hooks/useCurrentSnapshot.ts
import { useRulesContext } from '@/app/contexts/RulesContext';
import { useCelluarContext } from '@/app/contexts/CelluarContext';
import { AppSnapshot } from '@/app/types';

export function useCurrentSnapshot(): AppSnapshot {
    const rules = useRulesContext();
    const cell = useCelluarContext();

    return {
        ruleLength: rules.ruleLength,
        currentRuleNumber: rules.currentRuleNumber,
        numStates: rules.numStates,

        logicalWidth: cell.logicalWidth,
        scrollSpeed: cell.scrollSpeed,
        initializationMode: cell.initializationMode,
        edgeMode: cell.edgeMode,
        colorPalette: cell.colorPalette,
    };
}
