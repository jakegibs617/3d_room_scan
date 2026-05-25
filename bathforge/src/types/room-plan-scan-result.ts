export interface RoomPlanScanResult {
  success: boolean;
  cancelled?: boolean;
  message: string;
  usdzPath?: string;
  usdzUrl?: string;
  wallCount?: number;
  objectCount?: number;
  roomName?: string;
  timestamp: string;
}
