// src/BenchmarkChart.js
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BenchmarkChart() {
  const [chartData, setChartData] = useState([]);
  const [showChart, setShowChart] = useState(false);

  const handleRunBenchmark = () => {
    const simulatedData = [
      { name: "Step 1", performance: 320 },
      { name: "Step 2", performance: 400 },
      { name: "Step 3", performance: 300 },
      { name: "Step 4", performance: 450 },
    ];
    setChartData(simulatedData);
    setShowChart(true);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <button
        onClick={handleRunBenchmark}
        style={{
          backgroundColor: "#7E57C2",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📊 Run Benchmark
      </button>

      {showChart && chartData.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Benchmark Results</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="performance" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
