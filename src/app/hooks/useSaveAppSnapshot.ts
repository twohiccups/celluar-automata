// hooks/useSaveAppSnapshot.ts
'use client';

import { useRulesContext } from '@/app/contexts/RulesContext';
import { useCelluarContext } from '@/app/contexts/CelluarContext';
import { useSnapshotContext } from '@/app/contexts/SnapshotContext';

export function useSaveAppSnapshot() {
    const rules = useRulesContext();
    const cell = useCelluarContext();
    const { saveSnapshot } = useSnapshotContext();

    return () => {
        saveSnapshot({
            ruleSet: rules.ruleSet,
            ruleLength: rules.ruleLength,
            currentRuleNumber: rules.currentRuleNumber,
            numStates: rules.numStates,

            logicalWidth: cell.logicalWidth,
            scrollSpeed: cell.scrollSpeed,
            initializationMode: cell.initializationMode,
            edgeMode: cell.edgeMode,
            colorPalette: cell.colorPalette,
        });
    };
}
