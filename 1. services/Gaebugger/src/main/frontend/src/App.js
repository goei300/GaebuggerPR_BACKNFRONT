import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Service from './pages/Services/Service';
import Guidelines from './pages/Guideline/Guidelines';
import StartIndex from './pages/Start/StartIndex';
import Contact from './pages/Contact/Contact';
function App() {
  return (
      <Router>
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services*" element={<Service />} />
                <Route path="/start*" element={<StartIndex />} />
              
                <Route path="/guidelines" element={<Guidelines />} />
            </Routes>

        </div>
      </Router>
  );
}

export default App;