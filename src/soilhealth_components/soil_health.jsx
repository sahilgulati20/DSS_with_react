import React, { useState, useEffect } from "react";
import { db, ref, onValue } from "../firebaseConfig";
const bgImage = "crophealth_bg.png";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// --- Circle Animation Component ---
const NutrientCircle = ({ label, value, color }) => {
  const percent = Math.min(value, 100);
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="relative w-24 h-24 mb-2">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3.8"
            fill="none"
            d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            stroke={color}
            strokeWidth="3.8"
            strokeDasharray={`${percent}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-700">
          {value}
        </div>
      </div>
      <p className="text-green-800 font-semibold">{label}</p>
    </div>
  );
};

// --- Main Component ---
export default function SoilHealth() {
  const [soilData, setSoilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState("");
  const [cropInput, setCropInput] = useState("");
  const [structuredData, setStructuredData] = useState(null);
  const [showCircles, setShowCircles] = useState(false);

  // Fetch soil data
  useEffect(() => {
    const soilRef = ref(db, "npk");
    const unsubscribe = onValue(soilRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSoilData(data);
    });
    return () => unsubscribe();
  }, []);

  // --- Analyze soil using Gemini ---
  const analyzeSoil = async () => {
    if (!soilData) return;
    setLoading(true);
    setShowCircles(true);

    const prompt = `
You are an expert agronomist AI.

Analyze the following soil parameters **for growing ${crop}** in a 10-liter flower pot.
Compare each parameter with the optimal requirements for ${crop} and identify
whether it is Low, Medium, or High relative to ideal values.

Soil data:
- Nitrogen (N): ${soilData.n}
- Phosphorus (P): ${soilData.p}
- Potassium (K): ${soilData.k}
- pH: ${soilData.ph}
- Moisture: ${soilData.moisture}
- Temperature: ${soilData.temperature}

Based on this comparison:
1. Give a short summary describing the soil’s overall suitability for ${crop}.
2. State the soil condition as one of: Good / Moderate / Poor.
3. List nutrient levels (N, P, K, pH, Moisture, Temperature) and whether each is low, normal, or high for ${crop}.
4. Recommend **3–4 organic** and **3–4 inorganic** amendments (with approximate quantities suitable for a 10-liter pot)
   to improve the soil to optimal range for ${crop}.
5. Keep the response **concise and formatted** exactly as below:

The soil condition for ${crop} is: [Good/Moderate/Poor]

Nitrogen (N): [Low/Medium/High]
Phosphorus (P): [Low/Medium/High]
Potassium (K): [Low/Medium/High]
pH: [value or level]
Moisture: [value or level]
Temperature: [value or level]

To improve the soil for ${crop} (10-liter pot):

Organic:
1. [Material - Quantity]
2. [Material - Quantity]
3. [Material - Quantity]

Inorganic:
1. [Material - Quantity]
2. [Material - Quantity]
3. [Material - Quantity]
`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No structured response.";

      const parsed = parseGeminiResponse(text);
      setStructuredData(parsed);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Parse Gemini Text Response ---
  const parseGeminiResponse = (response) => {
    const lines = response.split("\n").map((l) => l.trim());
    let soilCondition = "";
    let values = {};
    let organic = [];
    let inorganic = [];
    let section = "";

    lines.forEach((line) => {
      if (line.startsWith("The soil condition is:"))
        soilCondition = line.split(":")[1]?.trim();
      else if (line.includes("Nitrogen (N):"))
        values.n = line.split(":")[1]?.trim();
      else if (line.includes("Phosphorus (P):"))
        values.p = line.split(":")[1]?.trim();
      else if (line.includes("Potassium (K):"))
        values.k = line.split(":")[1]?.trim();
      else if (line.includes("pH:")) values.ph = line.split(":")[1]?.trim();
      else if (line.includes("Moisture")) values.moisture = line.split(":")[1]?.trim();
      else if (line.includes("Organic:")) section = "organic";
      else if (line.includes("Inorganic:")) section = "inorganic";
      else if (/^\d+\./.test(line)) {
        const item = line.replace(/^\d+\.\s*/, "");
        if (section === "organic") organic.push(item);
        else if (section === "inorganic") inorganic.push(item);
      }
    });

    return { soilCondition, values, organic, inorganic };
  };

  return (
    <div
  className="min-h-screen flex flex-col items-center justify-center p-6 relative"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* White transparent overlay */}
  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-4xl w-full border border-white/30">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          🌱 Soil Health Analyzer
        </h2>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <input
            type="text"
            value={cropInput}
            onChange={(e) => setCropInput(e.target.value)}
            placeholder="Enter crop name..."
            className="flex-grow px-4 py-3 border border-green-300 rounded-xl text-green-700 focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            onClick={analyzeSoil}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Circles appear AFTER analyze click */}
        {showCircles && soilData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center mb-10">
            <NutrientCircle label="Nitrogen (N)" value={soilData.n} color="#16a34a" />
            <NutrientCircle label="Phosphorus (P)" value={soilData.p} color="#facc15" />
            <NutrientCircle label="Potassium (K)" value={soilData.k} color="#ef4444" />
            <NutrientCircle label="pH" value={soilData.ph} color="#3b82f6" />
            <NutrientCircle label="Moisture" value={soilData.moisture} color="#14b8a6" />
            {/* <NutrientCircle label="Temp (°C)" value={soilData.temperature} color="#f97316" /> */}
          </div>
        )}

        {/* Gemini structured output */}
        {structuredData && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-inner text-green-900 animate-fade-in">
            <h3 className="text-2xl font-semibold text-green-800 mb-3 text-center">
              🌿 AI Recommendations
            </h3>

            <p className="text-lg font-medium mb-2">
              <strong>Condition:</strong> {structuredData.soilCondition}
            </p>

            <div className="grid grid-cols-2 gap-2 text-lg mb-6">
              <p>🌾 N: {structuredData.values.n}</p>
              <p>🌻 P: {structuredData.values.p}</p>
              <p>🍃 K: {structuredData.values.k}</p>
              <p>⚗️ pH: {structuredData.values.ph}</p>
              <p>💧 Moisture: {structuredData.values.moisture}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-green-700 mb-2">
                  🌱 Organic Materials
                </h4>
                <ul className="list-disc ml-6 space-y-1">
                  {structuredData.organic.map((item, i) => (
                    <li key={i} className="animate-fade-in">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-green-700 mb-2">
                  🧪 Inorganic Materials
                </h4>
                <ul className="list-disc ml-6 space-y-1">
                  {structuredData.inorganic.map((item, i) => (
                    <li key={i} className="animate-fade-in">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!structuredData && !loading && (
          <p className="text-center text-gray-600 text-lg mt-4">
            Enter a crop and click "Analyze" to begin.
          </p>
        )}
      </div>
    </div>
  );
}