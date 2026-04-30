import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import useAuth from "../hooks/useAuth";
import { validateEmail } from "../utils/validation";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(form.email)) return setError("Enter a valid email.");
    if (!form.password) return setError("Password is required.");

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'var(--body-bg)' }}>
      <Row>
        <Col md={12}>
          <Card className="card-peach" style={{ width: '24rem' }}>
            <Card.Body>
              <Card.Title className="text-center mb-4" style={{ color: 'var(--peach-dark)', fontSize: '1.75rem', fontWeight: 'bold' }}>
                KPI System Login
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--text-dark)' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ borderColor: 'var(--border)' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--text-dark)' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ borderColor: 'var(--border)' }}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span style={{ color: 'var(--text-muted)' }}>No account? </span>
                <span 
                  className="cursor-pointer" 
                  style={{ color: 'var(--peach-dark)', cursor: 'pointer', fontWeight: '500' }}
                  onClick={() => navigate("/register")}
                >
                  Register here
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}