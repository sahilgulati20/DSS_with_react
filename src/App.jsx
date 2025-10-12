// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Sections
import Home from "./sections/Home";
import About from "./sections/About";
import Services from "./sections/Our_service";
import Team from "./sections/team";
import Contact from "./sections/Contact_us";
import Footer from "./sections/footer";
import Crops from "./components/Crops";
import Frame from "./components/Frame";
import SurroundingWeather from "./weather_components/surrounding_weather";

// Service detail pages (you'll create these)
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
        <Route path="/crops" element={<Crops />} />
        <Route path="/crops/frame" element={<Frame />} />

        {/* Separate pages for "Learn More" buttons */}
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/surrounding-weather" element={<SurroundingWeather />} />
        <Route path="/surrounding_weather" element={<SurroundingWeather />} />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
