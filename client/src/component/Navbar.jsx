import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // cleaner than reload
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold fs-4 text-dark" to="/">
          Mark_Me
        </Link>

        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-3">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">Home</Link>
            </li>

             {/* show attendance report to everyone */}
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/teacher-dashboard">
                  Dashboard
                </Link>
              </li>


            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/about">About</Link>
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="d-flex gap-2 align-items-center">

            {/* STUDENT */}
            <Link to="/student-login" className="btn btn-outline-primary">
              Student
            </Link>

            {/* if logged in */}
            {token && (
              <>
                <Link to="/student-registration" className="btn btn-dark">
                  Register Student
                </Link>

                <Link to="/faculty-session" className="btn btn-outline-success">
                  Faculty Session
                </Link>

                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}

            {!token && (
              <>
                <Link to="/Faculty-Login" className="btn btn-success">
                  Faculty Login
                </Link>
                <Link to="/Faculty-Registration" className="btn btn-secondary">
                  Faculty Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
