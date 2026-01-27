import React, { useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import useToast from "../hooks/useToast";


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function TeacherDashboard(){
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const {showError, showSuccess} = useToast();

  const fetchByRollNumber = async () => {
    if (!rollNumber.trim()) {
      showError("Enter roll number");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/faculty/studentAttendance",
        {rollno: rollNumber.trim()},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log("Response:", res.data);
      setStudent(res.data);
      showSuccess("Student data loaded!");
    } catch (err) {
      // console.error("Error:", err.response?.data || err.message);
      showError("Student not found");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  // attendance calculatn.
  const subjectAttendance = Array.isArray(student?.attendance) ? student.attendance : [];
  const totalClasses = subjectAttendance.reduce((sum, s) => sum + (s?.total || 0), 0);
  const presentCount = subjectAttendance.reduce((sum, s) => sum + (s?.present || 0), 0);
  const absent = totalClasses - presentCount;
  console.log("Absent count: ", absent);

  // console.log("Stats:", { totalClasses, presentCount, absent, subjects: subjectAttendance });

  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [{
      data: [presentCount, absent],
      backgroundColor: ["#28a745", "#dc3545"],
    }],
  };

  const barData = {
    labels: subjectAttendance.map(s => s.subject),
    datasets: [
      {
        label: "Present",
        data: subjectAttendance.map(s => s.present || 0),
        backgroundColor: "#0d6efd",
      },
      {
        label: "Total Classes",
        data: subjectAttendance.map(s => s.total || 0),
        backgroundColor: "#6c757d",
      }
    ],
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Attendance Dashboard</h2>

      <div className="row my-4 justify-content-center">
        <div className="col-md-4">
          {/* <label className="form-label fw-semibold">Roll Number</label> */}
          <input
            type="text"
            className="form-control"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="e.g., 23207"
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button
            className="btn btn-success w-100"
            onClick={fetchByRollNumber}
            disabled={loading}
          >
            {loading ? "🔄 Loading..." : "📋 Check"}
          </button>
        </div>
      </div>

      {/* Student Info Table */}
      <div className="table-responsive mb-4">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Roll No</th>
              <th>Year</th>
              <th>Branch</th>
              <th>Attendance</th>
              <th>%age Attendance</th>
            </tr>
          </thead>
          <tbody>
            {!student ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  Enter roll number to check attendance
                </td>
              </tr>
            ) : (
              <tr>
                <td><strong>{student.rollno}</strong></td>
                <td>{student.year || 'N/A'}</td>
                <td>{student.branch || 'N/A'}</td>
                <td>{presentCount}/{totalClasses} <span className="text-danger">({absent} absent)</span></td>
                <td>
                  {/* <strong>{presentCount}/{totalClasses}</strong> */}
                  <span className="badge bg-info ms-2">
                    {totalClasses > 0 ? Math.round((presentCount/totalClasses)*100) : 0}%
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      {student && subjectAttendance.length > 0 && (
        <div className="row g-4">
          <div className="col-lg-8 ">
            <h5 className="text-center mb-3">📚 Subject-wise Attendance</h5>
            <div style={{ height: '400px', background: '#f8f9fa', borderRadius: '8px', padding: '20px' }}>
              <Bar
                key={JSON.stringify(barData)}   // 🔥 forces re-animation on data change
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1200,
                    easing: "easeOutQuart",
                    delay: (context) => context.dataIndex * 100
                  },
                  plugins: {
                    legend: { position: "top" }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="col-lg-4">
            <h5 className="text-center mb-3">📊 Overall Attendance</h5>
            <div style={{ height: '300px', background: '#f8f9fa', borderRadius: '8px', padding: '20px' }}>
              <Pie
                key={JSON.stringify(pieData)}   // 🔥 re-animate on search
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 900,
                    easing: "easeOutQuart"
                  },
                  plugins: {
                    legend: { position: "bottom" }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
