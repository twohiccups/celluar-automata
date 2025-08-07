
import { ThemeName, themeNames } from '@/app/themes';
import { useCelluarContext } from '../contexts/CelluarContext';
import { useState } from 'react';


export function ColorThemeSelector() {
    const {
        colorPalette,
        setColorPalette,
        applyTheme,
    } = useCelluarContext();

    const [selectedTheme, setSelectedTheme] = useState<ThemeName>('Basic');

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const themeName = e.target.value as ThemeName;
        setSelectedTheme(themeName);
        applyTheme(themeName);
    };

    const handleColorChange = (index: number, newColor: string) => {
        const updated = [...colorPalette];
        updated[index] = newColor;
        setColorPalette(updated);
    };

    return (
        <section className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Color Theme</h3>

            {/* Theme dropdown */}
            <div className="flex items-center gap-2 mb-4">
                <label className="font-medium">Select Theme:</label>
                <select
                    className="border rounded px-2 py-1"
                    value={selectedTheme}
                    onChange={handleThemeChange}
                >
                    {themeNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Color pickers */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {colorPalette.map((color, index) => (
                    <div key={index} className="flex flex-col items-center text-sm">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="w-10 h-10 border rounded"
                        />
                        <span className="mt-1 font-mono">S{index}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}