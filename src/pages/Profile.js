import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { deleteUserAccount, changeUserPassword } from "../services/userService";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "Alif Hafiz bin Danish",
    email: "alif@gmail.com",
    role: "Manager",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(null);
  const roleBadgeClass = user.role === "Manager" ? "bg-primary" : "bg-secondary";

  // State for Deletion Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");

  // State for Password Change Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((currentUser) => ({ ...currentUser, [name]: value }));
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  // Delete Handler
  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount(password);
      setShowDeleteModal(false);
      navigate("/"); 
    } catch (error) {
      alert("Error deleting account: " + error.message);
    }
  };

  // Change Password Handler
  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match. Please try again.");
      return;
    }
    
    try {
      await changeUserPassword(currentPassword, newPassword);
      alert("Password updated successfully.");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("Error updating password: " + error.message);
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
                onClick={() => setShowDeleteModal(true)}
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

              {/* Both buttons now conditionally render only when isEditing is true */}
              {isEditing && (
                <div className="d-grid gap-2 mt-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={toggleEditing}
                  >
                    Save Changes
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>
              )}

            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action is irreversible.</p>
          <Form.Group>
            <Form.Label>Enter password to confirm:</Form.Label>
            <Form.Control 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control 
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePasswordSubmit}>Update Password</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default Profile;