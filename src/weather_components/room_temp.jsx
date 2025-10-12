// src/weather_components/RoomTemp.jsx
import React, { useState, useEffect } from "react";
import { db, ref, onValue } from "../firebaseConfig";

// Gauge component
const Gauge = ({ value, label, unit, colorClass, max }) => {
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-52 h-52 transform -rotate-90">
        <circle cx="104" cy="104" r="80" stroke="rgba(255,255,255,0.1)" strokeWidth="20" fill="transparent" />
        <circle
          cx="104"
          cy="104"
          r="80"
          stroke="currentColor"
          strokeWidth="20"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-in-out ${colorClass}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-extrabold text-white drop-shadow-lg">{value.toFixed(1)}</span>
        <span className="text-2xl font-bold text-white/80 -mt-1">{unit}</span>
      </div>
      <p className="mt-4 text-xl font-semibold text-white/90">{label}</p>
    </div>
  );
};

const RoomTemp = () => {
  const [roomData, setRoomData] = useState({ temperature: 0, humidity: 0 });
  const [tempHistory, setTempHistory] = useState([]);
  const [humHistory, setHumHistory] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  // Fetch live data from Firebase
  useEffect(() => {
    const roomRef = ref(db, "sensor_data");
    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRoomData({
            temperature: data.temperature ?? 0,
            humidity: data.humidity ?? 0,
          });
          setStatus(getStatus(data.temperature, data.humidity));
        } else {
          setStatus("Waiting for data...");
        }
      },
      (error) => {
        console.error("Firebase connection error:", error);
        setStatus("Connection Error. Check rules.");
      }
    );
    return () => unsubscribe();
  }, []);

  // Update temperature history
  useEffect(() => {
    if (roomData.temperature === 0) return;
    setTempHistory((prev) => {
      const newHistory = [...prev, roomData.temperature];
      return newHistory.length > 6 ? newHistory.slice(-6) : newHistory;
    });
  }, [roomData.temperature]);

  // Update humidity history
  useEffect(() => {
    if (roomData.humidity === 0) return;
    setHumHistory((prev) => {
      const newHistory = [...prev, roomData.humidity];
      return newHistory.length > 6 ? newHistory.slice(-6) : newHistory;
    });
  }, [roomData.humidity]);

  // Status helper
  const getStatus = (temp, hum) => {
    const tempStatus = temp > 26 ? "Warm" : temp < 22 ? "Cool" : "Comfortable";
    const humStatus = hum > 60 ? "High" : hum < 50 ? "Dry" : "Optimal";
    return `${tempStatus} Temperature, ${humStatus} Humidity`;
  };

  // Calculate dynamic points for charts
  const getPolylinePoints = (history, min, max) => {
    const step = 300 / (history.length - 1 || 1);
    return history
      .map((val, i) => {
        const y = 100 - ((val - min) / (max - min)) * 100;
        const x = i * step;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const tempPoints = getPolylinePoints(tempHistory, 18, 30);
  const humPoints = getPolylinePoints(humHistory, 40, 70);

  return (
    <main
      className="min-h-screen font-inter text-white flex items-center justify-center p-6 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 1.5s ease-out forwards;
        }
        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-5xl mx-auto glass-card rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold">Room Environment</h1>
            <p className="text-white/70">Live sensor data from the main chamber.</p>
          </div>
          <div className="text-lg font-semibold bg-white/10 px-4 py-2 rounded-lg mt-4 sm:mt-0">{status}</div>
        </header>

        {/* Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <Gauge value={roomData.temperature} label="Temperature" unit="°C" colorClass="text-orange-400" max={40} />
          <Gauge value={roomData.humidity} label="Humidity" unit="%" colorClass="text-sky-400" max={100} />
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Temperature Chart */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Temperature Trend (°C)</h3>
            <div className="glass-card rounded-2xl p-4 h-48">
              <svg viewBox="0 0 300 100" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="url(#temp-line-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={tempPoints}
                  className="chart-line"
                />
                <defs>
                  <linearGradient id="temp-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(251,146,60,0.2)" />
                    <stop offset="100%" stopColor="rgba(251,146,60,1)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Humidity Chart */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Humidity Trend (%)</h3>
            <div className="glass-card rounded-2xl p-4 h-48">
              <svg viewBox="0 0 300 100" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="url(#hum-line-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={humPoints}
                  className="chart-line"
                />
                <defs>
                  <linearGradient id="hum-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(56,189,248,0.2)" />
                    <stop offset="100%" stopColor="rgba(56,189,248,1)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoomTemp;
