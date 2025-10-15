import React, { useState, useEffect, useCallback } from 'react';
// Standardizing all Firebase imports to CDN URLs for the single-file React environment
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken 
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { 
    getDatabase, 
    ref, 
    onValue 
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js'; 

// --- Environment Variables & Constants ---

const firebaseConfig = {
    apiKey            : import.meta.env.VITE_FIREBASE_API_KEY,               //        "
    authDomain        : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,            //        "ndom",
    databaseURL       : import.meta.env.VITE_FIREBASE_DATABASE_URL,            //        "app",
    projectId         : import.meta.env.VITE_FIREBASE_PROJECT_ID,               //        "te72e76",
    storageBucket     : import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,          //        "temcom",
    messagingSenderId : import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ,     //         "59611",
    appId             : import.meta.env.VITE_FIREBASE_APP_ID ,                  //        "1:5595de",
    measurementId     : import.meta.env.VITE_FIREBASE_MEASUREMENT_ID         //        "G0Q"
};

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;


// --- Utility Hooks & Functions ---

const useFirebase = () => {
    const [rtdb, setRtdb] = useState(null); 
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        if (!firebaseConfig.projectId) {
            console.error("Firebase configuration missing or invalid.");
            setIsAuthReady(true);
            return;
        }
        try {
            const app = initializeApp(firebaseConfig);
            const realTimeDb = getDatabase(app);
            const authentication = getAuth(app);

            const setupAuth = async () => {
                let user;
                try {
                    if (initialAuthToken) {
                        const uc = await signInWithCustomToken(authentication, initialAuthToken);
                        user = uc.user;
                    } else {
                        const uc = await signInAnonymously(authentication);
                        user = uc.user;
                    }
                } catch (error) {
                    console.error("Auth error, falling back to anonymous:", error);
                    const uc = await signInAnonymously(authentication);
                    user = uc.user;
                }
                setUserId(user?.uid || crypto.randomUUID());
                setRtdb(realTimeDb);
                setIsAuthReady(true);
            };

            setupAuth();
        } catch (error) {
            console.error("Firebase init failed:", error);
            setIsAuthReady(true);
        }
    }, []);

    return { rtdb, userId, isAuthReady };
};

const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    try {
        const resp = await fetch(url, {
            headers: { 'User-Agent': 'CropAssistantApp/1.0' }
        });
        if (!resp.ok) {
            console.error("Reverse geocode failed:", resp.statusText);
            return null;
        }
        const data = await resp.json();
        const addr = data.address;
        if (addr) {
            return addr.city || addr.town || addr.village || addr.county || data.display_name.split(',')[0] || null;
        }
        return null;
    } catch (e) {
        console.error("Error reverse geocode:", e);
        return null;
    }
};

const fetchOpenWeatherData = async (lat, lon) => {
    if (!OPEN_WEATHER_API_KEY) {
        console.warn("OpenWeather API key missing, returning mock data.");
        return {
            air_temp: (30 + Math.random() * 5).toFixed(1),
            air_humidity: (60 + Math.random() * 10).toFixed(1)
        };
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            console.error("OpenWeather fetch failed:", resp.statusText);
            throw new Error("Weather API bad response");
        }
        const data = await resp.json();
        return {
            air_temp: data.main.temp.toFixed(1),
            air_humidity: data.main.humidity.toFixed(1)
        };
    } catch (e) {
        console.error("Error fetching weather:", e);
        return null;
    }
};

const DESIRED_JSON_STRUCTURE = {
    condition_summary: "A summary of the soil condition and why.",
    suitable_crops: ["Crop 1 Name", "Crop 2 Name"],
    improvement_materials: [
        { material: "Material 1 Name", purpose: "Reason" },
        { material: "Material 2 Name", purpose: "Reason" }
    ]
};

const callGeminiAPI = async (n, p, k, ph, moisture, soilTemp, airTemp, airHumidity, city) => {
  const modelName = "gemini-2.5-flash";  // keep using this
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [{
      role: "user",
      parts: [{
        text: `
You are an agricultural expert. 
Given the following data, return a JSON with keys: condition_summary, suitable_crops[], improvement_materials[{material, purpose}].

Data:
City: ${city}
N: ${n}, P: ${p}, K: ${k}, pH: ${ph}, Moisture: ${moisture}%, Soil Temp: ${soilTemp}°C, 
Air Temp: ${airTemp}°C, Air Humidity: ${airHumidity}%


`
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        console.error(`Gemini API HTTP ${resp.status}:`, body);

        // Handle transient errors (retryable)
        if (resp.status === 429 || resp.status === 503) {
          const wait = Math.pow(2, retries) * 1000;
          console.warn(`Retrying in ${wait / 1000}s due to overload...`);
          await new Promise((r) => setTimeout(r, wait));
          retries++;
          continue;
        }

        throw new Error(`HTTP ${resp.status}`);
      }

      const result = await resp.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return JSON.parse(text);

    } catch (err) {
      console.warn(`Gemini attempt ${retries + 1} failed:`, err.message);
      retries++;
      if (retries === maxRetries) throw new Error("Gemini failed after retries");
      await new Promise(r => setTimeout(r, Math.pow(2, retries) * 1000));
    }
  }
};


// --- UI Components ---

const StatusBadge = ({ label, value, icon, className = '' }) => (
    <div className={`flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[80px] ${className}`}>
        <div className="text-xl text-green-600 mb-1">{icon}</div>
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
        <span className="text-md font-bold text-green-900 overflow-hidden whitespace-nowrap text-ellipsis max-w-full">{value}</span>
    </div>
);

const RecommendationList = ({ title, items, colorClass, icon }) => (
    <div className="mt-4 p-5 bg-white rounded-xl shadow-inner border-t-4 border-green-300">
        <h3 className={`text-xl font-extrabold ${colorClass} mb-4 pb-2 border-b flex items-center`}>
            <span className="mr-2 text-2xl">{icon}</span>{title}
        </h3>
        {items?.length > 0 ? (
            <ul className="space-y-3">
                {items.map((item, idx) => (
                    <li key={idx} className="flex flex-col p-3 bg-green-50 rounded-lg border-l-4 border-green-500 transition duration-300 hover:shadow-md">
                        {typeof item === 'string' ? (
                            <span className="font-semibold text-gray-800 flex items-center">
                                <span className="mr-2 text-green-600 font-bold">🌱</span> {item}
                            </span>
                        ) : (
                            <>
                                <span className="font-bold text-gray-800 flex items-center">
                                    <span className="mr-2 text-red-600">🛠️</span>{item.material}
                                </span>
                                <span className="text-sm text-gray-600 italic mt-1">{item.purpose}</span>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 italic text-center">No specific recommendations found.</p>
        )}
    </div>
);

// --- Main Component ---

const CropRec = () => {
    const { rtdb, userId, isAuthReady } = useFirebase();

    const [npkData, setNpkData] = useState({
        n: '', p: '', k: '', ph: '', moisture: '', soilTemp: '', airHumidityLocal: ''
    });
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [message, setMessage] = useState(null);

    const [geoStatus, setGeoStatus] = useState('Fetching location...');
    const [latitude, setLatitude] = useState('N/A');
    const [longitude, setLongitude] = useState('N/A');
    const [weatherInfo, setWeatherInfo] = useState({
        air_temp_api: 'N/A',
        air_humidity_api: 'N/A'
    });

    const handleGeolocationSuccess = useCallback(async (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setLatitude(lat);
        setLongitude(lon);
        setGeoStatus('Location determined.');

        let currentCity = city;

        if (!city) {
            setMessage({ type: 'info', text: `Location found (${lat}, ${lon}). Resolving city...` });
            const cityName = await reverseGeocode(lat, lon);
            if (cityName) {
                setCity(cityName);
                currentCity = cityName;
            } else {
                setMessage({ type: 'warning', text: 'City lookup failed. Please manually enter.' });
            }
        }

        setMessage({ type: 'info', text: `Fetching external weather data for ${currentCity || 'your location'}...` });
        const weather = await fetchOpenWeatherData(lat, lon);
        if (weather) {
            setWeatherInfo({
                air_temp_api: `${weather.air_temp}°C`,
                air_humidity_api: `${weather.air_humidity}%`
            });
            setMessage({ type: 'success', text: 'External weather data loaded. Waiting for sensor data...' });
        } else {
            setWeatherInfo(prev => ({
                ...prev,
                air_temp_api: 'Failed (local fallback)',
                air_humidity_api: 'Failed (local fallback)'
            }));
            setMessage({ type: 'error', text: 'Weather fetch failed. Using local sensor data if available.' });
        }
    }, [city]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            const handleError = (err) => {
                console.warn("Geo error:", err);
                setGeoStatus('Location blocked/unavailable.');
                setMessage({ type: 'error', text: 'Location access denied. Enter city manually.' });
            };
            navigator.geolocation.getCurrentPosition(
                handleGeolocationSuccess,
                handleError,
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setGeoStatus('Geolocation not supported.');
            setMessage({ type: 'error', text: 'Browser cannot get location. Enter city manually.' });
        }
    }, [handleGeolocationSuccess]);

    useEffect(() => {
        if (isAuthReady && rtdb) {
            const npkRef = ref(rtdb, 'npk');
            const unsub = onValue(npkRef, snapshot => {
                const d = snapshot.val();
                if (d && typeof d === 'object') {
                    setNpkData({
                        n: String(d.n || '0'),
                        p: String(d.p || '0'),
                        k: String(d.k || '0'),
                        ph: String(d.ph || '0'),
                        moisture: String(d.moisture || '0'),
                        soilTemp: String(d.temperature || '0'),
                        airHumidityLocal: String(d.humidity || '0')
                    });
                    if (!message || (message.type !== 'error' && message.type !== 'warning')) {
                        setMessage({ type: 'success', text: 'Live sensor data streaming.' });
                    }
                } else {
                    setMessage({ type: 'info', text: 'RTDB path "npk" is empty or invalid.' });
                }
            }, err => {
                console.error("RTDB read error:", err);
                setMessage({ type: 'error', text: `Failed to read sensor data: ${err.message}` });
            });
            return () => unsub();
        }
    }, [isAuthReady, rtdb]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'city') {
            setCity(value);
        } else {
            if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
                setNpkData(prev => ({ ...prev, [name]: value }));
                setApiError(null);
                if (message?.type !== 'error') {
                    setMessage(null);
                }
            }
        }
    };

    const isFormValid = () => {
        const { n, p, k, ph, moisture, soilTemp } = npkData;
        return [n, p, k, ph, moisture, soilTemp].every(v => v !== '' && !isNaN(parseFloat(v)) && parseFloat(v) >= 0);
    };

    const handleAnalyze = async () => {
        if (!city || city.trim() === '') {
            setApiError("City name is required for analysis.");
            return;
        }
        if (!isFormValid()) {
            setApiError("Ensure all soil parameters are valid (non-empty, numeric).");
            return;
        }
        setIsLoading(true);
        setApiError(null);
        setAnalysisResult(null);
        setMessage({ type: 'info', text: 'Preparing data and sending to AI...' });

        try {
            const n = parseFloat(npkData.n);
            const p = parseFloat(npkData.p);
            const k = parseFloat(npkData.k);
            const ph = parseFloat(npkData.ph);
            const moisture = parseFloat(npkData.moisture);
            const soilTemp = parseFloat(npkData.soilTemp);

            const airTemp = parseFloat(weatherInfo.air_temp_api) || parseFloat(npkData.airHumidityLocal);
            const airHumidity = parseFloat(weatherInfo.air_humidity_api) || parseFloat(npkData.airHumidityLocal);

            const result = await callGeminiAPI(n, p, k, ph, moisture, soilTemp, airTemp, airHumidity, city);
            setAnalysisResult(result);
            setMessage({ type: 'success', text: 'Analysis done!' });
            document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            console.error("Analysis error:", err);
            setApiError("Analysis failed: " + err.message);
            setMessage(null);
        } finally {
            setIsLoading(false);
        }
    };

    const backgroundImageUrl = '/farm2.png';

    return (
        <div className="min-h-screen p-4 sm:p-8 font-['Inter'] flex justify-center relative bg-cover bg-center bg-fixed"
             style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            <div className="absolute inset-0 bg-white bg-opacity-85 z-0"></div>
            <div className="w-full max-w-5xl space-y-8 mt-8 z-10">

                <header className="text-center p-8 bg-gradient-to-r from-green-700 to-green-900 text-white rounded-3xl shadow-2xl">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        Real-Time Soil & Crop Assistant
                    </h1>
                    <p className="mt-2 text-lg text-green-200 italic">
                        Live sensor data + external weather analyzed by AI.
                    </p>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-medium">
                    <StatusBadge label="City Input" value={city || 'N/A'} icon="📍" />
                    <StatusBadge label="Latitude" value={latitude} icon="🗺️" />
                    <StatusBadge label="Longitude" value={longitude} icon="🗺️" />
                </div>

                <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-t-8 border-green-500">
                    <h2 className="text-3xl font-bold text-green-800 mb-6 border-b pb-2">
                        Sensor Data & Context
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Soil parameters update automatically; air conditions from external weather.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {[
                            { name: 'n', label: 'Nitrogen (N)', unit: 'kg/ha', placeholder: 'e.g., 50', value: npkData.n },
                            { name: 'p', label: 'Phosphorus (P)', unit: 'kg/ha', placeholder: 'e.g., 25', value: npkData.p },
                            { name: 'k', label: 'Potassium (K)', unit: 'kg/ha', placeholder: 'e.g., 150', value: npkData.k },
                            { name: 'ph', label: 'pH Value', unit: '(0-14)', placeholder: 'e.g., 6.5', value: npkData.ph },
                            { name: 'moisture', label: 'Moisture (%)', unit: '%', placeholder: 'e.g., 30', value: npkData.moisture },
                            { name: 'soilTemp', label: 'Soil Temp', unit: '°C', placeholder: 'e.g., 28', value: npkData.soilTemp },
                        ].map(({ name, label, unit, placeholder, value }) => (
                            <div key={name} className="flex flex-col">
                                <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                                    {label} <span className="text-xs text-green-500">({unit})</span>
                                </label>
                                <input
                                    type="number"
                                    name={name}
                                    id={name}
                                    value={value}
                                    onChange={handleInputChange}
                                    placeholder={placeholder}
                                    className="p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-sm"
                                    required
                                    min="0"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t pt-6 border-gray-100">
                        <h3 className="text-xl font-bold text-gray-700 mb-3">Location & External Weather Context</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                                type="text"
                                id="city"
                                name="city"
                                placeholder="Enter City Name"
                                value={city}
                                onChange={handleInputChange}
                                className="sm:col-span-3 p-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                            />
                            <StatusBadge label="Air Temp (External)" value={weatherInfo.air_temp_api} icon="🌬️" className="sm:col-span-1 bg-blue-50" />
                            <StatusBadge label="Air Humidity (External)" value={weatherInfo.air_humidity_api} icon="💧" className="sm:col-span-1 bg-blue-50" />
                            <StatusBadge label="Geo Status" value={geoStatus} icon="🛰️" className="sm:col-span-1 bg-blue-50" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        <button
                            type="button"
                            onClick={handleAnalyze}
                            disabled={isLoading || !isFormValid() || !city}
                            className="w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg 
                                hover:bg-green-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                                flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Contextual Plan...
                                </>
                            ) : (
                                'Analyze & Get Recommendations'
                            )}
                        </button>
                    </div>

                    {(apiError || message) && (
                        <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${
                            apiError ? 'bg-red-100 text-red-700 border border-red-300'
                            : message?.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300'
                            : message?.type === 'warning' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-blue-100 text-blue-700 border border-blue-300'
                        }`}>
                            {apiError || message.text}
                        </div>
                    )}
                </section>

                {analysisResult && (
                    <section id="analysis-results" className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border-l-8 border-blue-500">
                        <h2 className="text-3xl font-bold text-blue-700 mb-6">
                            Detailed Soil Analysis & Plan
                        </h2>

                        <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-inner">
                            <h3 className="text-xl font-extrabold text-blue-800 mb-2 flex items-center">
                                <span className="mr-2 text-2xl">💡</span> Condition Summary:
                            </h3>
                            <p className="text-gray-700 leading-relaxed italic">
                                {analysisResult.condition_summary}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RecommendationList
                                title="Suitable Crops"
                                items={analysisResult.suitable_crops}
                                colorClass="text-green-800"
                                icon="🌾"
                            />
                            <RecommendationList
                                title="Soil Improvement Materials"
                                items={analysisResult.improvement_materials}
                                colorClass="text-red-700"
                                icon="🛠️"
                            />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default CropRec;