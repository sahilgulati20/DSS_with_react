// src/App.jsx
import React from "react";
import Home from "./sections/Home";
import About from "./sections/About";
import Services from "./sections/Our_service";
import Contact from "./sections/Contact_us";

function App() {
  return (
    <div>
      <Home />
      <About />
      <Services />
      <Contact />
    </div>
  );
}

export default App;
