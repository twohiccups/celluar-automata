'use client';

import { createContext, useContext, useState } from 'react';
import { AppSnapshot } from '@/app/types'; // you already defined this

interface SnapshotContextProps {
    saveSnapshot: (snapshot: AppSnapshot) => void;
    undo: () => AppSnapshot | null;
    redo: () => AppSnapshot | null;
    canUndo: boolean;
    canRedo: boolean;
    clearHistory: () => void;
}

const SnapshotContext = createContext<SnapshotContextProps | undefined>(undefined);

export const SnapshotProvider = ({ children }: { children: React.ReactNode }) => {
    const [undoStack, setUndoStack] = useState<AppSnapshot[]>([]);
    const [redoStack, setRedoStack] = useState<AppSnapshot[]>([]);

    const saveSnapshot = (snapshot: AppSnapshot) => {
        setUndoStack((prev) => [...prev, snapshot]);
        setRedoStack([]); // clear forward history
    };

    const undo = (): AppSnapshot | null => {
        if (undoStack.length < 2) return null; // current + previous minimum
        const newStack = [...undoStack];
        const current = newStack.pop()!;
        const previous = newStack[newStack.length - 1];

        setUndoStack(newStack);
        setRedoStack((redo) => [current, ...redo]);

        return previous;
    };

    const redo = (): AppSnapshot | null => {
        if (redoStack.length === 0) return null;
        const [next, ...rest] = redoStack;
        setUndoStack((prev) => [...prev, next]);
        setRedoStack(rest);
        return next;
    };

    const clearHistory = () => {
        setUndoStack([]);
        setRedoStack([]);
    };

    return (
        <SnapshotContext.Provider
            value={{
                saveSnapshot,
                undo,
                redo,
                canUndo: undoStack.length > 1,
                canRedo: redoStack.length > 0,
                clearHistory,
            }}
        >
            {children}
        </SnapshotContext.Provider>
    );
};

export const useSnapshotContext = () => {
    const context = useContext(SnapshotContext);
    if (!context) {
        throw new Error('useSnapshotContext must be used within a SnapshotProvider');
    }
    return context;
};
