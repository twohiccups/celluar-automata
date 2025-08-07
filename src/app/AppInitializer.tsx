'use client';

import { useEffect, useState } from 'react';
import { useRulesContext } from '@/app/contexts/RulesContext';
import { useCelluarContext } from '@/app/contexts/CelluarContext';
import { decodeConfigFromUrl } from '@/app/utils/decodeConfigFromUrl';

export function AppInitializer() {
    const rules = useRulesContext();
    const cell = useCelluarContext();

    const [hasInitialized, setHasInitialized] = useState(false);
    const [hasAppliedUrlConfig, setHasAppliedUrlConfig] = useState(false);
    const [pendingRuleNumber, setPendingRuleNumber] = useState<string | null>(null);

    useEffect(() => {
        if (hasInitialized || hasAppliedUrlConfig) return;

        const config = decodeConfigFromUrl();

        if (config) {
            cell.setLogicalWidth(config.logicalWidth);
            rules.setRuleLength(config.ruleLength);
            rules.setNumStates(config.numStates);
            setPendingRuleNumber(config.currentRuleNumber); // wait to apply
            cell.setScrollSpeed(config.scrollSpeed);
            cell.setInitializationMode(config.initializationMode);
            cell.setEdgeMode(config.edgeMode);
            cell.setColorPalette(config.colorPalette);
        }

        setHasAppliedUrlConfig(true);
    }, [hasInitialized, hasAppliedUrlConfig, rules, cell]);

    useEffect(() => {
        if (pendingRuleNumber !== null) {
            rules.selectRule(pendingRuleNumber);
            setPendingRuleNumber(null);
        }
    }, [pendingRuleNumber, rules.ruleLength, rules.numStates]); // track actual values

    useEffect(() => {
        if (!hasAppliedUrlConfig || hasInitialized) return;

        cell.initializeState();
        setHasInitialized(true);

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
    }, [hasAppliedUrlConfig, hasInitialized, cell]);

    return null;
}
