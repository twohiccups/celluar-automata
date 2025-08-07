// components/ExportConfigButton.tsx
'use client';

import { encodeConfigToUrl } from '@/app/utils/encodeConfigToUrl';
import { useCurrentSnapshot } from '@/app/hooks/useCurrentSnapshot';

export function ExportConfigButton() {
    const snapshot = useCurrentSnapshot();

    const handleCopy = async () => {
        const url = encodeConfigToUrl(snapshot);
        try {
            await navigator.clipboard.writeText(url);
            alert('Configuration URL copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="mt-4 px-3 py-1 border rounded bg-blue-100 hover:bg-blue-200"
        >
            Copy Config URL
        </button>
    );
}
