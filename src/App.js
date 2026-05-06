import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KPI from "./pages/KPI";
import KPIAssignment from "./pages/KPIAssignment";
import Profile from "./pages/Profile";
import KpiProgressStaff from "./pages/KpiProgressStaff";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="p-6">{children}</main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* Protected routes — any logged in user */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/staff-kpi" element={
            <RoleRoute allowedRole="staff">
              <Layout><KpiProgressStaff /></Layout>
            </RoleRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />

          {/* Role-restricted — Manager only */}
          <Route path="/kpi" element={
            <RoleRoute allowedRole="manager">
              <Layout><KPI /></Layout>
            </RoleRoute>
          } />
          <Route path="/kpi-assignment" element={
            <RoleRoute allowedRole="manager">
              <Layout><KPIAssignment /></Layout>
            </RoleRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;