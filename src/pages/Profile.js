import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    //Use mock data for example
    fullName: "Alif Hafiz bin Danish",
    email: "alif@gmail.com",
    role: "Manager",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(null);
  const roleBadgeClass =
    user.role === "Manager" ? "bg-primary" : "bg-secondary";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((currentUser) => ({ ...currentUser, [name]: value }));
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      window.alert("Account deactivated");
      navigate("/");
    }
  };

  const getBtnStyle = (type) => {
    const isHovered = hoverBtn === type;
    let bgColor = "transparent";
    let iconColor = "#6c757d";

    if (isHovered) {
      if (type === "delete") {
        bgColor = "rgba(220, 53, 69, 0.2)";
        iconColor = "#dc3545";
      } else if (type === "edit") {
        bgColor = "rgba(13, 110, 253, 0.2)";
        iconColor = "#0d6efd";
      }
    }

    return {
      background: bgColor,
      border: "none",
      transition: "all 0.2s ease-in-out",
      borderRadius: "4px",
      padding: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: iconColor,
    };
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "var(--body-bg)" }}
    >
      <Row>
        <Col md={12}>
          <Card
            className="card-peach position-relative"
            style={{ width: "24rem" }}
          >
            <div
              className="position-absolute top-0 end-0 m-3 d-flex align-items-center gap-2"
              style={{ zIndex: 10 }}
            >
              <button
                type="button"
                onClick={toggleEditing}
                title={isEditing ? "Close" : "Edit profile"}
                onMouseEnter={() => setHoverBtn("edit")}
                onMouseLeave={() => setHoverBtn(null)}
                style={getBtnStyle("edit")}
              >
                {isEditing ? (
                  <span
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      padding: "0 4px",
                    }}
                  >
                    X
                  </span>
                ) : (
                  <img
                    src="/settings.png"
                    alt="Edit"
                    style={{
                      width: "20px",
                      height: "20px",
                      filter:
                        hoverBtn === "edit"
                          ? "invert(37%) sepia(93%) saturate(1469%) hue-rotate(202deg) brightness(97%) contrast(105%)"
                          : "none",
                    }}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                title="Delete account"
                onMouseEnter={() => setHoverBtn("delete")}
                onMouseLeave={() => setHoverBtn(null)}
                style={getBtnStyle("delete")}
              >
                <img
                  src="/delete.png"
                  alt="Delete"
                  style={{
                    width: "20px",
                    height: "20px",
                    filter:
                      hoverBtn === "delete"
                        ? "invert(15%) sepia(95%) saturate(6932%) hue-rotate(354deg) brightness(92%) contrast(93%)"
                        : "none",
                  }}
                />
              </button>
            </div>

            <Card.Body className="text-center p-4 pt-5">
              <img
                src="/profile_picture.png"
                alt="Profile"
                className="rounded-circle mb-3 d-block mx-auto shadow-sm"
                width="120"
                height="120"
              />

              <Card.Title
                className="text-center mb-4"
                style={{
                  color: "var(--peach-dark)",
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                }}
              >
                User Profile
              </Card.Title>

              <Form.Group className="mb-3 text-start">
                <Form.Label style={{ color: "var(--text-dark)" }}>
                  Full Name
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    autoFocus
                    style={{ borderColor: "var(--border)" }}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.fullName}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3 text-start">
                <Form.Label style={{ color: "var(--text-dark)" }}>
                  Email
                </Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    style={{ borderColor: "var(--border)" }}
                  />
                ) : (
                  <p className="text-muted mb-0">{user.email}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-4 text-start">
                <Form.Label style={{ color: "var(--text-dark)" }}>
                  Role
                </Form.Label>
                {isEditing ? (
                  <Form.Select
                    name="role"
                    value={user.role}
                    onChange={handleChange}
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                  </Form.Select>
                ) : (
                  <div>
                    <span className={`badge ${roleBadgeClass} px-3 py-2`}>
                      {user.role}
                    </span>
                  </div>
                )}
              </Form.Group>

              {isEditing && (
                <Button
                  type="button"
                  variant="primary"
                  className="w-100"
                  onClick={toggleEditing}
                >
                  Save Changes
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
