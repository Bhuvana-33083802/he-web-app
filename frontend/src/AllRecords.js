// src/AllRecords.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function AllRecords() {
  const [records, setRecords] = useState([]);

  const API_BASE =
    "https://he-backend-b8fsftgseseqdbch.ukwest-01.azurewebsites.net";

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/bmi_records`);
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>All Saved BMI Records</h1>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table
          style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Weight</th>
              <th style={thStyle}>Height</th>
              <th style={thStyle}>BMI</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, index) => (
              <tr key={index}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdStyle}>{r.weight}</td>
                <td style={tdStyle}>{r.height}</td>
                <td style={tdStyle}>{r.bmi}</td>
                <td style={tdStyle}>{r.category}</td>
                <td style={tdStyle}>{r.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f0f0f0",
};
const tdStyle = { border: "1px solid #ccc", padding: "10px" };

export default AllRecords;
