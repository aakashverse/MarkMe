import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import useToast from "../hooks/useToast";
const API = import.meta.env.VITE_API_BASE_URL;

export default function FacultySession() {
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const [sessionOpen, setSessionOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  const [elapsed, setElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [warningActive, setWarningActive] = useState(false);

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const { showSuccess, showError } = useToast();

  /* reset subject */
  useEffect(() => {
    setSubject("");
  }, [year, branch]);

  /* start timer */
  const startTimers = () => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 120) setWarningActive(true);
        if (prev <= 1) {
          handleAutoClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* stop timer */
  const stopTimers = () => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
  };

  /* start session */
  const handleStart = async () => {
    if (!year || !branch) {
      showError("Please select Year & Branch");
      return;
    }

    if (year === "3rd Year" && branch === "CSE" && !subject) {
      showError("Please select subject");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/faculty/openSession`,
        { year, branch, subject, mode: isOnline ? "online" : "offline" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentSession(res.data.session);
      setSessionOpen(true);
      setElapsed(0);
      setTimeLeft(15 * 60);
      setWarningActive(false);

      startTimers();
      showSuccess("Session started (15 min)");
    } catch {
      showError("Failed to start session");
    }
  };

  /* close session */
  const handleClose = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/faculty/closeSession`,
        { sessionId: currentSession?._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } finally {
      stopTimers();
      setSessionOpen(false);
      setCurrentSession(null);
      setElapsed(0);
      setTimeLeft(15 * 60);
      setWarningActive(false);
      showSuccess("Session closed");
    }
  };

  const handleAutoClose = async () => {
    showError("⏰ Time expired. Auto-closing session");
    await handleClose();
  };

  const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
    2,
    "0"
  )}`;

  const subjectsByBranch = {
    CSE: ["DSA", "OS", "CN", "DBMS", "OOPS"],
    IT: ["DSA", "OS", "CN", "DBMS", "OOPS"],
    ECE: ["Digital Electronics", "Signals", "Communication", "VLSI"],
    Electronics: ["Analog Circuits", "Microprocessors", "Embedded Systems"],
    ME: ["Thermodynamics", "Fluid Mechanics", "Machine Design"],
    CE: ["Structural Engineering", "Geotechnical", "Transportation", "Environmental"],
  };

  return (
    <div className="container d-flex justify-content-center mt-4 mt-md-5 py-4 px-2">
      <div
        className="card p-4 shadow w-100"
        style={{ maxWidth: 420 }}
      >
        <h3 className="text-center text-primary mb-4">
          Faculty Control Panel
        </h3>

        <div className="text-center mb-3">
          <span
            className={`badge px-3 py-2 ${isOnline ? "bg-success" : "bg-danger"}`}
            style={{ cursor: sessionOpen ? "not-allowed" : "pointer" }}
            onClick={() => !sessionOpen && setIsOnline(!isOnline)}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </span>
        </div>

        <select
          disabled={sessionOpen}
          className="form-select mb-2"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          <option>3rd Year</option>
        </select>

        <select
          disabled={sessionOpen}
          className="form-select mb-2"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">Select Branch</option>
          <option>CSE</option>
          <option>IT</option>
          <option>ECE</option>
          <option>ME</option>
          <option>EL</option>
          <option>CE</option>
        </select>

        {year === "3rd Year" && subjectsByBranch[branch] && (
          <select
            disabled={sessionOpen}
            className="form-select mb-3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjectsByBranch[branch].map((sub, index) => (
              <option key={index}>{sub}</option>
            ))}
          </select>
        )}

        {sessionOpen && (
          <div className="text-center mb-3">
            <h4 className={timeLeft <= 120 ? "text-danger" : "text-primary"}>
              ⏰ {formatTime(timeLeft)}
            </h4>

            {warningActive && (
              <div className="alert alert-warning mb-0">
                ⚠️ Less than 2 minutes!
              </div>
            )}
          </div>
        )}

        {!sessionOpen ? (
          <button className="btn btn-primary w-100" onClick={handleStart}>
            🚀 START SESSION
          </button>
        ) : (
          <button className="btn btn-danger w-100" onClick={handleClose}>
            ⏹️ END SESSION
          </button>
        )}
      </div>
    </div>
  );
}
