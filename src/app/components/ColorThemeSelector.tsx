'use client';

import { ThemeName, themeNames } from '@/app/themes';
import { useCelluarContext } from '../contexts/CelluarContext';
import { useState } from 'react';
import SectionTitle from './SectionTitle';
import { tooltips } from '../tooltips';

export function ColorThemeSelector() {
    const {
        colorPalette,
        setColorPalette,
        applyTheme,
    } = useCelluarContext();

    const [selectedTheme, setSelectedTheme] = useState<ThemeName>('Basic');
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const updated = [...colorPalette];
        const temp = updated[draggedIndex];
        updated[draggedIndex] = updated[index];
        updated[index] = temp;

        setColorPalette(updated);
        setDraggedIndex(null);
    };

    return (
        <section className="mt-6">
            <SectionTitle title={'Color Theme'} tooltip={tooltips.colorTheme} />

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

            {/* Color pickers with drag-and-drop */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {colorPalette.map((color, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-sm cursor-move"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                    >
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
