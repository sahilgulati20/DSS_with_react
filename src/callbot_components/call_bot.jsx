import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- SVG Icon Components ---
// Styled with a friendly green color
const FaSeedling = () => (
  <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 0-7 7c0 2.66 1.44 5.08 3.69 6.23"></path>
    <path d="M12 2a7 7 0 0 1 7 7c0 2.66-1.44 5.08-3.69 6.23"></path>
    <path d="M12 22V10"></path>
    <path d="M5 14s2.5-3 7-3 7 3 7 3"></path>
  </svg>
);
const FaShieldAlt = () => (
  <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const FaBrain = () => (
  <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h.01"></path> <path d="M15 12h.01"></path> <path d="M10 16.5v-3.5"></path> <path d="M14 16.5v-3.5"></path> <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path> <path d="M17.8 14.2c-1.1.8-2.5 1.3-4.1 1.3-1.6 0-3-.5-4.1-1.3C8.5 13.5 7 11.9 7 10c0-1.9 1.5-3.5 3.4-3.8"></path> <path d="M13.6 6.2C15.5 6.5 17 8.1 17 10c0 1.9-1.5 3.5-3.4 3.8"></path>
  </svg>
);
const FaHeadset = () => (
  <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14v-4a8 8 0 0 1 16 0v4"></path> <path d="M19 14h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2v-4z"></path> <path d="M3 14H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2v-4z"></path> <path d="M17.5 14.5v-2.5a5.5 5.5 0 0 0-11 0v2.5"></path> <path d="M12 20.5v-3"></path> <path d="M9 17.5h6"></path>
  </svg>
);
// --- End of SVG Icon Components ---

// --- Mouse Glow Hook ---
const useMouseGlow = () => {
  const [position, setPosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
};
// --- End of Mouse Glow Hook ---

const DSSCallPage = () => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState({ message: "", type: "" });
  const glowPosition = useMouseGlow();

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const handleStartCall = async () => {
    if (!phoneNumber) {
      setCallStatus({ message: "Please enter a phone number.", type: "error" });
      return;
    }
    setCallStatus({ message: "Connecting your call...", type: "info" });
    const fullNumber = `${countryCode}${phoneNumber}`;
    try {
      const response = await fetch("https://dss-mid.onrender.com/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: fullNumber }),
      });
      if (response.ok) {
        setCallStatus({ message: `Success! Call connected to ${fullNumber}`, type: "success" });
      } else {
        const err = await response.json();
        setCallStatus({ message: `Error: ${err.message || "Failed to start call"}`, type: "error" });
      }
    } catch (error) {
      setCallStatus({ message: "Error: Could not reach the call server.", type: "error" });
      console.error(error);
    }
  };

  const features = [
    { icon: <FaSeedling />, title: "Smart Crop Insights", desc: "Real-time crop recommendations." },
    { icon: <FaHeadset />, title: "24/7 Farmer Support", desc: "AI-powered farmer assistance." },
    { icon: <FaBrain />, title: "Multi-language AI", desc: "Understands and speaks your language." },
    { icon: <FaShieldAlt />, title: "Secure & Private", desc: "Your information is always safe." },
  ];

  // Main component return
  return (
    // Replaced plain gradient with a more dynamic radial gradient for a "glowing" effect
    <div className="min-h-screen text-gray-800 font-sans bg-gradient-radial from-white via-green-50 to-blue-100 p-4 sm:p-8 overflow-hidden relative">
      
      {/* Mouse Glow Effect */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${glowPosition.x}px ${glowPosition.y}px, rgba(29, 78, 216, 0.05), transparent 80%)`,
        }}
        animate={{ x: glowPosition.x - 300, y: glowPosition.y - 300 }} // Center the glow on the cursor
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      {/* Header */}
      <header className="text-center mb-12 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // Made text darker for better contrast
          className="text-4xl sm:text-5xl font-bold text-green-900 mb-3"
        >
          Farmer Voice Assistant
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          // Made text darker for better contrast
          className="text-lg text-gray-700 max-w-2xl mx-auto"
        >
          Get instant help for your farm. Just enter your number to get a call from our AI assistant.
        </motion.p>
      </header>

      {/* Main Call-to-Action Card */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        // "Glassmorphism" effect: semi-transparent, blurred background, subtle border
        className="w-full max-w-2xl mx-auto bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 border border-white/50 relative z-10"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Start Your Call
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Country Code */}
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            // Enhanced styling for inputs
            className="w-full sm:w-auto px-4 py-3 bg-white/80 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
          </select>

          {/* Phone Input */}
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={handleInputChange}
            // Enhanced styling for inputs
            className="flex-1 w-full px-4 py-3 bg-white/80 text-gray-900 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>

        {/* Call Button */}
        <motion.button
          onClick={handleStartCall}
          whileHover={{ scale: 1.02, y: -2 }} // Lifts up on hover
          whileTap={{ scale: 0.98 }}
          // Added gradient and subtle pulse animation
          className="w-full px-6 py-4 mt-6 bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 animate-pulse-slow"
        >
          📞 Call Me Now
        </motion.button>

        {/* Call Status Message Area */}
        <AnimatePresence>
          {callStatus.message && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              // Added backdrop blur to status message as well
              className={`p-3 font-medium text-center rounded-lg ${
                callStatus.type === 'success' ? 'bg-green-100/80 text-green-900' :
                callStatus.type === 'error' ? 'bg-red-100/80 text-red-900' :
                'bg-blue-100/80 text-blue-900'
              } backdrop-blur-sm`}
            >
              {callStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Features Section */}
      <section className="mt-20 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-900">
          How We Help
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
              // Enhanced card: Glassmorphism, border, and hover effect
              className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-white/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Added a gradient to the icon background */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-gray-600 border-t border-gray-200/80 relative z-10">
        © 2025 DSS FOR Farming | Designed By 💙 HYPERLOOP
      </footer>
      
      {/* Need to add the custom animations to Tailwind config, but can't.
          So, I'll add a <style> tag for the pulse. */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% {
            opacity: 0.95;
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite;
        }
        
        /* Define the radial gradient for the body */
        body {
          background-image: radial-gradient(circle at center, var(--tw-gradient-stops));
          background-color: #f0fdf4; /* A light green fallback */
        }
      `}</style>
      {/* We need to define the gradient stops for Tailwind's bg-gradient-radial */}
      <style>{`
        .bg-gradient-radial {
          --tw-gradient-from: white;
          --tw-gradient-to: rgb(255 255 255 / 0);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
          --tw-gradient-to: #e0f2fe; /* to-blue-100 */
          --tw-gradient-stops: var(--tw-gradient-from), #fefce8, var(--tw-gradient-to); /* via-yellow-50 */
          --tw-gradient-stops: var(--tw-gradient-from), #f0fdf4, #fefce8, var(--tw-gradient-to); /* via-green-50 */
          
          background-image: radial-gradient(circle at 50% 50%, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default DSSCallPage;

