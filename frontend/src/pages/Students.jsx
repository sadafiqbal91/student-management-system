import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";

export default function Students() {
  const [sp, setSp] = useSearchParams();
  const search = sp.get("search") || "";
  const page = parseInt(sp.get("page") || "1");
  const [q, setQ] = useState(search);
  const [data, setData] = useState({ students: [], totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const load = () => {
    setLoading(true);
    api
      .get("/students", { params: { search, page, limit: 5 } })
      .then((r) => setData(r.data))
      .catch((e) => setErr(e.response?.data?.message || "Error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]);

  const doSearch = (e) => {
    e.preventDefault();
    setSp({ search: q, page: 1 });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete("/students/" + id);
      load();
    } catch (e) {
      setErr(e.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <h2>Students ({data.total})</h2>
      <form className="card row" onSubmit={doSearch}>
        <input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button>Search</button>
      </form>
      {err && <div className="err">{err}</div>}
      <div className="card">
        {loading ? (
          <div className="loader"><span className="spinner" />Loading...</div>
        ) : (
          <div className="tablewrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Courses</th><th>Actions</th></tr></thead>
              <tbody>
                {data.students.map((x) => (
                  <tr key={x._id}>
                    <td>{x.studentId}</td>
                    <td>{x.name}</td>
                    <td>{x.email}</td>
                    <td>{(x.courses || []).join(", ")}</td>
                    <td className="row">
                      <Link className="btn" to={"/students/" + x._id}>View</Link>
                      <Link className="btn" to={"/students/" + x._id + "/edit"}>Edit</Link>
                      {user.role === "admin" && (
                        <button className="red" onClick={() => remove(x._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {data.students.length === 0 && <tr><td colSpan="5">No students found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="gray" disabled={page <= 1} onClick={() => setSp({ search, page: page - 1 })}>Prev</button>
          <span>Page {data.page || page} of {data.totalPages || 1}</span>
          <button className="gray" disabled={page >= data.totalPages} onClick={() => setSp({ search, page: page + 1 })}>Next</button>
        </div>
      </div>
    </div>
  );
}