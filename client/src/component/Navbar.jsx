import { Link, useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";

export default function Navbar() {
  const { showSuccess } = useToast();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    showSuccess("Logged out successfuly!");
    navigate("/"); // cleaner than reload
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 text-dark" to="/">
          Mark_Me
        </Link>

        {/* toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-3 text-center text-lg-start">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">
                Home
              </Link>
            </li>

            {/* show attendance report to everyone */}
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/teacher-dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/about">
                About
              </Link>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row gap-2 align-items-stretch align-items-lg-center mt-3 mt-lg-0">
            {token && (
              <Link
                to="/student-login"
                className="btn btn-outline-primary w-100 w-lg-auto"
              >
                Mark Att.
              </Link>
            )}

            {/* jaroori -> token tracks teacher avail. not student */}

            {/* if faculty logged in */}
            {token && (
              <>
                <Link
                  to="/student-registration"
                  className="btn btn-dark w-100 w-lg-auto"
                >
                  Register Student
                </Link>

                <Link
                  to="/faculty-session"
                  className="btn btn-outline-success w-100 w-lg-auto"
                >
                  Faculty Session
                </Link>

                <button
                  className="btn btn-danger w-100 w-lg-auto"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            {!token && (
              <>
                <Link
                  to="/faculty-login"
                  className="btn btn-success w-100 w-lg-auto"
                >
                  Faculty Signup / Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
