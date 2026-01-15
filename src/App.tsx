import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { Queue } from './pages/Queue';
import { Admin } from './pages/Admin';

function App() {
  return (
    <div className="text-slate-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;