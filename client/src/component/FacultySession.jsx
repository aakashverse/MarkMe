import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FacultySession() {
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const [sessionOpen, setSessionOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);

  /* TIMER */
  useEffect(() => {
    let timer;
    if (sessionOpen) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionOpen]);

  /* OPEN SESSION */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !branch) {
      alert("Please select Year and Branch");
      return;
    }

    if (year === "3rd Year" && branch === "CSE" && !subject) {
      alert("Please select subject");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/openSession",
        { year, branch, subject, mode: isOnline ? "online" : "offline" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionOpen(true);
      setSeconds(0);

    } catch (err) {
      alert("Failed to open session");
    }
  };

  /* CLOSE SESSION */
  const closeSession = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/closeSession",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionOpen(false);
      setSeconds(0);

    } catch (err) {
      alert("Failed to close session");
    }
  };

  const formatTime = (time) => {
    const hr = String(Math.floor(time / 3600)).padStart(2, "0");
    const min = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    return `${hr}:${min}:${sec}`;
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4 border-0" style={{ maxWidth: "430px", width: "100%", borderRadius: "20px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">
          Faculty Control Panel
        </h2>

        {/* MODE TOGGLE */}
        <div className="d-flex justify-content-center mb-4">
          <div
            className={`p-2 px-4 rounded-pill fw-bold ${
              isOnline ? "bg-success text-white" : "bg-danger text-white"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? "🟢 Online Mode" : "🔴 Offline Mode"}
          </div>
        </div>

        <form>
          {/* YEAR */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Year</label>
            <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Choose...</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          {/* BRANCH */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Branch</label>
            <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
              <option value="">Choose...</option>
              <option>CSE</option>
              <option>IT</option>
              <option>AI/ML</option>
              <option>ECE</option>
              <option>ME</option>
            </select>
          </div>

          {/* SUBJECT (ONLY WHEN REQUIRED) */}
          {year === "3rd Year" && branch === "CSE" && (
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Subject</label>
              <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">Choose...</option>
                <option>Data Structures</option>
                <option>Operating Systems</option>
                <option>DBMS</option>
                <option>Computer Networks</option>
                <option>Software Engineering</option>
              </select>
            </div>
          )}

          {/* TIMER */}
          {sessionOpen && (
            <div className="text-center mt-4">
              <h3>{formatTime(seconds)}</h3>
              <p className="text-muted">Session running...</p>
            </div>
          )}

          {/* BUTTON */}
          <div className="d-flex justify-content-center mt-3">
            {!sessionOpen ? (
              <button className="btn btn-primary" onClick={handleSubmit}>
                Open Session
              </button>
            ) : (
              <button className="btn btn-danger" onClick={closeSession}>
                Close Session
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
