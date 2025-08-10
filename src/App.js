import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPlant from "./pages/AddPlant";
import Search from "./pages/Search";
import About from "./pages/About";
import SinglePlant from "./pages/SinglePlant";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ already added

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 Public Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected Pages (need login) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <Layout>
                <AddPlant />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Layout>
                <Search />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <Layout>
                <About />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plant/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SinglePlant />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ Redirect default / to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;