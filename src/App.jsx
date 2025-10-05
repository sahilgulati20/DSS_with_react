// src/App.jsx
import React from "react";
import Home from "./sections/Home";
import About from "./sections/About";
import Services from "./sections/Our_service";
import ContactUs from "./sections/contactus";

function App() {
  return (
    <div>
      <Home />
      <About />
      <Services />
      <ContactUs />
    </div>
  );
}

export default App;
