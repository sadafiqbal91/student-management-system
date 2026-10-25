import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import StudentDetails from "./pages/StudentDetails";

function Private({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

function Nav() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return null;
  const logout = () => {
    localStorage.clear();
    nav("/login");
  };
  return (
    <nav className="nav">
      <b>Student System</b>
      <Link to="/">Dashboard</Link>
      <Link to="/students">Students</Link>
      <Link to="/students/new">Add Student</Link>
      <span className="sp" />
      <span>{user.name} ({user.role})</span>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/" element={<Private><Dashboard /></Private>} />
        <Route path="/students" element={<Private><Students /></Private>} />
        <Route path="/students/new" element={<Private><StudentForm /></Private>} />
        <Route path="/students/:id" element={<Private><StudentDetails /></Private>} />
        <Route path="/students/:id/edit" element={<Private><StudentForm /></Private>} />
      </Routes>
    </BrowserRouter>
  );
}