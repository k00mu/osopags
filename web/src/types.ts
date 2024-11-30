export interface SuccessResponse<T> {
  status: string;
  data: T;
}

export interface GameClient {
  id: string;
  gameName: string;
  gameNamespace: string;
}
