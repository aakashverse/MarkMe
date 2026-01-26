import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import useToast from "../hooks/useToast";

function FacultyLogin() {
  const navigate = useNavigate();

  const [facultyId, setFacultyId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {showSuccess, showError} = useToast();

  const handleLogIn = async (e) => {
    e.preventDefault();

    if (!facultyId || !password) {
      showError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/login",
        { facultyId, password },
        { withCredentials: true }
      );

      // store token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("facultyId", res.data.facultyId);

      showSuccess("Login successful");
      navigate("/Faculty-Dashboard");

    } catch (error) {
      showError(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-5">
      <form
        className="d-flex justify-content-center align-items-center"
        onSubmit={handleLogIn}
      >
        <div className="col-12 col-lg-6 col-md-8 col-sm-12 border rounded-3 p-3"
          style={{ backgroundColor: "whitesmoke" }}
        >
          <h4 className="text-center mb-3">Faculty Login</h4>

          <div className="mb-3">
            <label className="form-label">Faculty ID</label>
            <input
              className="form-control"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={16}
            />
          </div>

          <button className="btn btn-success w-100" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-center mt-3">
            New faculty? <Link to="/Faculty-Registration">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default FacultyLogin;
