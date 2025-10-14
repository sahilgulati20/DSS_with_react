// src/soilhealth_components/soil_health.jsx
import React, { useState, useEffect } from "react";
import { db, ref, onValue } from "../firebaseConfig"; // Clean Firebase import

// --- Gemini API Key from .env ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- Loading Screen ---
const LoadingScreen = ({ cropName }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-emerald-50/50 backdrop-blur-sm">
    <style>{`
      .animate-seed-drop { animation: seed-drop 3s ease-in-out infinite; }
      @keyframes seed-drop { 0% { transform: translateY(0); opacity: 1; } 20% { transform: translateY(45px); opacity: 1; } 30% { transform: translateY(45px); opacity: 0; } 100% { transform: translateY(45px); opacity: 0; } }
      .animate-loader-sprout { transform-origin: bottom center; opacity: 0; animation: sprout 3s ease-out infinite; animation-delay: 0.8s; }
      @keyframes sprout { 0% { transform: scaleY(0); opacity: 0; } 20% { transform: scaleY(1); opacity: 1; } 80% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(1); opacity: 0; } }
    `}</style>
    <div className="relative w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <path d="M 20 80 H 80" stroke="#a1887f" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="30" r="5" fill="#8d6e63" className="animate-seed-drop" />
        <g className="animate-loader-sprout">
          <path d="M 50 80 V 60 C 50 50 55 50 55 60 V 70" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 50 80 V 60 C 50 50 45 50 45 60 V 70" stroke="#86efac" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
    <p className="text-green-700 text-lg font-medium mt-4">
      Analyzing soil for <span className="font-bold capitalize">{cropName}</span>...
    </p>
  </div>
);

export default function SoilHealth() {
  const [soilData, setSoilData] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState("");
  const [cropInput, setCropInput] = useState("");

  // --- Fetch soil data from Firebase ---
  useEffect(() => {
    const soilRef = ref(db, "npk");
    const unsubscribe = onValue(soilRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSoilData(data);
    });
    return () => unsubscribe();
  }, []);

  // --- Trigger analysis when crop changes ---
  useEffect(() => {
    if (soilData && crop) {
      fetchAnalysis();
    }
  }, [crop]); // soilData update alone won’t trigger analysis

  const fetchAnalysis = async () => {
    if (!soilData || !crop) return;
    setLoading(true);

    const prompt = `
You are an expert agronomist AI. Analyze this soil for {crop}. The soil data is as follows:

- Nitrogen: {soilData.n}
- Phosphorus: {soilData.p}
- Potassium: {soilData.k}
- pH: {soilData.ph}
- Moisture: {soilData.moisture}
- Temperature: {soilData.temperature}

Tasks:

1. Evaluate if this soil is suitable for growing {crop} in a **10-liter flower pot**.
2. Suggest precise improvements for a 10-liter pot.
3. For each nutrient (N, P, K), classify as Low / Medium / High.
4. Provide exact amounts (in grams or liters) of organic and inorganic materials to add for one 10-liter pot.
5. Provide recommendations in a **structured bullet format** as below:

---
SOIL CONDITION:
Nitrogen: [Low/Medium/High]
Phosphorus: [Low/Medium/High]
Potassium: [Low/Medium/High]
pH: [Acidic/Neutral/Alkaline]
Moisture: [Low/Medium/High]

SUITABILITY: [Yes/No] - [short reason]

ORGANIC IMPROVEMENTS (for 10-liter pot):
1. [Material] - [Exact amount in grams or liters]
2. [Material] - [Exact amount in grams or liters]
3. [Material] - [Exact amount in grams or liters]

INORGANIC IMPROVEMENTS (for 10-liter pot):
1. [Material] - [Exact amount in grams or liters]
2. [Material] - [Exact amount in grams or liters]
3. [Material] - [Exact amount in grams or liters]
---
Notes:
- Keep each item concise.
- No long paragraphs.
- Only actionable recommendations with quantities.
- Use commonly available fertilizers and soil amendments.
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis available.";
      setAnalysis(text);
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      setAnalysis("Error analyzing soil data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = () => {
    if (cropInput.trim()) setCrop(cropInput);
  };

  if (!soilData)
    return (
      <div className="flex items-center justify-center h-screen text-green-700 font-semibold bg-green-50">
        Waiting for soil data from Firebase...
      </div>
    );

  if (loading) return <LoadingScreen cropName={crop} />;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      <div className="relative bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-4xl w-full border border-white/30">
        <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">
          🌾 Soil Health Analysis
        </h2>

        {/* Crop Input */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-8">
          <input
            type="text"
            value={cropInput}
            onChange={(e) => setCropInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAnalyzeClick()}
            placeholder="Enter crop/plant name..."
            className="w-full sm:w-auto flex-grow border border-green-300 rounded-xl px-4 py-3 text-green-800 placeholder-green-600/50 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
          />
          <button
            onClick={handleAnalyzeClick}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 text-lg"
          >
            Analyze
          </button>
        </div>

        {analysis ? (
          <ParsedResult text={analysis} />
        ) : (
          <p className="text-gray-600 text-center text-lg">
            Enter a crop to start the analysis.
          </p>
        )}
      </div>
    </div>
  );
}

// --- Typewriter effect ---
function useTypewriter(text) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i++));
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  return displayed;
}

// --- Parsed Result Display ---
const ParsedResult = ({ text }) => {
  const typedText = useTypewriter(text);
  const lines = typedText.split("\n");

  const soilLines = lines.filter((l) =>
    l.match(/(Nitrogen|Phosphorus|Potassium|pH|Moisture)/)
  );
  const suitabilityLine = lines.find((l) => l.startsWith("SUITABILITY:"));
  const organicIndex = lines.findIndex((l) => l.startsWith("ORGANIC:"));
  const inorganicIndex = lines.findIndex((l) => l.startsWith("INORGANIC:"));
  const organic = lines.slice(organicIndex + 1, inorganicIndex).filter(Boolean);
  const inorganic = lines.slice(inorganicIndex + 1).filter(Boolean);
  const isSuitable = suitabilityLine?.toLowerCase().includes("yes");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Suitability */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-100 border border-slate-200">
        {isSuitable ? (
          <span className="text-green-500 text-3xl">✅</span>
        ) : (
          <span className="text-red-500 text-3xl">❌</span>
        )}
        <div>
          <h4 className="text-lg font-bold text-slate-800">
            Suitability: {isSuitable ? "Yes" : "No"}
          </h4>
          <p className="text-slate-600">
            {suitabilityLine?.split("-")[1]?.trim()}
          </p>
        </div>
      </div>

      {/* Soil Condition */}
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <h3 className="text-xl font-bold text-green-700 mb-4">🌱 Soil Condition</h3>
        <ul className="space-y-3">
          {soilLines.map((line, i) => {
            const [key, value] = line.split(":").map((s) => s.trim());
            return (
              <li
                key={i}
                className="flex justify-between text-green-800 font-medium pb-2 border-b border-green-100 last:border-b-0"
              >
                <span>{key}</span>
                <span className="font-bold">{value}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <h3 className="text-xl font-bold text-green-700 mb-4">
          🌿 Improvement Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Organic</h4>
            <ul className="space-y-2">
              {organic.map((item, i) => (
                <li key={i} className="bg-green-100/70 p-3 rounded-lg text-green-900">
                  {item.replace(/^\d+\.\s*/, "")}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Inorganic</h4>
            <ul className="space-y-2">
              {inorganic.map((item, i) => (
                <li key={i} className="bg-green-100/70 p-3 rounded-lg text-green-900">
                  {item.replace(/^\d+\.\s*/, "")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
