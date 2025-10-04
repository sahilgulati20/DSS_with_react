import React, { useEffect, useRef, useState } from "react";
import cloudImg from "../images/cloud.png"; 
import soilhealthImg from "../images/soilhealth.png";
import time_plantImg from "../images/time_plant.png";
import crop_priceImg from "../images/crop_price.png";
import fire_alertImg from "../images/fire_alert.png";
import call_botImg from "../images/call_bot.png";

const features = [
  {
    title: "Real-time Weather Forecast & Alerts",
    desc: "We provide accurate, real-time weather forecasts, along with alerts for adverse weather conditions to help farmers make informed decisions.",
    img: cloudImg, // replace with your icon
  },
  {
    title: "Soil Health Monitoring",
    desc: "With the help of sensors, we monitor soil quality and provide actionable insights to improve crop health and yield.",
    img: soilhealthImg, // replace with your icon
  },
  {
    title: "Crop Price Tracking & Alerts",
    desc: "We provide real-time tracking of crop prices, including alerts for price fluctuations, to help you decide the best time to buy or sell crops.",
    img: crop_priceImg, // replace with your icon
  },
  {
    title: "Best Time to Plant Seeds",
    desc: "Based on weather and soil health conditions, we advise on the optimal time to plant seeds for the best crop yield.",
    img: time_plantImg, // replace with your icon
  },
  {
    title: "Fire Alert with Emergency Call",
    desc: "Our fire alert system detects fires, sends instant alerts, and contacts emergency services automatically—no SIM card required—for swift assistance.",
    img: fire_alertImg, // replace with your icon
  },
  {
    title: "Multilingual Call Bot",
    desc: "Our AI-powered call bot can speak many languages and assist with all your farming-related issues and queries.",
    img: call_botImg, // replace with your icon
  },
];

const WhatWeDo = () => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollSpeed = 1; // Adjust speed as needed

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;

    const scroll = () => {
      if (!isHovered) {
        scrollContainer.scrollLeft += scrollSpeed;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -352 : 352, // card width (320px) + gap (32px)
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="what-we-do"
      className="relative flex flex-col justify-center items-center text-center text-gray-900 overflow-hidden bg-slate-50 py-24 px-6"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Inter:wght@400;500;700&display=swap');
        
        .font-lora { font-family: 'Lora', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }

        .feature-card {
          position: relative;
          overflow: hidden; /* Important for the pseudo-element */
          background-color: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(192, 132, 252, 0.25); /* purple shadow */
        }
        
        /* Gradient Hover Effect */
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle, rgba(233, 213, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: 1;
        }

        .feature-card:hover::before {
            opacity: 1;
        }
        
        .card-content {
            position: relative;
            z-index: 2; /* Ensures content is above the gradient */
        }
        
        .feature-card .card-title {
            transition: color 0.3s ease;
        }

        .feature-card:hover .card-title {
            color: #8b5cf6; /* A nice purple color */
        }


      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <h2 className="text-6xl font-extrabold mb-4 text-purple-800 font-lora">
          What We Do..!!
        </h2>
        <p className="text-lg text-slate-600 mb-16 max-w-3xl mx-auto font-inter">
          Our integrated platform provides a suite of tools to enhance every aspect of modern farming, from planting to harvest.
        </p>

        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={scrollRef}
            className="flex space-x-8 overflow-x-hidden w-full pb-4"
          >
            {[...features, ...features].map((item, index) => (
              <div
                key={index}
                className="feature-card min-w-[320px] border border-slate-200 rounded-3xl p-8 shadow-md flex flex-col items-center"
              >
                <div className="card-content w-full">
                    <img src={item.img} alt={item.title} className="w-20 h-20 mb-6 mx-auto" />
                    <h3 className="card-title text-2xl font-bold text-blue-800 mb-4 font-inter">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg font-inter">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Manual Controls */}
          <div className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button
                onClick={() => handleScroll("left")}
                className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-xl hover:bg-white transition flex items-center justify-center"
              >
                ◀
              </button>
          </div>
          <div className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
                onClick={() => handleScroll("right")}
                className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-xl hover:bg-white transition flex items-center justify-center"
              >
                ▶
              </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;

