import React, { useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TeacherDashboard = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchByRollNumber = async () => {
    if (!rollNumber) {
      alert("Enter roll number");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/dashboard", {
        rollno: rollNumber,
      });

      setStudent(res.data.data);
    } catch (err) {
      console.error(err);
      alert("No data found");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  // Attendance logic
  const totalClasses = 100; // adjust acc.ordingly
  const present = student?.attendance || 0;
  const absent = totalClasses - present;

  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ["#28a745", "#dc3545"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">📊 Teacher Dashboard</h2>

      {/* search */}
      <div className="row my-4 justify-content-center">
        <div className="col-md-3">
          <label className="fw-semibold">Roll Number</label>
          <input
            type="text"
            className="form-control"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          className="btn btn-outline-success"
          onClick={fetchByRollNumber}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Check Attendance"}
        </button>
      </div>

      {/* table */}
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Roll No</th>
              <th>Year</th>
              <th>Branch</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {!student ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No data
                </td>
              </tr>
            ) : (
              <tr>
                <td>{student.rollno}</td>
                <td>{student.year}</td>
                <td>{student.branch}</td>
                <td>{student.attendance}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* shwing pie chart */}
      {student && (
        <div className="mt-5 text-center">
          <h4>Attendance Overview</h4>
          <div style={{ width: "300px", margin: "0 auto" }}>
            <Pie data={pieData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
