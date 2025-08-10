'use client';

import RuleEditor from '@/app/components/RuleEditor';
import RuleInput from './RuleInput';
import { ColorThemeSelector } from './ColorThemeSelector';
import { ExportConfigButton } from './ExportConfigButton';
import RuleConfigSelectors from './RuleConfigSelectors';
import LogicalWidthSelector from './LogicalWidthSelector';
import EdgeModeSelector from './EdgeModeSelector';
import InitializationSelector from './InitializationSelector';
import ScrollSpeedSelector from './ScrollSpeedSelector';


export default function ControlPanel() {
    return (
        <div className="mb-6 p-4 bg-gray-50 rounded shadow space-y-6">
            <RuleInput />
            <ExportConfigButton />
            <RuleConfigSelectors />
            <RuleEditor />
            <InitializationSelector />
            <EdgeModeSelector />
            <LogicalWidthSelector />
            <ScrollSpeedSelector />
            <ColorThemeSelector />
        </div>
    );
}
