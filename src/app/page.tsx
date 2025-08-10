'use client';

import { CelluarContextProvider } from '@/app/contexts/CelluarContext';
import { RulesProvider } from '@/app/contexts/RulesContext';
import { AppInitializer } from '@/app/AppInitializer';

import CanvasAutomaton from '@/app/components/CanvasAutomaton';
import MobileControls from '@/app/components/MobileControls';
import DesktopSidebar from '@/app/components/DesktopSidebar';


export default function Home() {
  return (
    <RulesProvider>
      <CelluarContextProvider>
        <AppInitializer />

        {/* Mobile top sheet */}
        <MobileControls />

        <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
          {/* Canvas area: always centered; grows when desktop panel collapses */}
          <div className="relative flex-1 overflow-hidden">
            <div className="flex h-full w-full items-center justify-center p-2 md:p-4">
              <div className="origin-top scale-wrapper">
                <CanvasAutomaton />
              </div>
            </div>
          </div>

          {/* Desktop sidebar (collapsible) */}
          <DesktopSidebar />
        </div>
      </CelluarContextProvider>
    </RulesProvider>
  );
}
