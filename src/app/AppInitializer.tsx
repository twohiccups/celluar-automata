'use client';

import { useEffect, useState } from 'react';
import { useRulesContext } from '@/app/contexts/RulesContext';
import { useCelluarContext } from '@/app/contexts/CelluarContext';
import { decodeConfigFromUrl } from '@/app/utils/decodeConfigFromUrl';

type UrlTargets = { ruleLength: number; numStates: number };

export function AppInitializer() {
    const rules = useRulesContext();
    const cell = useCelluarContext();

    const [hasInitialized, setHasInitialized] = useState(false);
    const [hasAppliedUrlConfig, setHasAppliedUrlConfig] = useState(false);
    const [pendingRuleNumber, setPendingRuleNumber] = useState<string | null>('90');
    const [targets, setTargets] = useState<UrlTargets | null>(null);

    // Read URL once, apply settings. Set palette first to avoid default overwriting.
    useEffect(() => {
        if (hasInitialized || hasAppliedUrlConfig) return;

        const config = decodeConfigFromUrl();

        if (config) {
            // remember the intended base params so we can wait for them
            setTargets({ ruleLength: config.ruleLength, numStates: config.numStates });

            if (config.colorPalette?.length) {
                cell.setColorPalette(config.colorPalette);           // 1) colors first
            }
            cell.setLogicalWidth(config.logicalWidth);             // 2) width (may trigger init later)
            rules.setRuleLength(config.ruleLength);                // 3) base params
            rules.setNumStates(config.numStates);
            setPendingRuleNumber(config.currentRuleNumber);        // 4) defer applying rule until base is ready
            cell.setScrollSpeed(config.scrollSpeed);
            cell.setInitializationMode(config.initializationMode);
            cell.setEdgeMode(config.edgeMode);
        }

        setHasAppliedUrlConfig(true);
    }, [hasInitialized, hasAppliedUrlConfig, rules, cell]);

    // Apply rule number ONLY after ruleLength/numStates in context match the URL targets
    useEffect(() => {
        if (pendingRuleNumber === null || !targets) return;

        const ready =
            rules.ruleLength === targets.ruleLength &&
            rules.numStates === targets.numStates;

        if (!ready) return; // wait until context reflects the URL params

        rules.selectRule(pendingRuleNumber);
        setPendingRuleNumber(null); // now safe to clear
    }, [pendingRuleNumber, targets, rules.ruleLength, rules.numStates, rules]);

    // Finally, once URL config applied, initialize state and clean URL
    useEffect(() => {
        if (!hasAppliedUrlConfig || hasInitialized) return;

        // if we still have a pending rule, wait
        if (pendingRuleNumber !== null) return;

        cell.initializeState();
        setHasInitialized(true);

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
    }, [hasAppliedUrlConfig, hasInitialized, pendingRuleNumber, cell]);

    return null;
}
