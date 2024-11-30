// =======================================================================
// Request
// =======================================================================
export interface UpsertUserRequestBody {
    username: string;
    email: string;
    password: string;
}

export interface GetUserRequestParams {
    id: string;
}

export interface UpsertGameClientRequestBody {
    gameName: string;
    gameNamespace: string;
}

export interface GetGameClientRequestParams {
    id: string;
}

export interface AuthUserRequestBody {
    username?: string;
    email?: string;
    password: string;
}

export interface AuthDeviceRequestBody {
    device_id: string;
    client_id: string;
}

export interface LinkDeviceToUserRequestBody {
    userId: string;
    deviceId: string;
    gameClientId: string;
    isAnonymous: boolean;
}

export interface CreateTrackRequest {
    eventType: string;
    eventData: Record<string, unknown> | null;
    timestamp?: Date;
}

export interface TelemetryEvent {
    id: string;
    user_id: string;
    event_type: string;
    event_data: Record<string, unknown>;
    timestamp: Date;
}

export interface EventStats {
    eventType: string;
    count: number;
    firstSeen: Date;
    lastSeen: Date;
}

// =======================================================================
// Response
// =======================================================================

export interface SuccessResponse<T> {
    status: "success";
    data: T;
    message?: string;
}

export interface ErrorResponse {
    status: "error";
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
    retryAfter?: number;
}

export interface UpsertUserResponse {
    id: string;
    username: string;
    email: string;
}

export interface GetUserResponse {
    id: string;
    username: string;
    email: string;
}

export interface UpsertGameClientResponse {
    id: string;
    gameName: string;
    gameNamespace: string;
}

export interface GetGameClientResponse {
    id: string;
    gameName: string;
    gameNamespace: string;
}

export interface AuthUserResponse {
    userToken: string;
}

export interface AuthDeviceResponse {
    deviceToken: string;
}

export interface CreateTrackResponse {
    id: string;
    gameClientId: string;
    deviceId: string;
    eventType: string;
    eventData: Record<string, unknown> | null;
    timestamp: Date;
}

export interface TrackEventStats {
    eventType: string;
    count: number;
    firstSeen: Date;
    lastSeen: Date;
}
