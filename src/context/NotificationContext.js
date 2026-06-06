import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.role === "manager") {
      setNotifications([
        {
          id: 1,
          message: "Ahmad Faris submitted KPI: Revenue Growth",
          read: false,
          time: "2 mins ago",
        },
        {
          id: 2,
          message: "Nur Izzati submitted KPI: Website Traffic",
          read: false,
          time: "1 hour ago",
        },
        {
          id: 3,
          message: "KPI deadline approaching: Customer Retention",
          read: true,
          time: "2 hours ago",
        },
      ]);
    } else if (user?.role === "staff") {
      setNotifications([
        {
          id: 1,
          message: "You have been assigned: Revenue Growth",
          read: false,
          time: "2 mins ago",
        },
        {
          id: 2,
          message: "Your KPI submission has been approved",
          read: false,
          time: "1 hour ago",
        },
        {
          id: 3,
          message: "You have been assigned: Website Traffic",
          read: true,
          time: "2 hours ago",
        },
      ]);
    }
  }, [user]);

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function addNotification(message) {
    setNotifications((prev) => [
      { id: Date.now(), message, read: false, time: "Just now" },
      ...prev,
    ]);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
