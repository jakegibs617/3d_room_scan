import { registerPlugin } from '@capacitor/core';
import type { RoomPlanScannerAvailability, RoomPlanScanResult } from '../types/room-plan-scan-result';

export interface RoomPlanScannerPlugin {
  getAvailability(): Promise<RoomPlanScannerAvailability>;
  startScan(): Promise<RoomPlanScanResult>;
  previewScan(options: { path: string }): Promise<void>;
}

export const RoomPlanScanner = registerPlugin<RoomPlanScannerPlugin>('RoomPlanScanner', {
  web: () => ({
    async getAvailability(): Promise<RoomPlanScannerAvailability> {
      return {
        supported: false,
        message: 'RoomPlan scanning is only available in the native iOS app.',
        platform: 'web',
        timestamp: new Date().toISOString(),
      };
    },
    async startScan(): Promise<RoomPlanScanResult> {
      return {
        success: false,
        cancelled: false,
        message: 'RoomPlan scanning is only available in the native iOS app.',
        timestamp: new Date().toISOString(),
      };
    },
    previewScan(options: { path: string }): Promise<void> {
      // USDZ preview is not available in the browser.
      void options;
      return Promise.resolve();
    },
  }),
});
