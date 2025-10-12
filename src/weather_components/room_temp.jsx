import React, { useState, useEffect } from 'react';

// Helper component for the animated gauge
const Gauge = ({ value, label, unit, colorClass, max }) => {
    const circumference = 2 * Math.PI * 80; // 80 is the radius
    const offset = circumference - (value / max) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg className="w-52 h-52 transform -rotate-90">
                <circle cx="104" cy="104" r="80" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="20" fill="transparent" />
                <circle
                    cx="104" cy="104" r="80"
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

// Main Component for the Room Temperature page
const RoomTemp = () => {
    const [temperature, setTemperature] = useState(24.5);
    const [humidity, setHumidity] = useState(55);
    const [tempHistory, setTempHistory] = useState([24.2, 24.4, 24.3, 24.5, 24.6, 24.5]);
    const [humHistory, setHumHistory] = useState([55, 54, 56, 55.5, 55, 54.5]);

    // Simulate real-time data updates from sensors
    useEffect(() => {
        const interval = setInterval(() => {
            setTemperature(prev => {
                const newTemp = prev + (Math.random() - 0.5) * 0.2;
                return Math.max(18, Math.min(30, newTemp)); // Keep temp between 18-30
            });
            setHumidity(prev => {
                const newHum = prev + (Math.random() - 0.5) * 2;
                return Math.max(40, Math.min(70, newHum)); // Keep humidity between 40-70
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);
    
    // Update temperature history
     useEffect(() => {
        setTempHistory(prevHistory => {
            const newHistory = [...prevHistory, temperature];
            if (newHistory.length > 6) {
                return newHistory.slice(1);
            }
            return newHistory;
        });
    }, [temperature]);

    // Update humidity history
    useEffect(() => {
        setHumHistory(prevHistory => {
            const newHistory = [...prevHistory, humidity];
            if (newHistory.length > 6) {
                return newHistory.slice(1);
            }
            return newHistory;
        });
    }, [humidity]);

    const getStatus = (temp, hum) => {
        const tempStatus = temp > 26 ? "Warm" : temp < 22 ? "Cool" : "Comfortable";
        const humStatus = hum > 60 ? "High" : hum < 50 ? "Dry" : "Optimal";
        return `${tempStatus} Temperature, ${humStatus} Humidity`;
    };
    
    // Calculate SVG points for graphs
    const tempPoints = tempHistory.map((val, i) => `${i * 60},${100 - (val - 18) / 12 * 80}`).join(' ');
    const humPoints = humHistory.map((val, i) => `${i * 60},${100 - (val - 40) / 30 * 80}`).join(' ');


    return (
        <main 
            className="min-h-screen font-inter text-white flex items-center justify-center p-6 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')` }}
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
                    animation: draw-line 2s ease-out forwards;
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
                    <div className="text-lg font-semibold bg-white/10 px-4 py-2 rounded-lg mt-4 sm:mt-0">
                        {getStatus(temperature, humidity)}
                    </div>
                </header>

                {/* Main Content: Gauges and Charts */}
                <div>
                    {/* Gauges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                        <Gauge 
                            value={temperature} 
                            label="Temperature" 
                            unit="°C" 
                            colorClass="text-orange-400" 
                            max={40} 
                        />
                        <Gauge 
                            value={humidity} 
                            label="Humidity" 
                            unit="%" 
                            colorClass="text-sky-400" 
                            max={100}
                        />
                    </div>

                    {/* Trend Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Temperature History Chart */}
                        <div>
                             <h3 className="text-xl font-bold mb-4 text-center">Temperature Trend (°C)</h3>
                             <div className="glass-card rounded-2xl p-4 h-48">
                                <svg viewBox="0 0 300 100" className="w-full h-full">
                                    <polyline
                                        key={`temp-${tempPoints}`}
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
                                            <stop offset="0%" stopColor="rgba(251, 146, 60, 0.2)" />
                                            <stop offset="100%" stopColor="rgba(251, 146, 60, 1)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                             </div>
                             <div className="flex justify-between text-xs text-white/50 mt-2 px-2">
                                 <span>Earlier</span>
                                 <span>Now</span>
                             </div>
                        </div>
                        {/* Humidity History Chart */}
                        <div>
                             <h3 className="text-xl font-bold mb-4 text-center">Humidity Trend (%)</h3>
                             <div className="glass-card rounded-2xl p-4 h-48">
                                <svg viewBox="0 0 300 100" className="w-full h-full">
                                    <polyline
                                        key={`hum-${humPoints}`}
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
                                            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.2)" />
                                            <stop offset="100%" stopColor="rgba(56, 189, 248, 1)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                             </div>
                             <div className="flex justify-between text-xs text-white/50 mt-2 px-2">
                                 <span>Earlier</span>
                                 <span>Now</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default RoomTemp;

