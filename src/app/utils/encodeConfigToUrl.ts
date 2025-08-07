// utils/encodeConfigToUrl.ts
import { AppSnapshot } from '@/app/types';

export function encodeConfigToUrl(snapshot: AppSnapshot): string {
  const params = new URLSearchParams();

  params.set('rule', snapshot.currentRuleNumber.toString());
  params.set('length', snapshot.ruleLength.toString());
  params.set('states', snapshot.numStates.toString());
  params.set('width', snapshot.logicalWidth.toString());
  params.set('speed', snapshot.scrollSpeed.toString());
  params.set('init', snapshot.initializationMode.toString());
  params.set('edge', snapshot.edgeMode.toString());
  params.set('colors', JSON.stringify(snapshot.colorPalette));

  return `${window.location.origin}/?${params.toString()}`;
}
