import React, { useState, useRef, useContext, useEffect } from "react";
import ServerContext from "../Context/ServerContext";
import { loadModels, detectFace, drawBoundingBox } from "../faceDetection";

export default function StudentRegistration() {
  const {
    year2,
    branch2,
    roll2,
    setYear2,
    setBranch2,
    setRoll2,
    setDescriptor,
    createStudent,
  } = useContext(ServerContext);

  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // load models
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

  // bound box
  useEffect(() => {
    if (!cameraOn || !modelsLoaded) return;

    intervalRef.current = setInterval(async () => {
      const detection = await detectFace(videoRef.current);
      drawBoundingBox(videoRef.current, canvasRef.current, detection);
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [cameraOn, modelsLoaded]);

  // register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!year2 || !branch2 || !roll2) {
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

      const descriptorArray = Array.from(detection.descriptor);

      setDescriptor(descriptorArray);
      await createStudent(descriptorArray);

      alert("Student registered successfully :)");
      setCameraOn(false);
    } catch (err) {
      console.error(err);
      alert("Registration failed :(");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "rgba(240,240,240,0.9)" }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          maxWidth: "430px",
          width: "100%",
          borderRadius: "20px",
          background: "white",
        }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">
          🧑‍🎓 Student Registration
        </h2>

        <form onSubmit={handleRegister}>
          {/* year */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Year</label>
            <select
              className="form-select shadow-sm"
              value={year2}
              onChange={(e) => setYear2(e.target.value)}
            >
              <option value="">Choose...</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          {/* branches */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Branch</label>
            <select
              className="form-select shadow-sm"
              value={branch2}
              onChange={(e) => setBranch2(e.target.value)}
            >
              <option value="">Choose...</option>
              <option>CSE</option>
              <option>IT</option>
              <option>AI/ML</option>
              <option>ECE</option>
              <option>ELE</option>
              <option>ME</option>
              <option>CE</option>
            </select>
          </div>

          {/* roll num */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Roll Number</label>
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Enter roll number"
              value={roll2}
              onChange={(e) => setRoll2(e.target.value)}
            />
          </div>

          {/* camra btn */}
          {!cameraOn && (
            <div className="d-flex justify-content-center mb-3">
              <button
                type="button"
                className="btn btn-success px-4 py-2 fw-bold shadow-sm"
                onClick={() => setCameraOn(true)}
              >
                📸 Start Video
              </button>
            </div>
          )}

          {/* video & camera access */}
          {cameraOn && (
            <div className="mb-3 text-center" style={{ position: "relative" }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              />
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
            disabled={loading}
          >
            {loading ? "🔍 Capturing Face..." : "✅ Register Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
