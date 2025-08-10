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
            className="w-full mb-2 py-2 px-4 bg-green-600 text-white rounded text-lg font-semibold hover:bg-green-700 transition"
        >
            Copy Config URL
        </button>
    );
}
