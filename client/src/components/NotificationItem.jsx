import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification }) {
  const { dispatch } = useNotifications();

  const { mutate } = useMutation({
    mutationFn: () => apiClient.patch(`/api/notifications/${notification.id}/read`),
    onMutate: async () => {
      // Optimistic update: mark as read immediately in the client reducer
      dispatch({ type: "MARK_READ", payload: notification.id });
    },
    onError: async (error) => {
      // Rollback: re-fetch notifications from the server to restore true state
      console.error("[NotificationItem] Error marking notification as read:", error);
      try {
        const res = await apiClient.get("/api/notifications");
        dispatch({ type: "LOAD_NOTIFICATIONS", payload: res.data });
      } catch (rollbackError) {
        console.error("[NotificationItem] Rollback error:", rollbackError);
      }
    },
  });

  const handleClick = () => {
    if (!notification.isRead) {
      mutate();
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      style={{
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #f1f5f9",
        backgroundColor: notification.isRead ? "#ffffff" : "#f0fdf4",
        cursor: notification.isRead ? "default" : "pointer",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "0.75rem",
        transition: "background-color 0.15s ease",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: notification.isRead ? "#64748b" : "#0f172a",
            fontWeight: notification.isRead ? "normal" : "600",
            lineHeight: 1.4,
          }}
        >
          {notification.message}
        </p>
        {notification.createdAt && (
          <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
            {new Date(notification.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {!notification.isRead && (
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#22c55e",
            flexShrink: 0,
            marginTop: "0.35rem",
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
