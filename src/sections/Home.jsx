import React, { useState, useEffect } from 'react';
import farm2 from "../images/farm2.png";
import { Link } from "react-router-dom";




export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [typedText, setTypedText] = useState('');
    const fullText = "DECISION SUPPORT SYSTEM";

    // Typewriter effect
    useEffect(() => {
        let currentIndex = 0;
        if (typedText.length > 0) return;

        const interval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setTypedText(fullText.substring(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 150);

        return () => clearInterval(interval);
    }, []);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-white font-body leading-normal tracking-normal">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lora:wght@400;500&display=swap');

                .font-display { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Lora', serif; }

                .typewriter-cursor {
                    display: inline-block;
                    background-color: white;
                    width: 4px;
                    height: 1em;
                    animation: blink 1s infinite;
                    margin-left: 8px;
                    vertical-align: bottom;
                    border-radius: 2px;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }

                .fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hero-title { animation-delay: 0.5s; }
                .hero-p { animation-delay: 0.8s; }
                .hero-btn { animation-delay: 1.1s; }
            `}</style>

            {/* Header */}
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
                    isScrolled ? 'bg-white/80 shadow-lg backdrop-blur-sm' : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto flex items-center justify-between p-4">
                    <a href="#" className={`flex items-center space-x-3 transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                        <img src="logo.png" alt="Project DSS Logo" className="w-10 h-10 object-contain"/>
                    </a>
                    <nav>
                        <ul className="flex space-x-6">
                            {['Home', 'About', 'Services', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a 
                                        href={`#${item.toLowerCase()}`} 
                                        className={`text-base font-medium transition-colors duration-300 relative group ${
                                            isScrolled ? 'text-gray-600 hover:text-green-600' : 'text-gray-200 hover:text-white'
                                        }`}
                                    >
                                        <span>{item}</span>
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>



            {/* Hero Section */}
            <section 
                id="home"
                className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: `url(${farm2})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-white px-6">
                    <h1 className="text-5xl md:text-5xl font-extrabold tracking-wider uppercase font-display fade-in-up hero-title">
                        {typedText}
                        <span className="typewriter-cursor"></span>
                    </h1>
                    <p className="text-sm md:text-base mt-4 max-w-4xl mx-auto fade-in-up hero-p">
                        Empowering Farmers with Real-Time Insights for Sustainable and Profitable Agriculture.
                    </p>
                    <a href="#about" className="mt-8 inline-block bg-green-900 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 duration-300 fade-in-up hero-btn">
                        Explore More
                    </a>
                </div>
            </section>
        </div>
    );
}
