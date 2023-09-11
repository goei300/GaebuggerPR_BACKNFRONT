import React, { useState, useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Service from './pages/Services/Service';
import About from './pages/About/About';
function App() {
/*    const [message, setMessage] = useState([]);
    useEffect(() => {
        fetch("/hello")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setMessage(data);
            });
    }, []);*/
  return (
      <Router>
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services/*" element={<Service />} />
                <Route path="/about" element={<About />} />

            </Routes>

        </div>
      </Router>
  );
}

export default App;