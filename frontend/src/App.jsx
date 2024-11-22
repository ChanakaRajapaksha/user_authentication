import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthPage from "./components/AuthPage";
import RegisterPage from "./components/RegisterPage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}
