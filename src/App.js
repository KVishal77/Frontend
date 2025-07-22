import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddPlant from './pages/AddPlant';
import Search from './pages/Search';
import PlantDetail from './pages/PlantDetail';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Header />
      <div className="pt-16 pb-24"> {/* padding for fixed header/footer */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new" element={<AddPlant />} />
          <Route path="/search" element={<Search />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;