import React, { useEffect, useState } from "react";
const fireBg = "farm_fire.jpg";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import { db, ref, onValue } from "../firebaseConfig";
import "leaflet/dist/leaflet.css";

// --- Custom Red Pin Marker ---
const redPin = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png", // red pin icon
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

// --- Auto Popup Component ---
function AutoPopup({ markerRef }) {
  useEffect(() => {
    if (markerRef?.current) {
      markerRef.current.openPopup();
    }
  }, [markerRef]);
  return null;
}

// --- Recenter on Fire ---
function Recenter({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.setView([lat, lon], 12);
  }, [lat, lon, map]);
  return null;
}

export default function FireAlert() {
  const [data, setData] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const markerRef = React.useRef(null);

  // --- Firebase Listener ---
  useEffect(() => {
    const sensorRef = ref(db, "sensor_data");
    onValue(sensorRef, (snapshot) => {
      const val = snapshot.val();
      setData(val);
    });
  }, []);

  // --- Twilio Call Trigger ---
  useEffect(() => {
    if (data?.flame_status === "Fire Detected") {
      setIsCalling(true);
      fetch("http://localhost:3000/make-call", { method: "POST" })
        .then((res) => res.json())
        .then(() => setIsCalling(false))
        .catch(() => setIsCalling(false));
    }
  }, [data]);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-800 text-xl font-medium">
        Loading Realtime Monitoring...
      </div>
    );
  }

  const { flame_status, latitude, longitude, location_name } = data;
  const fireDetected = flame_status === "Fire Detected";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${fireBg})`, // fire themed background
      }}
    >
      {/* Transparent overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-white/10 to-orange-50/10 backdrop-blur-sm z-0"></div>

      {/* Animated Fire Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 animate-pulse z-10"></div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-6 mb-6 z-20"
      >
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
          🔥 Fire Alert Monitoring System
        </h1>
        <p className="text-gray-100 mt-2 text-lg">
          Real-time Farm Fire Detection & Emergency Response
        </p>
      </motion.header>

      {/* Fire Status Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`shadow-2xl rounded-2xl p-6 w-full max-w-3xl z-20 mb-10 border ${
          fireDetected
            ? "bg-red-100/90 border-red-400 animate-pulse"
            : "bg-white/90 border-gray-200"
        } text-center backdrop-blur-md`}
      >
        {fireDetected ? (
          <>
            <motion.h2
              animate={{ scale: [1, 1.1, 1], opacity: [1, 0.9, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-3xl font-bold text-red-700 mb-2 drop-shadow"
            >
              🚨 FIRE DETECTED!
            </motion.h2>

            <p className="text-lg font-semibold mb-2 text-gray-800">
              Location: {location_name}
            </p>
            <p className="text-md text-gray-700">
              🌐 Latitude: {latitude} | Longitude: {longitude}
            </p>

            {isCalling ? (
              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="mt-4 text-red-600 font-semibold"
              >
                📞 Calling Fire Station...
              </motion.p>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-green-700 font-semibold"
              >
                ✅ Call Initiated Successfully!
              </motion.p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🟢 Monitoring Active
            </h2>
            <motion.p
              className="text-lg font-semibold text-gray-700"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              No Fire Detected
            </motion.p>
          </>
        )}
      </motion.section>

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-3xl bg-white/90 p-4 rounded-2xl shadow-lg z-20 mb-10 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          🗺️ Live Map
        </h2>
        <div className="rounded-xl overflow-hidden h-[400px] border border-gray-300 shadow-inner">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={fireDetected ? 10 : 5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            {fireDetected && (
              <>
                <Marker
                  position={[latitude, longitude]}
                  icon={redPin}
                  ref={markerRef}
                >
                  <Popup autoPan={true}>
                    🔥 <b>Fire Detected</b> at <b>{location_name}</b>
                    <br />
                    🌐 Lat: {latitude}, Lon: {longitude}
                  </Popup>
                </Marker>
                <AutoPopup markerRef={markerRef} />
                <Recenter lat={latitude} lon={longitude} />
              </>
            )}
          </MapContainer>
        </div>
      </motion.section>

      {/* Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl z-20 mb-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-50 to-white backdrop-blur-md shadow-md rounded-2xl p-6 border border-orange-200"
        >
          <h3 className="text-xl font-semibold text-orange-700 mb-2">
            🌾 Smart Farm Safety
          </h3>
          <p className="text-gray-600 text-sm">
            Monitors real-time fire data from your IoT sensors to ensure safety
            and instant emergency response.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-red-50 to-white backdrop-blur-md shadow-md rounded-2xl p-6 border border-red-200"
        >
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            ⚡ Instant Alerts
          </h3>
          <p className="text-gray-600 text-sm">
            Instantly triggers Twilio emergency calls and highlights the fire
            area on the live map.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-yellow-50 to-white backdrop-blur-md shadow-md rounded-2xl p-6 border border-yellow-200"
        >
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">
            ☁️ Cloud Synced
          </h3>
          <p className="text-gray-600 text-sm">
            Firebase Realtime Database ensures your fire detection data updates
            instantly and securely.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-gray-100 z-20 text-sm pb-6">
        &copy; 2025 Farm Fire Alert System. All Rights Reserved.
      </footer>
    </div>
  );
}