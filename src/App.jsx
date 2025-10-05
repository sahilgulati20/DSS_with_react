// src/App.jsx
import React from "react";
import Home from "./sections/Home";
import About from "./sections/About";
import Services from "./sections/Our_service";
import Team from "./sections/team";
import Contact from "./sections/Contact_us";
import Footer from "./sections/footer";

function App() {
  return (
    <div>
      <Home />
      <About />
      <Services />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
