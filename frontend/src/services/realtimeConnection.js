import * as signalR from "@microsoft/signalr";
import { store } from "../store";

const hubUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5083/api").replace(/\/api\/?$/, "") + "/hubs/chat";

let connection = null;

// SignalR JS can't set an Authorization header on the WebSocket handshake — the token is passed
// as a query param instead. The server reads it only for /hubs/* paths (see Program.cs).
// accessTokenFactory is re-invoked on every (re)connect, so read the store live rather than
// closing over a token that may have since been rotated by apiClient's refresh interceptor.
export function startRealtimeConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, { accessTokenFactory: () => store.getState().auth.accessToken })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  connection.start().catch((err) => console.error("SignalR connection failed:", err));
  return connection;
}

export function stopRealtimeConnection() {
  if (connection) {
    connection.stop();
    connection = null;
  }
}

export function getRealtimeConnection() {
  return connection;
}
