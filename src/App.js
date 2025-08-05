import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddPlant from "./pages/AddPlant";
import Search from "./pages/Search";
import About from "./pages/About";
import SinglePlant from "./pages/SinglePlant";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages without layout (like login/signup) */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Pages with layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/new"
          element={
            <Layout>
              <AddPlant />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/plant/:id"
          element={
            <Layout>
              <SinglePlant />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;