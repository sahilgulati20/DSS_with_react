// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sections
import Home from "./sections/Home";
import About from "./sections/About";
import Services from "./sections/Our_service";
import Team from "./sections/team";
import Contact from "./sections/Contact_us";
import Footer from "./sections/footer";

// Service detail pages (you’ll create these)
import WeatherPage from "./pages/WeatherPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Main site (single-page sections) */}
        <Route
          path="/"
          element={
            <div>
              <Home />
              <About />
              <Services />
              <Team />
              <Contact />
              <Footer />
            </div>
          }
        />

        {/* Separate pages for "Learn More" buttons */}
        <Route path="/weather" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
