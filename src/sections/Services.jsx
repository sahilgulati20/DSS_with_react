import React, { useState, useEffect, useRef } from 'react';
import service_weather from "../images/service_weather.png";

const services = [
  {
    title: "Real-time Weather",
    description: "The system provides updates of the surrounding weather and it offers real-time monitoring of the room's temperature and humidity, ensuring users stay informed about both external and internal environmental conditions.",
    imageUrl: service_weather
  },
  {
    title: "Soil Health Monitoring",
    description: "With the help of sensors, we monitor soil quality and provide actionable insights to improve crop health and yield, ensuring optimal growth conditions.",
    imageUrl: "https://images.unsplash.com/photo-1591854333068-2a74c6536423?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Crop Price Tracking",
    description: "We provide real-time tracking of crop prices, including alerts for price fluctuations, to help you decide the best time to buy or sell crops for maximum profitability.",
    imageUrl: "https://images.unsplash.com/photo-1620714223084-86c9df242d5d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Planting Guidance",
    description: "Based on weather and soil health conditions, we advise on the optimal time to plant seeds for the best crop yield and a successful harvest.",
    imageUrl: "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1974&auto=format&fit=crop"
  },
   {
    title: "Fire Alert System",
    description: "Our fire alert system detects fires, sends instant alerts, and contacts emergency services automatically—no SIM card required—for swift assistance.",
    imageUrl: "https://images.unsplash.com/photo-1561336244-1455136b8535?q=80&w=2070&auto=format&fit=crop"
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
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-5xl font-extrabold font-lora text-white">Our Services !!</h2>
        <p className="text-lg text-slate-300 mt-4 max-w-3xl mx-auto">
          Empowering Farmers with Real-Time Insights for Sustainable and Profitable Agriculture.
        </p>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-16">
        {/* Left Column: Sticky Image */}
        <div className="w-full md:w-1/2 h-[60vh] md:sticky top-24">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            {services.map((service, index) => (
              <img
                key={service.title}
                src={service.imageUrl}
                alt={service.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  index === activeServiceIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
             <div className="absolute inset-0 bg-[#9a7b4f]/50"></div>
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

