import React, { useState } from "react";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { FaSeedling, FaShieldAlt, FaBrain, FaHeadset } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DSSCallPage = () => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const handleStartCall = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number!");
      return;
    }

    const fullNumber = `${countryCode}${phoneNumber}`;
    try {
      const response = await fetch("https://dss-mid.onrender.com/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: fullNumber }),
      });

      if (response.ok) {
        alert(`📞 Call started to: ${fullNumber}`);
      } else {
        const err = await response.json();
        alert(`❌ Error: ${err.message || "Failed to start call"}`);
      }
    } catch (error) {
      alert("⚠️ Server not reachable!");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen text-gray-800 relative overflow-hidden"
      style={{
        backgroundImage: "url('/farmBG.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-200/60 via-green-100/80 to-white/95 backdrop-blur-sm" />

      {/* Fixed Spline (Untouched) */}
      <div className="fixed bottom-0 right-0 z-40 translate-y-1/3">
        <div
          className="h-500 w-50 sm:h-200 sm:w-70 cursor-pointer"
          onClick={() => navigate("/callbot")}
        >
          <Spline scene="https://prod.spline.design/WJV01XyGl2oYA3sF/scene.splinecode" />
        </div>
      </div>

      {/* MAIN SECTION */}
      <section className="relative z-10 text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-800 via-lime-600 to-amber-500 drop-shadow-lg"
        >
          Empower Farmers with <br /> Smart Voice Assistance
        </motion.h1>

        <p className="text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto mb-12 leading-relaxed">
          DSS Voice Agent helps farmers connect to real-time insights about soil health, market trends, and crop guidance — all through a simple phone call.
        </p>

        {/* Input Section */}
        <section className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-green-300/60">
          {/* Country Code */}
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white text-gray-800 text-md font-medium border border-green-300 focus:ring-2 focus:ring-green-400"
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+81">🇯🇵 +81</option>
          </select>

          <motion.input
            type="tel"
            inputMode="numeric"
            placeholder="📞 Enter phone number"
            value={phoneNumber}
            onChange={handleInputChange}
            whileFocus={{ scale: 1.03 }}
            className="flex-1 px-4 py-2 rounded-xl text-gray-900 text-md bg-white backdrop-blur-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
          />

          <motion.button
            onClick={handleStartCall}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-xl font-bold text-md text-white bg-gradient-to-r from-green-500 via-emerald-600 to-lime-600 shadow-md hover:shadow-xl transition"
          >
            🌾 Call Now
          </motion.button>
        </section>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 relative z-10 bg-gradient-to-b from-white via-emerald-50 to-green-100">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-green-700">
          Why Choose DSS Voice Assistant?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <FaSeedling size={40} className="text-green-600" />,
              title: "Smart Crop Insights",
              desc: "Instant voice-based recommendations for crops based on your soil and region.",
            },
            {
              icon: <FaHeadset size={40} className="text-green-600" />,
              title: "24/7 Farmer Support",
              desc: "Connect anytime for expert guidance and AI-powered assistance in your language.",
            },
            {
              icon: <FaShieldAlt size={40} className="text-green-600" />,
              title: "Reliable & Secure",
              desc: "Your information is encrypted and processed safely through our DSS system.",
            },
            {
              icon: <FaBrain size={40} className="text-green-600" />,
              title: "AI-Powered Knowledge",
              desc: "Get context-aware, multilingual responses that simplify complex data.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-green-200 hover:shadow-2xl transition transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex justify-center">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-green-800">{f.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center bg-gradient-to-r from-green-200 via-lime-100 to-amber-100 backdrop-blur-md relative z-10 border-t border-green-300/50">
        <p className="text-green-900 font-semibold tracking-wide">
          © 2025 Decision Support System for Farmers · Built with 🌱 by <span className="text-emerald-700">HYPERLOOP</span>
        </p>
      </footer>
    </div>
  );
};

export default DSSCallPage;