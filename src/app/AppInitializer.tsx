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

    // Phase 1: Apply config if present
    useEffect(() => {
        if (hasInitialized || hasAppliedUrlConfig) return;

        const config = decodeConfigFromUrl();

        if (config) {
            // Apply rule config
            rules.setRuleLength(config.ruleLength);
            rules.setNumStates(config.numStates);
            rules.selectRule(config.currentRuleNumber);

            // Apply cellular config
            cell.setLogicalWidth(config.logicalWidth);
            cell.setScrollSpeed(config.scrollSpeed);
            cell.setInitializationMode(config.initializationMode);
            cell.setEdgeMode(config.edgeMode);
            cell.setColorPalette(config.colorPalette);

            setHasAppliedUrlConfig(true);

            // Clean the URL
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
        } else {
            // No config found — just proceed to init
            setHasAppliedUrlConfig(true);
        }
    }, [hasInitialized, hasAppliedUrlConfig, rules, cell]);

    // Phase 2: Run initializeState after config (or default)
    useEffect(() => {
        if (!hasAppliedUrlConfig || hasInitialized) return;

        cell.initializeState();
        setHasInitialized(true);
    }, [hasAppliedUrlConfig, hasInitialized, cell]);

    return null;
}
