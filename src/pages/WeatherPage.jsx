// src/sections/WeatherPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db, ref, onValue } from "../firebaseConfig"; // Firebase import

const WeatherPage = () => {
  const cardsRef = useRef([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // 🔹 Live Room Data from Firebase
  const [roomData, setRoomData] = useState({ temperature: 0, humidity: 0 });

  useEffect(() => {
    const roomRef = ref(db, "sensor_data");
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomData({
          temperature: data.temperature ?? 0,
          humidity: data.humidity ?? 0,
        });
      }
    });
  }, []);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // 🔹 3D Hover Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height / 2) / 25;
        const rotateY = (x - rect.width / 2) / -25;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    const handleMouseLeave = () => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      });
    };

    const container = document.querySelector(".cards-container");
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // 🔹 Fetch Live Weather
  useEffect(() => {
    if (!apiKey) {
      setError("Missing API key. Please check .env file.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );

          if (!response.ok) throw new Error("Failed to fetch weather");

          const data = await response.json();
          setWeatherData({
            location: `${data.name}, ${data.sys.country}`,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
          });
        } catch (err) {
          setError("Failed to fetch weather: " + err.message);
        }
      },
      () => setError("Unable to get device location. Please allow location access.")
    );
  }, [apiKey]);

  return (
    <section
      id="weather-module"
      className="min-h-screen font-inter py-20 px-6 flex flex-col items-center justify-center overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Inter:wght@400;500;700&display=swap');
        .font-lora { font-family: 'Lora', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }

        .light-aurora-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #f8fafc;
          background-image: linear-gradient(125deg, #e0f2fe, #f0f9ff, #f5f3ff);
          background-size: 400% 400%;
          animation: light-aurora 15s ease infinite;
          z-index: -1;
        }

        @keyframes light-aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .weather-card {
            background: white;
            border: 1px solid #e2e8f0;
            transform-style: preserve-3d;
            transition: transform 0.1s ease-out;
            position: relative;
            overflow: hidden;
        }
        
        .card-content {
            position: relative;
            z-index: 2;
            transition: color 0.5s ease;
        }

        .weather-card::before {
            content: '';
            position: absolute;
            left: 0; top: 0;
            width: 100%; height: 100%;
            border-radius: inherit;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.5s ease, transform 0.5s ease;
            z-index: 1;
        }
        
        .weather-card.weather-bg::before {
             background-image: linear-gradient(135deg, #38bdf8, #3b82f6);
        }
        
        .weather-card.room-bg::before {
             background-image: linear-gradient(135deg, #fbbf24, #f97316);
        }

        .weather-card:hover::before {
            opacity: 1;
            transform: scale(1);
        }
        
        .weather-card:hover .card-content,
        .weather-card:hover .card-content p,
        .weather-card:hover .card-content svg,
        .weather-card:hover .card-content strong {
            color: white;
        }
        .weather-card:hover .card-content .subtext {
            color: #d1d5db;
        }
      `}</style>

      <div className="light-aurora-bg"></div>

      {/* Header */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-6xl md:text-7xl font-extrabold font-lora mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400 drop-shadow-sm">
          Weather Module
        </h2>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          Real-time environmental insights for your farm and indoor environment.
        </p>
      </div>

      {/* Cards */}
      <div className="cards-container grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto z-10">
        {/* Surrounding Weather Card */}
        <Link
          to="/surrounding-weather"
          ref={(el) => (cardsRef.current[0] = el)}
          className="weather-card weather-bg group h-[480px] flex flex-col justify-between rounded-3xl p-8 cursor-pointer shadow-lg"
        >
          {error ? (
            <div className="text-center text-red-500 font-semibold">{error}</div>
          ) : !weatherData ? (
            <div className="text-center text-slate-500 font-medium">Fetching weather...</div>
          ) : (
            <>
              <div className="card-content text-slate-800 text-left">
                <h3 className="text-3xl font-bold font-lora">{weatherData.condition}</h3>
                <p className="subtext text-slate-500">{weatherData.location}</p>
              </div>
              <div className="card-content text-left text-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-7xl font-bold">{weatherData.temperature}°C</span>
                  <svg
                    className="w-20 h-20 subtext text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                  </svg>
                </div>
                <div className="text-sm space-y-2 subtext text-slate-500 border-t border-slate-200 pt-4">
                  <div className="flex justify-between">
                    <span>Feels like</span> <strong>{weatherData.feelsLike}°C</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity</span> <strong>{weatherData.humidity}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind</span> <strong>{weatherData.windSpeed} km/h</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </Link>

        {/* Room Conditions Card */}
        <Link
          to="/room-temp"
          ref={(el) => (cardsRef.current[1] = el)}
          className="weather-card room-bg group h-[480px] flex flex-col justify-between rounded-3xl p-8 cursor-pointer shadow-lg"
        >
          <div className="card-content text-slate-800 text-left">
            <h3 className="text-3xl font-bold font-lora">Room Conditions</h3>
            <p className="subtext text-slate-500">Live Sensor Data</p>
          </div>
          <div className="card-content text-slate-800">
            <div className="flex items-center justify-around text-center">
              <div className="w-1/2">
                <svg
                  className="w-16 h-16 mx-auto mb-2 subtext text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                </svg>
                <p className="text-3xl font-bold">{roomData.temperature}°C</p>
                <p className="subtext text-slate-500 mt-1">Temperature</p>
              </div>
              <div className="w-px h-24 bg-slate-200"></div>
              <div className="w-1/2">
                <svg
                  className="w-16 h-16 mx-auto mb-2 subtext text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
                <p className="text-3xl font-bold">{roomData.humidity}%</p>
                <p className="subtext text-slate-500 mt-1">Humidity</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default WeatherPage;
