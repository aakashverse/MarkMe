import React, { useState } from "react";
import axios from "axios";
import useToast from "../hooks/useToast";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function StudentLogin() {
  const [rollno, setRollno] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!rollno || !password) return showError("Missing Credentials!");

    try {
      setLoading(true);
      const res = await axios.post(`${API}/student/login`, {
        rollno: Number(rollno),
        password: password,
      });

      localStorage.setItem("studentToken", res.data.token);
      localStorage.setItem("studentRollno", res.data.student.rollno);

      showSuccess("Student logged in!");
      navigate("/student-attendance");
    } catch (err) {
      showError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: 420 }}>
        <h3 className="text-center mb-3">🎓 Student Login</h3>

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            placeholder="Enter Roll Number"
            value={rollno}
            onChange={(e) => setRollno(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-3">
                New Student? <Link to="/Student-Registration">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
