import React, { useState, useRef, useEffect } from "react";
import useToast from "../hooks/useToast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// const API = import.meta.env.VITE_API_BASE_URL;

import { loadModels, detectFace, drawBoundingBox } from "../faceDetection";

export default function StudentAttendance() {
  const navigate = useNavigate();
  const [roll, setRoll] = useState("");
  const [subject1, setSubject1] = useState("");
  // const [descriptor, setDescriptor] = useState(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const { showSuccess, showError } = useToast();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // check if session is active for atten.
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get('http://localhost:5000/student/activeSession', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('checking active session: ', res.data);

        if (res.data.hasActiveSession) {
          setActiveSessionId(res.data.sessionId);
          setSubject1(res.data.subject || "");
        } else {
          setActiveSessionId(null);
        }
      } catch (err) {
        console.log("No active session");
        setActiveSessionId(null);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5000); // poll every 10s

    return () => clearInterval(interval);
  }, []);

  // load modesls
  useEffect(() => {
    loadModels().then(() => setModelsLoaded(true));
  }, []);

  // camera
  useEffect(() => {
    let stream;
    if (cameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          showError("Camera access denied");
          setCameraOn(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraOn]);

  // face bound box
  useEffect(() => {
    if (!cameraOn || !modelsLoaded) return;

    intervalRef.current = setInterval(async () => {
      const detection = await detectFace(videoRef.current);
      drawBoundingBox(videoRef.current, canvasRef.current, detection);
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [cameraOn, modelsLoaded]);

  // capture
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roll || !subject1) {
      showError("Please fill all fields");
      return;
    }

    if (!activeSessionId) {
      showError("No active session. Ask faculty to start session first.");
      return;
    }

    if (!cameraOn) {
      showError("Start camera first");
      return;
    }

    try {
      setLoading(true);

      const detection = await detectFace(videoRef.current);

      if (!detection?.descriptor) {
        showError("No clear face detected. Try again.");
        return;
      }

      // Save descriptor
      const faceDescriptor = Array.from(detection.descriptor);

      // Send to backend
      const token = localStorage.getItem("token");
      await axios.post(
        'http://localhost:5000/student/markAttendance',
        {
          rollno: Number(roll),
          subject: subject1,
          sessionId: activeSessionId,
          descriptor: faceDescriptor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showSuccess(`Attendance marked for ${subject1}`);
      navigate("/");
      setRoll("");
      setSubject1("");
    } catch (err) {
      console.error(err.response?.data);
      showError("Attendance failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-4 px-2">
      <div className="card p-3 p-md-4 shadow w-100" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-3">🎓 Mark Your Presence</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />

          <select
            className="form-select mb-3"
            value={subject1}
            onChange={(e) => setSubject1(e.target.value)}
          >
            <option value="">Select Subject</option>
            <option>Data Structures & Algorithms</option>
            <option>Operating System</option>
            <option>DBMS</option>
            <option>Computer Networks</option>
            <option>OOPS</option>
          </select>

          {/* // cam status */}
          {!activeSessionId && (
            <div className="alert alert-warning">
              No active session. Ask faculty to start session first.
            </div>
          )}

          {!cameraOn ? (
            <button
              type="button"
              className="btn btn-success w-100 mb-2"
              onClick={() => setCameraOn(true)}
            >
              📸 Start Camera
            </button>
          ) : (
            <div style={{ position: "relative", height: "200px" }}>
              <video
                ref={videoRef}
                width="100%"
                height="200px"
                autoPlay
                muted
                playsInline // mobile fix
                style={{ borderRadius: "10px" }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  height: "200px",
                  width: "100%",
                  top: 0,
                  left: 0,
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading || !activeSessionId || !cameraOn}
          >
            {loading ? "Detecting..." : "✅ Capture Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
}
