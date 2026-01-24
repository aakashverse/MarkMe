import React, { useState, useRef, useContext, useEffect } from "react";
import ServerContext from "../Context/ServerContext";

import {
  loadModels,
  detectFace,
  drawBoundingBox,
} from "../faceDetection";

export default function StudentAttendance() {
  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    roll,
    subject1,
    setRoll,
    setSubject1,
    setDescriptor,
    sendFaceDescriptor,
  } = useContext(ServerContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // load modesls
  useEffect(() => {
    loadModels().then(() => setModelsLoaded(true));
  }, []);

  // camera
  useEffect(() => {
    let stream;

    async function startCamera() {
      if (cameraOn) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    }

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
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
      alert("Please fill all fields");
      return;
    }

    if (!cameraOn) {
      alert("Start camera first");
      return;
    }

    try {
      setLoading(true);

      const detection = await detectFace(videoRef.current);

      if (!detection || !detection.descriptor) {
        alert("No clear face detected. Try again.");
        return;
      }

      // Save descriptor 
      setDescriptor(Array.from(detection.descriptor));

      // Send to backend
      await sendFaceDescriptor();

      alert("Attendance marked successfully!");
    } catch (err) {
      console.error(err);
      alert("Face capture failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <div className="card p-4 shadow" style={{ width: 400 }}>
        <h3 className="text-center mb-3">🎓 Smart Attendance</h3>

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
            <option>DSA</option>
            <option>OS</option>
            <option>DBMS</option>
            <option>CN</option>
          </select>

          {!cameraOn && (
            <button
              type="button"
              className="btn btn-success w-100 mb-2"
              onClick={() => setCameraOn(true)}
            >
              📸 Start Camera
            </button>
          )}

          {cameraOn && (
            <div style={{ position: "relative" }}>
              <video ref={videoRef} width="100%" autoPlay muted />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Detecting..." : "✅ Capture Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
}
