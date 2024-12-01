export interface SuccessResponse<T> {
  status: string;
  data: T;
}

export interface GameClient {
  id: string;
  gameName: string;
  gameNamespace: string;
}

export interface Track {
  id: string;
  gameClientId: string;
  deviceId: string;
  eventType: string;
  eventData: Record<string, any> | null;
  timestamp: Date;
}
