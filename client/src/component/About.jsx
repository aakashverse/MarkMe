import React from "react";

export default function AboutUs() {
  return (
    <section className="py-5" style={{ background: "#f0f6ff" }}>
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 text-primary">About Mark_Me</h2>
          <p className="text-muted fs-5">
            Smart. Fast. Secure — A modern attendance system powered by Face
            Recognition.
          </p>
        </div>

        <div className="row align-items-center g-4">
          {/* Left Content */}
          <div className="col-md-6">
            <div className="p-4 bg-white shadow rounded-4 border">
              <h4 className="fw-bold text-primary mb-3">What is Mark_Me?</h4>
              <p className="text-muted">
                Mark_Me lets students mark attendance directly from their mobile
                phones using <strong>AI-powered Face Recognition</strong>. It
                ensures full accuracy and eliminates manual roll calls and proxy
                attendance.
              </p>

              <h5 className="fw-bold text-primary mt-4">How It Works</h5>
              <ul className="text-muted small">
                <li>
                  The teacher starts a <strong>live session</strong> for a class
                  period.
                </li>
                <li>
                  The session remains open only for a limited allowed duration.
                </li>
                <li>Students scan their face using their phone camera.</li>
                <li>
                  If face matches & session is active, attendance is marked
                  instantly.
                </li>
                <li>
                  After closing the session, attendance can't be submitted.
                </li>
              </ul>

              <h5 className="fw-bold text-primary mt-4">Why Face Scan?</h5>
              <p className="text-muted">
                Face scanning ensures secure, fair, and fast attendance. It
                removes proxy issues, saves teacher time, and keeps complete
                attendance logs digitally.
              </p>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="col-md-6">
            <div className="text-center p-4 bg-white shadow rounded-4 border">
              <img
                src="https://kivtas.com/wp-content/uploads/2021/06/AI-face-biometric-attendance-system.png"
                alt="Face Scan"
                className="img-fluid mb-4"
                style={{ maxWidth: "60%" }}
              />
              <h5 className="fw-bold text-primary">AI Attendance System</h5>
              <p className="text-muted">
                Simple for students. Powerful for teachers. Attendance made
                smart with AI.
              </p>
            </div>
          </div>
        </div>

        {/* Highlight Features */}
        <div className="row mt-5 text-center">
          <div className="col-md-4">
            <div className="p-4 bg-white shadow-sm rounded-4">
              <i className="bi bi-camera fs-1 text-primary"></i>
              <h6 className="fw-bold mt-3">Face Recognition</h6>
              <p className="text-muted small">
                AI verifies student identity instantly.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white shadow-sm rounded-4">
              <i className="bi bi-clock fs-1 text-primary"></i>
              <h6 className="fw-bold mt-3">Live Timed Session</h6>
              <p className="text-muted small">
                Attendance only allowed during active session.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white shadow-sm rounded-4">
              <i className="bi bi-shield-check fs-1 text-primary"></i>
              <h6 className="fw-bold mt-3">Proxy Free</h6>
              <p className="text-muted small">
                Identity verification prevents fake attendance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
