import React from 'react';
import { Link } from 'react-router-dom';

// --- IMPORTANT ---
// Replace "YOUR_OPENWEATHER_API_KEY" with your actual API key from OpenWeatherMap
const API_KEY = import.meta.env.VITE_SURROUNDING_OPENWEATHER_API_KEY || "demo_key_for_development";

// Icon components for the new design
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 21l-4.95-6.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const WindIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HumidityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>;
const VisibilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const FeelsLikeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /></svg>;

const WeatherIcon = ({ iconCode, ...props }) => {
    if (!iconCode) return null;
    return <img src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`} alt="weather icon" {...props} />;
};

// Main Component
class SurroundingWeather extends React.Component {
    state = {
        city: 'Meerut',
        weatherData: null,
        forecastData: null,
        loading: true,
        error: null,
        searchTerm: '',
    };

    fetchWeatherData = (query) => {
        if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY" || API_KEY === "demo_key_for_development") {
            // Provide demo data when API key is not available
            this.setState({ 
                weatherData: {
                    name: "Demo City",
                    weather: [{ description: "sunny", icon: "01d", id: 800 }],
                    main: { temp: 25, feels_like: 27, humidity: 65 },
                    wind: { speed: 3.5 },
                    visibility: 10000,
                    coord: { lat: 40.7128, lon: -74.0060 }
                },
                forecastData: {
                    list: Array.from({ length: 40 }, (_, i) => ({
                        dt: Date.now() / 1000 + i * 3600 * 3,
                        main: { temp: 20 + Math.random() * 10, temp_max: 25, temp_min: 15 },
                        weather: [{ icon: "01d", description: "clear" }]
                    }))
                },
                loading: false, 
                error: "Demo mode: Please add your OpenWeather API key for live data." 
            });
            return;
        }

        this.setState({ loading: true, error: null });

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${API_KEY}&units=metric`;

        Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
            .then(async ([weatherRes, forecastRes]) => {
                if (!weatherRes.ok) throw new Error('City not found. Please try again.');
                if (!forecastRes.ok) throw new Error('Could not fetch forecast data.');
                
                const weatherData = await weatherRes.json();
                const forecastData = await forecastRes.json();

                this.setState({ weatherData, forecastData, loading: false });
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false, weatherData: null, forecastData: null });
            });
    };

    componentDidMount() {
        this.getLocation();
    }
    
    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
                },
                () => { this.fetchWeatherData(`q=${this.state.city}`); }
            );
        } else {
            this.fetchWeatherData(`q=${this.state.city}`);
        }
    }

    handleSearch = (e) => {
        e.preventDefault();
        if (this.state.searchTerm.trim()) {
            this.fetchWeatherData(`q=${this.state.searchTerm}`);
        }
    };
    
    getBackgroundImage = (weatherId) => {
        if (!weatherId) return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef';
        const id = Math.floor(weatherId / 100);
        switch (id) {
            case 2: return 'https://img.freepik.com/free-photo/dark-sky-landscape-ominous-storm-approaching-generative-ai_188544-8647.jpg?semt=ais_hybrid&w=740&q=80'; // Thunderstorm
            case 3: return 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Frain-sprout&psig=AOvVaw242WWvXtAZYG13_4iKrxfV&ust=1760265653362000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPjBzt_6m5ADFQAAAAAdAAAAABAL'; // Drizzle
            case 5: return 'https://i.pinimg.com/1200x/65/de/a0/65dea0b295675760bbdb0527b0f41857.jpg'; // Rain
            case 6: return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56'; // Snow
            case 7: return 'https://images.unsplash.com/photo-1447879027584-c17ac7cf44a8'; // Atmosphere (haze)
            case 8: return weatherId === 800 ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' : 'https://media.wired.com/photos/65e860922a01e579ac0d29f2/3:2/w_2560%2Cc_limit/london-heatwave.jpg'; // Clear vs Clouds
            default: return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef';
        }
    };

    render() {
        const { weatherData, forecastData, loading, error, searchTerm } = this.state;

        const hourlyForecast = forecastData?.list.slice(0, 7) || [];
        const dailyForecast = forecastData?.list.filter((_, index) => index % 8 === 0).slice(0, 5) || [];
        const backgroundUrl = this.getBackgroundImage(weatherData?.weather[0].id);

        return (
            <main className="min-h-screen font-inter text-white transition-all duration-1000" style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="min-h-screen bg-black/30 backdrop-blur-lg p-4 sm:p-6 md:p-8">
                
                {/* Navigation Header */}
                <nav className="glass-card rounded-2xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Weather Dashboard</h1>
                        <Link 
                            to="/" 
                            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </nav>
                
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
                    .font-inter { font-family: 'Inter', sans-serif; }
                    .glass-card {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        transition: background 0.3s ease;
                    }
                    .glass-card:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                `}</style>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full max-w-7xl mx-auto">
                    {/* Main Content */}
                    <div className="xl:col-span-3">
                        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Weather Dashboard</h1>
                            <form onSubmit={this.handleSearch} className="flex items-center gap-2 glass-card rounded-full p-2 mt-4 sm:mt-0">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => this.setState({ searchTerm: e.target.value })}
                                    placeholder="Search for a city..."
                                    className="bg-transparent focus:outline-none px-3 w-40 sm:w-56 placeholder-white/50"
                                />
                                <button type="submit" className="bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </button>
                            </form>
                        </header>

                        {error && <div className="glass-card bg-red-500/30 border-red-500/50 px-4 py-3 rounded-2xl text-center mb-6">{error}</div>}
                        {loading && <div className="text-center py-10">Loading weather data...</div>}
                        {!loading && !error && weatherData && (
                           <div className="space-y-6">
                            <div className="glass-card rounded-3xl p-6 shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-4xl font-bold flex items-center gap-2"><MapPinIcon /> {weatherData.name}</h2>
                                        <p className="opacity-70 capitalize">{weatherData.weather[0].description}</p>
                                    </div>
                                    <WeatherIcon iconCode={weatherData.weather[0].icon} className="w-28 h-28 -mt-8 -mr-4" />
                                </div>
                                <div className="flex items-end mt-4">
                                    <span className="text-8xl font-extrabold">{Math.round(weatherData.main.temp)}</span>
                                    <span className="text-4xl font-bold">°C</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                               <div className="glass-card p-4 rounded-2xl text-center"><FeelsLikeIcon className="mx-auto mb-2 opacity-70"/><p className="text-sm opacity-70">Feels Like</p><p className="font-bold text-lg">{Math.round(weatherData.main.feels_like)}°C</p></div>
                               <div className="glass-card p-4 rounded-2xl text-center"><HumidityIcon className="mx-auto mb-2 opacity-70"/><p className="text-sm opacity-70">Humidity</p><p className="font-bold text-lg">{weatherData.main.humidity}%</p></div>
                               <div className="glass-card p-4 rounded-2xl text-center"><WindIcon className="mx-auto mb-2 opacity-70"/><p className="text-sm opacity-70">Wind Speed</p><p className="font-bold text-lg">{weatherData.wind.speed} m/s</p></div>
                               <div className="glass-card p-4 rounded-2xl text-center"><VisibilityIcon className="mx-auto mb-2 opacity-70"/><p className="text-sm opacity-70">Visibility</p><p className="font-bold text-lg">{weatherData.visibility / 1000} km</p></div>
                            </div>
                            <div className="glass-card rounded-3xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold mb-4">Hourly Forecast</h3>
                                <div className="flex justify-around items-center text-center">
                                    {hourlyForecast.map((hour) => (
                                        <div key={hour.dt} className="flex flex-col items-center">
                                            <p className="text-sm opacity-70">{new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</p>
                                            <WeatherIcon iconCode={hour.weather[0].icon} className="w-16 h-16"/>
                                            <p className="font-bold">{Math.round(hour.main.temp)}°C</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                           </div>
                        )}
                    </div>
                    
                    {/* Right Sidebar - Map and Weekly Forecast */}
                     <div className="xl:col-span-1 space-y-6">
                         {weatherData && (
                            <div className="glass-card rounded-3xl p-4 shadow-lg h-64">
                                 <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '1.25rem' }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${weatherData.coord.lon-0.5},${weatherData.coord.lat-0.5},${weatherData.coord.lon+0.5},${weatherData.coord.lat+0.5}&layer=mapnik&marker=${weatherData.coord.lat},${weatherData.coord.lon}`}>
                                </iframe>
                            </div>
                         )}
                         {!loading && !error && forecastData && (
                            <div className="glass-card rounded-3xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold mb-4">5-Day Forecast</h3>
                                <div className="space-y-3">
                                    {dailyForecast.map((day) => (
                                        <div key={day.dt} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition">
                                            <p className="font-semibold text-sm w-1/3">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                            <div className="flex items-center justify-center w-1/3">
                                                <WeatherIcon iconCode={day.weather[0].icon} className="w-10 h-10"/>
                                            </div>
                                            <p className="font-semibold text-sm w-1/3 text-right">
                                                {Math.round(day.main.temp_max)}°/{Math.round(day.main.temp_min)}°
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                     </div>
                </div>
                </div>
            </main>
        );
    }
}

export default SurroundingWeather;

