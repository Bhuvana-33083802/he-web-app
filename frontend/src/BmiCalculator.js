// src/BmiCalculator.js
import React, { useState } from "react";
import axios from "axios";
import BenchmarkChart from "./BenchmarkChart";

function BmiCalculator() {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedBmi, setDecryptedBmi] = useState(null);

  const API_BASE =
    "https://he-backend-b8fsftgseseqdbch.ukwest-01.azurewebsites.net";

  // Helper: Determine BMI category
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi <= 24.9) return "Normal weight";
    if (bmi <= 29.9) return "Overweight";
    if (bmi <= 34.9) return "Obesity (Class 1)";
    if (bmi <= 39.9) return "Obesity (Class 2)";
    return "Extreme Obesity";
  };

  // Helper: Emoji for category
  const getBmiEmoji = (bmi) => {
    if (bmi < 18.5) return "😟";
    if (bmi <= 24.9) return "😃";
    if (bmi <= 29.9) return "😐";
    if (bmi <= 34.9) return "😟";
    if (bmi <= 39.9) return "😟";
    return "😨";
  };

  // Helper: Color for category background
  const getCategoryColor = (bmi) => {
    if (bmi < 18.5) return "#FFDD57"; // Yellow
    if (bmi <= 24.9) return "#A8E6CF"; // Green
    if (bmi <= 29.9) return "#FFD3B6"; // Orange
    if (bmi <= 39.9) return "#FF8B94"; // Light Red
    return "#FF5E57"; // Bright Red
  };

  const handleEncryptBMI = async () => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/encrypt_bmi`,
        { weight: parseInt(weight), height: parseInt(height) },
        { headers: { "Content-Type": "application/json" } }
      );
      setEncryptedData(response.data);
      setDecryptedBmi(null);
    } catch (error) {
      console.error("BMI Encryption error:", error);
    }
  };

  const handleDecryptBMI = async () => {
    if (!encryptedData) {
      alert("No encrypted BMI data found! Please encrypt first.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE}/api/decrypt_bmi`,
        {
          encrypted_weight: encryptedData.encrypted_weight,
          encrypted_height: encryptedData.encrypted_height,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const bmi = response.data.decrypted_bmi;
      const category = getBmiCategory(bmi);
      // Save record
      await axios.post(`${API_BASE}/api/save_bmi`, {
        name: name || "Anonymous",
        weight: parseInt(weight),
        height: parseInt(height),
        bmi,
        category,
      });
      setDecryptedBmi(bmi);
    } catch (error) {
      console.error("BMI Decryption error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Homomorphic Encryption BMI Calculation</h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: "10px", padding: "10px" }}
      />

      <input
        type="number"
        placeholder="Enter weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        style={{ margin: "10px", padding: "10px" }}
      />

      <input
        type="number"
        placeholder="Enter height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        style={{ margin: "10px", padding: "10px" }}
      />

      <div>
        <button
          onClick={handleEncryptBMI}
          style={{ margin: "10px", padding: "10px" }}
        >
          Encrypt and Compute BMI
        </button>
        <button
          onClick={handleDecryptBMI}
          style={{ margin: "10px", padding: "10px" }}
        >
          Decrypt BMI
        </button>
      </div>

      {encryptedData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Encrypted Data</h2>
          <p>
            <strong>Encrypted Weight:</strong> {encryptedData.encrypted_weight}
          </p>
          <p>
            <strong>Encrypted Height:</strong> {encryptedData.encrypted_height}
          </p>
        </div>
      )}

      {decryptedBmi !== null && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: getCategoryColor(decryptedBmi),
            borderRadius: "10px",
            display: "inline-block",
          }}
        >
          <h2>Decrypted BMI Result {getBmiEmoji(decryptedBmi)}</h2>
          <p>
            <strong>BMI:</strong> {decryptedBmi}
          </p>
          <p>
            <strong>Category:</strong> {getBmiCategory(decryptedBmi)}
          </p>
        </div>
      )}

      <BenchmarkChart />
    </div>
  );
}

export default BmiCalculator;
