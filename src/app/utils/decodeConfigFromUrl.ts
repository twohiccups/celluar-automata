import { AppSnapshot, InitializationMode, EdgeMode } from '@/app/types';

export function decodeConfigFromUrl(): AppSnapshot | null {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);

    try {
        return {
            ruleLength: parseInt(params.get('length') ?? '3', 10),
            currentRuleNumber: params.get('rule') ?? '0',
            numStates: parseInt(params.get('states') ?? '2', 10),
            logicalWidth: parseInt(params.get('width') ?? '300', 10),
            scrollSpeed: parseInt(params.get('speed') ?? '40', 10),
            initializationMode: parseInt(params.get('init') ?? '0', 10) as InitializationMode,
            edgeMode: parseInt(params.get('edge') ?? '0', 10) as EdgeMode,
            colorPalette: (() => {
                const raw = params.get('colors');
                return raw ? JSON.parse(raw) : [];
            })(),
        };
    } catch (e) {
        console.error('Invalid config URL', e);
        return null;
    }
}
