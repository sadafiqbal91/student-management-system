import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const empty = { studentId: "", name: "", email: "", phone: "", age: "", gender: "", address: "", interests: "", courses: "" };

export default function StudentForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(empty);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.get("/students/" + id).then((r) => {
        const s = r.data;
        setF({
          ...empty,
          ...s,
          age: s.age ?? "",
          interests: (s.interests || []).join(", "),
          courses: (s.courses || []).join(", "),
        });
      });
    }
  }, [id]);

  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const toArr = (t) => t.split(",").map((x) => x.trim()).filter(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!f.studentId.trim()) return setErr("Student ID is required");
    if (!f.name.trim()) return setErr("Name is required");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email");
    if (f.phone && !/^[0-9+\-\s]{7,15}$/.test(f.phone)) return setErr("Enter a valid phone number");
    if (f.age && (f.age < 3 || f.age > 100)) return setErr("Age must be between 3 and 100");

    const body = {
      studentId: f.studentId,
      name: f.name,
      email: f.email,
      phone: f.phone,
      age: f.age ? Number(f.age) : undefined,
      gender: f.gender,
      address: f.address,
      interests: toArr(f.interests),
      courses: toArr(f.courses),
    };
    setLoading(true);
    try {
      if (id) await api.put("/students/" + id, body);
      else await api.post("/students", body);
      nav("/students");
    } catch (e) {
      setErr(e.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{id ? "Edit Student" : "Add Student"}</h2>
        <form className="form" onSubmit={submit}>
          <div className="grid2">
            <input name="studentId" placeholder="Student ID" value={f.studentId} onChange={change} />
            <input name="name" placeholder="Name" value={f.name} onChange={change} />
            <input name="email" placeholder="Email" value={f.email} onChange={change} />
            <input name="phone" placeholder="Phone" value={f.phone} onChange={change} />
            <input name="age" type="number" placeholder="Age" value={f.age} onChange={change} />
            <select name="gender" value={f.gender} onChange={change}>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <input name="address" placeholder="Address" value={f.address} onChange={change} />
          <input name="interests" placeholder="Interests (comma separated)" value={f.interests} onChange={change} />
          <input name="courses" placeholder="Courses (comma separated)" value={f.courses} onChange={change} />
          {err && <div className="err">{err}</div>}
          <div className="row">
            <button disabled={loading}>
              {loading && <span className="spinner" />}
              {id ? "Update" : "Save"}
            </button>
            <button type="button" className="gray" onClick={() => nav("/students")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}