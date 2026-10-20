import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function NotificationBell() {
  const { state } = useNotifications();
  const unreadCount = state?.unreadCount ?? 0;
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleMouseDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.3rem",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.25rem",
        }}
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        🔔
      </button>

      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-2px",
            right: "-4px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            borderRadius: "9999px",
            fontSize: "0.7rem",
            fontWeight: "bold",
            padding: "2px 6px",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
