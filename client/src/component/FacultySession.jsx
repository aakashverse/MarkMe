import React, { useEffect, useState } from "react";
import axios from "axios";
import useToast from "../hooks/useToast";

export default function FacultySession() {
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [isOnline, setIsOnline] = useState(false);

  const [sessionOpen, setSessionOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const {showSuccess, showError} = useToast();

   /* check session */
  useEffect(() => {
    if (currentSession?.startTime) {
      const start = new Date(currentSession.startTime).getTime();
      const now = Date.now();
      setSeconds(Math.floor((now - start) / 1000));
    }
  }, [currentSession]);

  // reset 
  useEffect(() => {
    setSubject("");
  }, [year, branch]);

  const checkActiveSession = async() => {
    try{
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/faculty/activeSession", {
        headers: {Authorization: `Bearer ${token}`}
      });

      if(res.data.hasActiveSession){
        setSessionOpen(true);
        setCurrentSession(res.data);
      }
    } catch(err){
      console.log('No Active Session!', err);
    } finally{
      setSessionOpen(false);
    }
  }

   
  // timer
  useEffect(() => {
    let interval;
    if (sessionOpen) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [sessionOpen]);

  /* start session */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !branch) {
      showError("Please select Year and Branch");
      return;
    }

    if (year === "3rd Year" && branch === "CSE" && !subject) {
      showError("Please select subject");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/faculty/openSession",
        { year, branch, subject, mode: isOnline ? "online" : "offline" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCurrentSession(res.data.session);
      setSessionOpen(true);
      showSuccess('Session initiated!')
      setSeconds(0);
    } catch (err) {
      showError("Failed to open session");
      console.log("session error: ", err.message);
    }
  };

  /* close sessn */
  const closeSession = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        "http://localhost:5000/faculty/closeSession",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionOpen(false);
      showSuccess('Session closed!')
      setSeconds(0);

    } catch (err) {
      showError("Failed to close session");
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

        {/* mode */}
        <div className="d-flex justify-content-center mb-4">
          <div
            className={`p-2 px-4 rounded-pill fw-bold ${
              isOnline ? "bg-success text-white" : "bg-danger text-white"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => !sessionOpen && setIsOnline(!isOnline)}
          >
            {isOnline ? "🟢 Online Mode" : "🔴 Offline Mode"}
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* year */}
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

          {/* branch */}
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

          {/* temporary subject/stream data */}
          {year === "3rd Year" && branch === "CSE" && (
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Subject</label>
              <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">Choose...</option>
                <option>Data Structures & Algorithms</option>
                <option>Operating System</option>
                <option>DBMS</option>
                <option>Computer Networks</option>
                <option>OOPS</option>
              </select>
            </div>
          )} 

          {/* session timer */}
          {sessionOpen && (
            <div className="text-center mt-4">
              <h3>{formatTime(seconds)}</h3>
              <p className="text-muted">Session running...</p>
            </div>
          )}

          <div className="d-flex justify-content-center mt-3">
            {!sessionOpen ? (
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Open Session
              </button>
            ) : (
              <button type="button" className="btn btn-danger" onClick={closeSession}>
                Close Session
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
