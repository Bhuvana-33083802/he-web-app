// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import BmiCalculator from "./BmiCalculator";
import AllRecords from "./AllRecords";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bmi" element={<BmiCalculator />} />
        <Route path="/records" element={<AllRecords />} />
      </Routes>
    </Router>
  );
}

export default App;
