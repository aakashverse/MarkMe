import { Link, useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";

export default function Navbar() {
  const { showSuccess } = useToast();
  const token = localStorage.getItem("token");
  const studentToken = localStorage.getItem("studentToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    showSuccess("Logged out successfuly!");
    navigate("/");   // clean than reload
  };

  const closeNavbar = () => {
    const nav = document.getElementById("navbarNav");
    if (nav?.classList.contains("show")) {
      nav.classList.remove("show");
    }
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
              <Link onClick={closeNavbar} className="nav-link fw-semibold" to="/">
                Home
              </Link>
            </li>

            {/* show attendance report to everyone */}
            <li className="nav-item">
              <Link onClick={closeNavbar} className="nav-link fw-semibold" to="/teacher-dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link onClick={closeNavbar} className="nav-link fw-semibold" to="/about">
                About
              </Link>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-center mt-3 mt-lg-0">
            {studentToken && (
              <Link
                onClick={closeNavbar}
                to="/student-attendance"
                className="btn btn-outline-primary w-100 w-lg-auto"
              >
                Mark Attendance
              </Link>
            )}

            {/* jaroori -> token tracks teacher avail. not student */}

            {/* if faculty logged in */}
            {!studentToken && (
              <>
                <Link
                  onClick={closeNavbar}
                  to="/student-login"
                  className="btn btn-dark w-100 w-lg-auto"
                >
                  Student Signup /Login
                </Link>
              </>
            )}

             {token && (
              <>
              <Link
                  onClick={closeNavbar}
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
                  onClick={closeNavbar}
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
