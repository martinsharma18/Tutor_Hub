import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAppSelector } from "../store/hooks";
import { selectAccessToken, selectCurrentUser } from "../store/authSlice";
import { startRealtimeConnection, stopRealtimeConnection } from "../services/realtimeConnection";

/**
 * Mounted once near the app root. Owns the SignalR connection lifecycle and turns "ReceiveMessage"
 * / "ReceiveNotification" push events into React Query cache invalidation + a toast, so dashboard
 * screens update live instead of only on next navigation/refetch.
 */
const RealtimeProvider = ({ children }) => {
  const user = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectAccessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user || !accessToken) {
      stopRealtimeConnection();
      return;
    }

    const connection = startRealtimeConnection();

    const onMessage = (message) => {
      queryClient.invalidateQueries({ queryKey: ["messages", message.senderId] });
      queryClient.invalidateQueries({ queryKey: ["messages-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["messages-unread-count"] });
      toast("New message received", { icon: "💬" });
    };

    const onNotification = (notification) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      toast(notification.title, { icon: "🔔" });
    };

    connection.on("ReceiveMessage", onMessage);
    connection.on("ReceiveNotification", onNotification);

    return () => {
      connection.off("ReceiveMessage", onMessage);
      connection.off("ReceiveNotification", onNotification);
    };
  }, [user, accessToken, queryClient]);

  return children;
};

export default RealtimeProvider;
