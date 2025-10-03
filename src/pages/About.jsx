import React from 'react';

// This component displays the "What We Do" section with a scrolling marquee of service cards.
export default function WhatWeDoSection() {
    const services = [
        {
            title: "Real-time Weather Forecast & Alerts",
            description: "Accurate, real-time weather forecasts and alerts to help farmers make timely and informed decisions.",
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
            imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Soil Health Monitoring",
            description: "Utilizing advanced sensors to monitor soil quality, providing actionable insights that improve crop health.",
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072zM12 12h.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.463 8.353a8.48 8.48 0 00-1.09-1.823l-.001-.001c-.8-.999-1.8-1.7-2.7-2.1A8.499 8.499 0 0012 4a8.5 8.5 0 00-3.673.73c-.9.4-1.9 1.1-2.7 2.1l-.001.001a8.48 8.48 0 00-1.09 1.823A8.509 8.509 0 004 12c0 1.57.43 3.041 1.198 4.347.768 1.306 1.83 2.34 2.97 3.093A8.48 8.48 0 0012 20.001a8.48 8.48 0 003.832-1.561c1.14-.753 2.202-1.787 2.97-3.093C19.57 15.041 20 13.57 20 12c0-1.712-.51-3.32-1.463-4.647z" /></svg>,
            imageUrl: "https://images.unsplash.com/photo-1591854333068-2a74c6536423?q=80&w=1974&auto=format&fit=crop"
        },
        {
            title: "Crop Price Tracking",
            description: "Real-time tracking of crop prices with alerts for market fluctuations, helping you decide when to buy or sell.",
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
            imageUrl: "https://images.unsplash.com/photo-1620714223084-86c9df242d5d?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Pest & Disease Detection",
            description: "Our system uses advanced image recognition to identify pests and diseases for early crop protection.",
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            imageUrl: "https://images.unsplash.com/photo-1569048386343-85f78b05611e?q=80&w=2074&auto=format&fit=crop"
        },
        {
            title: "Irrigation Management",
            description: "Optimize water usage with our smart irrigation recommendations based on precise soil and weather data.",
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            imageUrl: "https://images.unsplash.com/photo-1525286102393-8bf9785ff738?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Yield Prediction",
            description: "Leverage our AI-powered models for accurate crop yield predictions to better plan harvesting and marketing.",
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
            imageUrl: "https://images.unsplash.com/photo-1627923352319-a14a023793b5?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    return (
        <>
            <style>{`
                /* Custom styles for the marquee */
                .marquee-container {
                    overflow: hidden;
                    position: relative;
                    -webkit-mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
                    mask-image: linear-gradient(to right, transparent, white 15%, white 85%, transparent);
                }
                .marquee-track {
                    display: flex;
                    width: fit-content;
                    animation: scroll-left 80s linear infinite;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
                
                @keyframes scroll-left {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }

                /* Font styles to match the main component */
                .font-display { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Lora', serif; }
            `}</style>
            <section id="what-we-do" className="py-24 bg-gray-50">
                <div className="container mx-auto text-center">
                    <h2 className="text-6xl font-bold mb-4 text-purple-800 font-display">What We Do..!!</h2>
                    <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">Our integrated platform provides a suite of tools to enhance every aspect of modern farming, from planting to harvest.</p>
                    <div className="marquee-container">
                        <div className="marquee-track">
                            {[...services, ...services].map((service, index) => (
                                <div key={index} className="flex-shrink-0 w-80 mx-4 group">
                                    <div 
                                        className="relative rounded-xl h-80 p-6 shadow-lg bg-cover bg-center text-white overflow-hidden flex flex-col justify-end items-start text-left
                                                   transition-all duration-500 ease-in-out transform group-hover:scale-105 group-hover:shadow-2xl"
                                        style={{ backgroundImage: `url(${service.imageUrl})` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/90"></div>
                                        <div className="relative z-10">
                                            <div className="mb-3 text-green-300 transition-transform duration-300 transform group-hover:scale-110">
                                                {service.icon}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 text-white font-display">{service.title}</h3>
                                            <p className="text-gray-200 leading-relaxed text-sm opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-32 transition-all duration-500 ease-in-out">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
