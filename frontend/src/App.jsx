import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import AuthPage from "./components/AuthPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";

import AdminDashboard from "./pages/AdminDashboard";
import DoctorHome from "./pages/DoctorHome";

import Unauthorized from "./components/Unauthorized";
import Layout from "./components/Layout";
import PrivateRoute from "./utility/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />

        {/* Use PrivateRoute for protected routes */}
        <Route path="/" element={<Layout />}>
          {/* Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin', 'doctor']} />}>
            <Route path="/doctor" element={<DoctorHome />} />
          </Route>

          {/* Catch unauthorized access */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>

      <ToastContainer />
    </Router>
  );
}
