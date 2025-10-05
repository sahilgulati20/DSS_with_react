// src/App.jsx
import React from "react";
import Home from "./sections/Home";
import About from "./sections/About";
import Services from "./sections/Our_service";
import Contactus from "./sections/contactus";

function App() {
  return (
    <div>
      <Home />
      <About />
      <Services />
      <Contactus />
    </div>
  );
}

export default App;
