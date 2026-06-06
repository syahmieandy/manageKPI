import { useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Container, Button } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <BSNavbar
      style={{ backgroundColor: "var(--peach-base)" }}
      className="shadow-sm"
    >
      <Container>
        <BSNavbar.Brand
          onClick={() => navigate("/dashboard")}
          style={{
            cursor: "pointer",
            color: "var(--text-dark)",
            fontWeight: "bold",
            fontSize: "1.25rem",
          }}
        >
          KPI Management
        </BSNavbar.Brand>
        {user && (
          <div className="d-flex align-items-center gap-3">
            {user.role === "manager" && (
              <>
                <Button
                  variant="light"
                  size="sm"
                  style={{ color: "var(--peach-dark)", fontWeight: "500" }}
                  onClick={() => navigate("/kpi")}
                >
                  Manage KPI
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  style={{ color: "var(--peach-dark)", fontWeight: "500" }}
                  onClick={() => navigate("/kpi-assignment")}
                >
                  KPI Assignment
                </Button>
              </>
            )}
            <span style={{ color: "var(--text-dark)", fontSize: "0.875rem" }}>
              {user.name} —{" "}
              <span
                style={{
                  backgroundColor: "var(--peach-dark)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  color: "var(--text-light)",
                }}
              >
                {user.role}
              </span>
            </span>

            <div className="position-relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <img
                  src="/bell.png"
                  alt="Notifications"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              </button>

              {/* Unread badge */}
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  {unreadCount}
                </span>
              )}

              {/* Dropdown */}
              {showNotifications && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    width: "300px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 999,
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    className="d-flex justify-content-between align-items-center px-3 py-2"
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: "var(--peach-base)",
                    }}
                  >
                    <span
                      style={{ fontWeight: "600", color: "var(--text-dark)" }}
                    >
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span
                        onClick={markAllAsRead}
                        style={{
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          color: "var(--peach-dark)",
                          fontWeight: "500",
                        }}
                      >
                        Mark all as read
                      </span>
                    )}
                  </div>

                  {/* Notification list */}
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div
                        className="text-center text-muted p-3"
                        style={{ fontSize: "0.875rem" }}
                      >
                        No notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          style={{
                            padding: "10px 16px",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: n.read ? "white" : "#fff8f5",
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "var(--text-dark)",
                            }}
                          >
                            {!n.read && (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  backgroundColor: "var(--peach-dark)",
                                  marginRight: "8px",
                                }}
                              />
                            )}
                            {n.message}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#999",
                              marginTop: "2px",
                              paddingLeft: n.read ? "0" : "16px",
                            }}
                          >
                            {n.time}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <img
              src="/profile_picture.png"
              alt="Profile"
              onClick={() => navigate("/profile")}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                objectFit: "cover",
                border: "2px solid var(--peach-dark)",
              }}
            />
            <Button
              onClick={handleLogout}
              variant="light"
              size="sm"
              style={{ color: "var(--peach-dark)", fontWeight: "500" }}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    </BSNavbar>
  );
}
