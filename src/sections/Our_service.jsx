import React, { useState, useEffect, useRef } from 'react';
import service_weather from "../images/service_weather.png";
import service_soilhealth from "../images/service_soilhealth.png";
import service_cropprices from "../images/service_cropprices.png";
import service_plantseed from "../images/service_plantseed.png";
import service_fire from "../images/service_fire.png";
import service_callbot from "../images/service_callbot.jpg";

const services = [
  {
    title: "Real-time Weather",
    description: "The system provides updates of the surrounding weather and it offers real-time monitoring of the room’s temperature and humidity, ensuring users stay informed about both external and internal environmental conditions.",
    imageUrl: service_weather
  },
  {
    title: "Soil Health Monitoring",
    description: "The system uses sensors to analyze soil and recommend fertilizers or necessary nutrient adjustments. It also provides precise fertilizer application guidelines, such as the exact quantity required for different setups for example, recommendations for a 10 liter pot ensuring optimal plant growth while minimizing waste.",
    imageUrl: service_soilhealth
  },
  {
    title: "Crop Price Tracking",
    description: "Provides real-time average crop prices to help users to plan their sales effectively.",
    imageUrl: service_cropprices
  },
  {
    title: "Planting Guidance",
    description: "System suggests the best time to plant seeds by analyzing weather and soil conditions. It helps the user to make better decisions.",
    imageUrl: service_plantseed
  },
  {
    title: "Fire Alert System",
    description: "The system detects fire risks in farming areas and automatically calls the user and the nearest fire station. It also provides the precise fire location on a dedicated website.",
    imageUrl: service_fire
  },
  {
    title: "Your call buddy",
    description: "An AI-powered call bot that can speak multiple languages and assist with all your farming-related issues and queries.",
    imageUrl: service_callbot
  }
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="our-services" className="bg-[#9a7b4f] text-white py-24 px-6 font-inter">
      <style>{`
        .font-lora { font-family: 'Lora', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .service-text-container {
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
      `}</style>

      {/* Section Header */}
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-5xl font-extrabold font-lora text-white">Our Services !!</h2>
        <p className="text-lg text-slate-300 mt-4 max-w-3xl mx-auto">
          Empowering Farmers with Real-Time Insights for Sustainable and Profitable Agriculture.
        </p>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-16">
        {/* Left Column: Sticky Image */}
        <div className="w-full md:w-1/2 h-[60vh] md:sticky top-24">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#9a7b4f]">
            {services.map((service, index) => (
              <img
                key={service.title}
                src={service.imageUrl}
                alt={service.title}
                className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-700 ease-in-out ${
                  index === activeServiceIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            {/* Optional: Soft gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#9a7b4f]/30 to-transparent"></div>
          </div>
        </div>

        {/* Right Column: Scrolling Text */}
        <div className="w-full md:w-1/2">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="min-h-screen flex flex-col justify-center"
            >
              <div
                className={`service-text-container ${
                  index === activeServiceIndex ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-8'
                }`}
              >
                <h3 className="text-4xl font-bold font-lora text-amber-300 mb-4">{service.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{service.description}</p>
                <button className="mt-6 bg-red-500 text-white font-bold py-3 px-8 rounded-full hover:bg-red-600 transition-transform transform hover:scale-105 duration-300">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
