// hooks/useAutoSnapshot.ts
'use client';

import { useRulesContext } from '@/app/contexts/RulesContext';
import { useCelluarContext } from '@/app/contexts/CelluarContext';
import { useSnapshotContext } from '@/app/contexts/SnapshotContext';

export function useAutoSnapshot() {
    const rules = useRulesContext();
    const cell = useCelluarContext();
    const { saveSnapshot } = useSnapshotContext();

    const captureSnapshot = () => {
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

    const withSnapshot = <T extends (...args: any[]) => any>(fn: T): T => {
        return ((...args: Parameters<T>) => {
            captureSnapshot();
            return fn(...args);
        }) as T;
    };

    return { withSnapshot, captureSnapshot };
}
