import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    api.get("/stats").then((r) => setS(r.data)).catch(() => {
      localStorage.clear();
      nav("/login");
    });
  }, []);

  const search = (e) => {
    e.preventDefault();
    nav("/students?search=" + encodeURIComponent(q));
  };

  if (!s) return <div className="loader"><span className="spinner" />Loading...</div>;

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <form className="card row" onSubmit={search}>
        <input placeholder="Search students by name, email or ID" value={q} onChange={(e) => setQ(e.target.value)} />
        <button>Search</button>
      </form>
      <div className="cards">
        <div className="card stat"><h2>{s.total}</h2><p>Total Students</p></div>
        <div className="card stat"><h2>{s.thisWeek}</h2><p>Registered This Week</p></div>
        <div className="card stat"><h2>{s.users}</h2><p>System Users</p></div>
      </div>
      <div className="card">
        <h3>Recent Registrations</h3>
        <div className="tablewrap">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Date</th></tr></thead>
            <tbody>
              {s.recent.map((x) => (
                <tr key={x._id}>
                  <td>{x.studentId}</td>
                  <td><Link to={"/students/" + x._id}>{x.name}</Link></td>
                  <td>{x.email}</td>
                  <td>{new Date(x.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {s.recent.length === 0 && <tr><td colSpan="4">No students yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}