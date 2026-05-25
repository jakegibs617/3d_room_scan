export interface RoomPlanScanResult {
  success: boolean;
  cancelled?: boolean;
  message: string;
  jsonPath?: string;
  jsonUrl?: string;
  usdzPath?: string;
  usdzUrl?: string;
  wallCount?: number;
  objectCount?: number;
  roomName?: string;
  timestamp: string;
}

export interface RoomPlanScannerAvailability {
  supported: boolean;
  message: string;
  platform?: 'ios' | 'web';
  timestamp: string;
}
