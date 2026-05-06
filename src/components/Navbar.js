import { useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Container, Button } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <BSNavbar style={{ backgroundColor: 'var(--peach-base)' }} className="shadow-sm">
      <Container>
        <BSNavbar.Brand 
          onClick={() => navigate("/dashboard")} 
          style={{ cursor: 'pointer', color: 'var(--text-dark)', fontWeight: 'bold', fontSize: '1.25rem' }}
        >
          KPI Management
        </BSNavbar.Brand>
        {user && (
          <div className="d-flex align-items-center gap-3">
            {user.role === "manager" && (
              <>
                <Button variant="light" size="sm" style={{ color: 'var(--peach-dark)', fontWeight: '500' }} onClick={() => navigate("/kpi")}>
                  Manage KPI
                </Button>
                <Button variant="light" size="sm" style={{ color: 'var(--peach-dark)', fontWeight: '500' }} onClick={() => navigate("/kpi-assignment")}>
                  KPI Assignment
                </Button>
              </>
            )}
            <span style={{ color: 'var(--text-dark)', fontSize: '0.875rem' }}>
              {user.name} —{" "}
              <span style={{ 
                backgroundColor: 'var(--peach-dark)', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '0.75rem',
                color: 'var(--text-light)'
              }}>
                {user.role}
              </span>
            </span>
            <Button 
              onClick={handleLogout}
              variant="light"
              size="sm"
              style={{ color: 'var(--peach-dark)', fontWeight: '500' }}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    </BSNavbar>
  );
}