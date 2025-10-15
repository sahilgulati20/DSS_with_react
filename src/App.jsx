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
import RoomTemp from "./weather_components/room_temp";
import SoilHealth from "./soilhealth_components/soil_health";
import PlantTime from "./components/PlantRec.jsx";
import FireAlert from "./fire_components/fire_alert.jsx"; // ✅ Fixed: Capitalized import
import CallBot from "./callbot_components/call_bot.jsx";

// Service detail pages
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
        <Route path="/room-temp" element={<RoomTemp />} />
        <Route path="/plant-seed" element={<PlantTime />} />
        <Route path="/soil-health" element={<SoilHealth />} />

        {/* ✅ Fixed route: Component name starts with uppercase */}
        <Route path="/fire-alert" element={<FireAlert />} />

        <Route path="/call-bot" element={<CallBot />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
