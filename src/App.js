import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KPI from "./pages/KPI";
import Layout from "./layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/KPI"
          element={
            <Layout>
              <KPI />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
