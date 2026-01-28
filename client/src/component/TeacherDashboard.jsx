import React, { useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import useToast from "../hooks/useToast";
const API = import.meta.env.VITE_API_BASE_URL;

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
      const res = await axios.post(`${API}/faculty/studentAttendance`,
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
  <div className="container-fluid mt-4 px-2 px-md-5 overflow-hidden">
    <h2 className="text-center mb-4">Attendance Dashboard</h2>

    <div className="row my-4 justify-content-center g-2">
      <div className="col-12 col-md-4">
        <input
          type="text"
          className="form-control"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="e.g., 23207"
        />
      </div>

      <div className="col-12 col-md-2">
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
<div className="d-none d-md-block">
  <div className="table-responsive w-100">
    <table className="table table-bordered table-striped mb-0">
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
            <td>{student.year || "N/A"}</td>
            <td>{student.branch || "N/A"}</td>
            <td>
              {presentCount}/{totalClasses}{" "}
              <span className="text-danger">({absent} absent)</span>
            </td>
            <td>
              <span className="badge bg-info ms-2">
                {totalClasses > 0
                  ? Math.round((presentCount / totalClasses) * 100)
                  : 0}
                %
              </span>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

{/* Student Info - Compact */}
<div className="d-block d-md-none">
  {!student ? (
    <div className="border rounded-2 p-2 text-center text-muted bg-light">
      Enter roll number to check attendance
    </div>
  ) : (
    <div className="border rounded-2 overflow-hidden bg-light">
      <div className="text-center fw-bold py-2 border-bottom">
        Student Attendance
      </div>

      <table className="table table-bordered m-0">
        <tbody>
          <tr>
            <td className="fw-semibold p-2 w-50">Roll No</td>
            <td className="p-2 w-50">{student.rollno}</td>
          </tr>
          <tr>
            <td className="fw-semibold p-2">Year</td>
            <td className="p-2">{student.year || "N/A"}</td>
          </tr>
          <tr>
            <td className="fw-semibold p-2">Branch</td>
            <td className="p-2">{student.branch || "N/A"}</td>
          </tr>
          <tr>
            <td className="fw-semibold p-2">Attendance</td>
            <td className="p-2">
              {presentCount}/{totalClasses}{" "}
              <span className="text-danger">({absent} absent)</span>
            </td>
          </tr>
          <tr>
            <td className="fw-semibold p-2">% Attendance</td>
            <td className="p-2">
              <span className="badge bg-info">
                {totalClasses > 0
                  ? Math.round((presentCount / totalClasses) * 100)
                  : 0}
                %
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )}
</div>



    {student && subjectAttendance.length > 0 && (
      <div className="mt-4 row g-4">
        <div className="col-12 col-lg-8">
          <h5 className="text-center mb-3">📚 Subject-wise Attendance</h5>

          <div className="chartBoxBar p-2 p-md-4" style={{ background:"#f8f9fa", borderRadius:"8px", width:"100%" }}>
            <Bar
              key={JSON.stringify(barData)}
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 100,
                animation: {
                  duration: 1200,
                  easing: "easeOutQuart",
                  delay: (context) => context.dataIndex * 100
                },
                plugins: { legend: { position: "top" } },
                scales: {
                  x: { ticks: { autoSkip: true, maxRotation: 45, minRotation: 0 } },
                  y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
              }}
            />
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <h5 className="text-center mb-3">📊 Overall Attendance</h5>

          <div className="chartBoxPie p-2 p-md-4" style={{ background:"#f8f9fa", borderRadius:"8px", width:"100%" }}>
            <Pie
              key={JSON.stringify(pieData)}
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 100,
                animation: {
                  animateRotate: true,
                  animateScale: true,
                  duration: 1800,
                  easing: "easeInOutQuart",
                  delay: 150
                },
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { boxWidth: 12, padding: 12 }
                  }
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
