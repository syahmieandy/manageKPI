import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/validation";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Full name is required.");
    if (!validateEmail(form.email)) return setError("Enter a valid email.");
    if (!validatePassword(form.password))
      return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);
      await register(form.name, form.email, form.password, form.role);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("Email already registered.");
      else setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "var(--body-bg)" }}
    >
      <Row>
        <Col md={12}>
          <Card className="card-peach" style={{ width: "24rem" }}>
            <Card.Body>
              <Card.Title
                className="text-center mb-4"
                style={{
                  color: "var(--peach-dark)",
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                }}
              >
                Create Account
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--text-dark)" }}>
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={{ borderColor: "var(--border)" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--text-dark)" }}>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ borderColor: "var(--border)" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--text-dark)" }}>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ borderColor: "var(--border)" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "var(--text-dark)" }}>
                    Role
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span style={{ color: "var(--text-muted)" }}>
                  Already have an account?{" "}
                </span>
                <span
                  className="cursor-pointer"
                  style={{
                    color: "var(--peach-dark)",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
