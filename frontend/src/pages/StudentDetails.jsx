import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function StudentDetails() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/students/" + id).then((r) => setS(r.data)).catch(() => setErr("Student not found"));
  }, [id]);

  if (err) return <div className="container"><div className="err">{err}</div></div>;
  if (!s) return <div className="loader"><span className="spinner" />Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2>{s.name}</h2>
        <p><b>Student ID:</b> {s.studentId}</p>
        <p><b>Email:</b> {s.email}</p>
        <p><b>Phone:</b> {s.phone || "-"}</p>
        <p><b>Age:</b> {s.age || "-"}</p>
        <p><b>Gender:</b> {s.gender || "-"}</p>
        <p><b>Address:</b> {s.address || "-"}</p>
        <p><b>Interests:</b> {(s.interests || []).join(", ") || "-"}</p>
        <p><b>Courses:</b> {(s.courses || []).join(", ") || "-"}</p>
        <p><b>Registered:</b> {new Date(s.createdAt).toLocaleString()}</p>
        <div className="row">
          <Link className="btn" to={"/students/" + s._id + "/edit"}>Edit</Link>
          <Link className="btn" to="/students">Back</Link>
        </div>
      </div>
    </div>
  );
}