import { registerPlugin } from '@capacitor/core';
import type { RoomPlanScanResult } from '../types/room-plan-scan-result';

export interface RoomPlanScannerPlugin {
  startScan(): Promise<RoomPlanScanResult>;
}

export const RoomPlanScanner = registerPlugin<RoomPlanScannerPlugin>('RoomPlanScanner', {
  web: () => ({
    async startScan(): Promise<RoomPlanScanResult> {
      return {
        success: false,
        cancelled: false,
        message: 'RoomPlan scanning is only available in the native iOS app.',
        timestamp: new Date().toISOString(),
      };
    },
  }),
});
