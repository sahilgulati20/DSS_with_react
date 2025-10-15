import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Images
import service_weather from "../images/service_weather.png";
import service_soilhealth from "../images/service_soilhealth.png";
import service_cropprices from "../images/service_cropprices.png";
import service_plantseed from "../images/service_plantseed.png";
import service_fire from "../images/service_fire.png";
import service_callbot from "../images/service_callbot.jpg";

const services = [
  {
    title: "Real-time Weather",
    description:
      "The system provides updates of the surrounding weather and offers real-time monitoring of temperature and humidity, keeping users informed about both external and internal environmental conditions.",
    imageUrl: service_weather,
    link: "/weather",
  },
  {
    title: "Soil Health Monitoring",
    description:
      "The system uses sensors to analyze soil and recommend fertilizers or nutrient adjustments. It also provides precise guidelines for fertilizer application, ensuring optimal growth and minimal waste.",
    imageUrl: service_soilhealth,
    link: "/soil-health",
  },
  {
    title: "Crop Price Tracking",
    description:
      "Provides real-time average crop prices to help farmers plan their sales effectively and make informed market decisions.",
    imageUrl: service_cropprices,
    link: "/crops",
  },
  {
    title: "Planting Guidance",
    description:
      "Analyzes weather and soil conditions to suggest the best time to plant seeds, helping users make smarter cultivation decisions.",
    imageUrl: service_plantseed,
    link: "/plant-seed",
  },
  {
    title: "Fire Alert System",
    description:
      "Detects fire risks in farming areas and automatically alerts users and nearby fire stations. It also provides the exact fire location on a dedicated website.",
    imageUrl: service_fire,
    link: "/fire-alert",
  },
  {
    title: "Your Call Buddy",
    description:
      "An AI-powered multilingual call bot that assists with all farming-related queries and issues in your preferred language.",
    imageUrl: service_callbot,
    link: "/call-bot",
  },
];

const OurServices = () => {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const serviceRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentService = 0;
      serviceRefs.current.forEach((ref, index) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          currentService = index;
        }
      });
      setActiveServiceIndex(currentService);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="our-services"
      className="bg-[#9a7b4f] text-white py-16 md:py-24 px-4 sm:px-6 md:px-12 font-inter"
    >
      <style>{`
        .font-lora { font-family: 'Lora', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .service-text-container {
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
      `}</style>

      {/* Header */}
      <div className="container mx-auto text-center mb-10 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-lora text-white">
          Our Services !!
        </h2>
        <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-3xl mx-auto">
          Empowering Farmers with Real-Time Insights for Sustainable and
          Profitable Agriculture.
        </p>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left Column (Sticky Image) */}
        <div className="w-full md:w-1/2 md:h-[70vh] sticky top-24">
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-full rounded-2xl overflow-hidden bg-[#9a7b4f]">
            {services.map((service, index) => (
              <img
                key={service.title}
                src={service.imageUrl}
                alt={service.title}
                className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-700 ease-in-out ${
                  index === activeServiceIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#9a7b4f]/30 to-transparent"></div>
          </div>
        </div>

        {/* Right Column (Scrollable Text) */}
        <div className="w-full md:w-1/2">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="min-h-[70vh] flex flex-col justify-center"
            >
              <div
                className={`service-text-container ${
                  index === activeServiceIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-20 translate-y-8"
                }`}
              >
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-lora text-amber-300 mb-4">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
                  {service.description}
                </p>

                {/* ✅ Learn More button only if link exists */}
                {service.link && (
                  <Link to={service.link} className="inline-block mt-6">
                    <button className="bg-red-500 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-red-600 transition-transform transform hover:scale-105 duration-300 text-sm sm:text-base cursor-pointer">
                      Learn More
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
