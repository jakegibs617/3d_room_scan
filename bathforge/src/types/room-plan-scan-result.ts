export interface RoomPlanScanResult {
  success: boolean;
  cancelled?: boolean;
  message: string;
  usdzPath?: string;
  wallCount?: number;
  objectCount?: number;
  roomName?: string;
  timestamp: string;
}
