// src/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Privacy-Preserving Health Records System</h1>
      <p style={{ fontSize: "18px", maxWidth: "600px", margin: "20px auto" }}>
        A secure system that allows health data computations like BMI
        calculation using Homomorphic Encryption – without revealing your actual
        data.
      </p>
      <Link to="/bmi">
        <button style={{ padding: "10px 25px", fontSize: "16px" }}>
          Try BMI Calculator
        </button>
      </Link>

      <Link to="/records">
        <button style={{ padding: "10px 25px", marginTop: "10px" }}>
          View Saved BMI Records
        </button>
      </Link>
    </div>
  );
}

export default Home;
