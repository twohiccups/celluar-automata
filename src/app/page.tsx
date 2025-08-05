'use client';

import { useState } from 'react';
import { CelluarContextProvider } from '@/app/CelluarContext';
import CanvasAutomaton from '@/app/components/CanvasAutomaton';
import ControlPanel from '@/app/components/ControlPanel';

export default function Home() {

  return (
    <CelluarContextProvider>
      <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
        <div className="flex justify-center items-center flex-1 overflow-hidden p-4">
          <div className="origin-top scale-wrapper">
            <CanvasAutomaton />
          </div>
        </div>

        <div className="w-full md:w-[350px] shrink-0 overflow-y-auto p-4 bg-white shadow">
          <ControlPanel
          />
        </div>
      </div>
    </CelluarContextProvider >
  );
}
