import React from 'react'
import Navbar from './Navbar'

function Home() {
   const features = [
     {
       icon: "🎥",
       title: "Face Detection Ready",
       desc: "Integrated camera placeholder with future-proof hooks for detection.",
     },
     {
       icon: "⏳",
       title: "Session Controls",
       desc: "Open/Close session with live timer for accountability.",
     },
     {
       icon: "📱",
       title: "Responsive & Modern",
       desc: "Clean Bootstrap layout that works beautifully on all devices.",
     },
     {
       icon: "🔐",
       title: "Secure & Private",
       desc: "Designed with privacy in mind; no data leaves your browser unless you choose.",
     },
  ];
  
  return (
    <>
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#43557dff", minHeight: "100vh" }}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT SIDE TEXT */}
            <div className="col-md-6 mb-4">
              <span className="badge bg-secondary px-3 py-2 mb-3">
                Next-gen Attendance
              </span>

              <h1 className="fw-bold display-5 text-light">
                Smart, secure, and effortless <br /> attendance
              </h1>

              <p className=" my-3 text-light">
                Use camera-based face detection and one-click sessions to manage
                classes with ease. Built for speed, privacy, and accuracy.
              </p>
            </div>

            {/* RIGHT SIDE IMAGE IN ROUNDED CARD */}
            <div className="col-md-6">
              <div
                style={{
                  width: "80%",
                  height: "310px",
                  backgroundColor: "white",
                  borderRadius: "25px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "10px",
                  overflow: "hidden",
                }}
              >
                <img
                  src="https://kivtas.com/wp-content/uploads/2021/06/AI-face-biometric-attendance-system.png"
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container py-5" style={{ backgroundColor: "#f7f9fc" }}>
          {/* Heading */}
          <div className="text-center mb-5">
            <h4 className="fw-bold">Features</h4>
            <p className="text-muted" style={{ fontSize: "1.1rem" }}>
              Everything you need to manage classes smoothly.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="row g-4">
            {features.map((item, index) => (
              <div className="col-md-3" key={index}>
                <div
                  className="p-4 bg-white shadow-sm rounded"
                  style={{ borderRadius: "15px", minHeight: "180px" }}
                >
                  <div className="fs-1 mb-3">{item.icon}</div>
                  <h5 className="fw-semibold">{item.title}</h5>
                  <p className="text-muted mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home
