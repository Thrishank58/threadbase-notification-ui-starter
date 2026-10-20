import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const { notifications, unreadCount } = state;

  const handleMarkAllRead = () => {
    dispatch({ type: "MARK_ALL_READ" });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        width: "320px",
        maxHeight: "420px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </span>
        <button
          onClick={handleMarkAllRead}
          style={{
            background: "none",
            border: "none",
            color: "#6366f1",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          Mark all as read
        </button>
      </div>

      <div style={{ overflowY: "auto", maxHeight: "360px" }}>
        {notifications.length === 0 ? (
          <div style={{ padding: "1.5rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
}
