import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Frame() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name")?.toLowerCase() || "rice";

  // ✅ Initialize Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });


  const [price, setPrice] = useState("Fetching...");
  const [loading, setLoading] = useState(true);

const cropData = {
  barley: {
    title: "Barley (जौ)",
    image: "https://cdn.pixabay.com/photo/2017/06/22/20/48/barley-2434036_1280.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for malt, beer production, and food grains.",
    scientificName: "Hordeum vulgare",
  },
  cabbage: {
    title: "Cabbage (पत्ता गोभी)",
    image: "https://media.istockphoto.com/id/1328912132/photo/cabbage-field-at-fully-mature-stage-ready-to-harvest.jpg?s=612x612&w=0&k=20&c=EVkaA_SQm61ObApMKSATxrKusfOSTJyHTtSvtBpn-Pw=",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used in salads, curries, and stir-fries.",
    scientificName: "Brassica oleracea",
  },
  chickpea: {
    title: "Chickpea (चना)",
    image: "https://www.shutterstock.com/image-photo/food-background-texture-raw-chickpeas-600nw-1125715514.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used in pulses, snacks, and flour.",
    scientificName: "Cicer arietinum",
  },
  corn: {
    title: "Corn (मकई)",
    image: "https://img.freepik.com/premium-photo/corn-high-quality-4k-ultra-hd-hdr_670382-129533.jpg",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for food, animal feed, corn oil, and biofuel.",
    scientificName: "Zea mays",
  },
  cotton: {
    title: "Cotton (कपास)",
    image: "https://media.istockphoto.com/id/1333742146/photo/tree-branch-with-cotton-flowers-on-white-background.jpg?s=612x612&w=0&k=20&c=AuiO_rCmM9NIAMMOuXgo3Xm9gJT67SgKGh0iNkbJ8PA=",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for textiles and clothing.",
    scientificName: "Gossypium hirsutum",
  },
  garlic: {
    title: "Garlic (लहसुन)",
    image: "https://images8.alphacoders.com/413/413326.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used in cooking, pickles, and medicine.",
    scientificName: "Allium sativum",
  },
  jowar: {
    title: "Jowar (ज्वार)",
    image: "https://t4.ftcdn.net/jpg/03/53/13/93/360_F_353139364_iz2ohMDi3lQnCNiB5O1Usdr2OnAeBOck.jpg",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for making bhakri, roti, and fodder.",
    scientificName: "Sorghum bicolor",
  },
  mustard: {
    title: "Mustard (सरसों)",
    image: "https://media.istockphoto.com/id/1255224413/photo/mustard-seeds-making-a-background-pattern.jpg?s=612x612&w=0&k=20&c=j_sAbmUAS7l5SZriqOm35tgEY6BBnpzwtROwjnljOcE=",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for mustard oil, spices, and fodder.",
    scientificName: "Brassica juncea",
  },
  muskmelon: {
    title: "Muskmelon (खरबूजा)",
    image: "https://t3.ftcdn.net/jpg/04/63/30/50/360_F_463305057_cxC6gANdimD6YTcah6t20Mw4AHuUwLJD.jpg",
    category: "Summer",
    season: "Summer Season",
    uses: "Eaten fresh, used in juices and desserts.",
    scientificName: "Cucumis melo",
  },
  oat: {
    title: "Oat (जई)",
    image: "https://t3.ftcdn.net/jpg/01/27/18/72/360_F_127187211_Lj3BnpJX5pGJO4ElrUMhWoZO9imT1XcC.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for cereals, health foods, and livestock feed.",
    scientificName: "Avena sativa",
  },
  pea: {
    title: "Pea (मटर)",
    image: "https://c4.wallpaperflare.com/wallpaper/664/303/730/leaves-peas-green-peas-pods-wallpaper-preview.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used in curries, soups, and snacks.",
    scientificName: "Pisum sativum",
  },
  potato: {
    title: "Potato (आलू)",
    image: "https://images7.alphacoders.com/383/thumb-1920-383749.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Staple vegetable for curries and snacks.",
    scientificName: "Solanum tuberosum",
  },
  rice: {
    title: "Rice (चावल)",
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?cs=srgb&dl=pexels-polina-tankilevitch-4110251.jpg&fm=jpg",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Staple food, rice flour, and various dishes.",
    scientificName: "Oryza sativa",
  },
  sorghum: {
    title: "Sorghum (ज्वार)",
    image: "https://media.istockphoto.com/id/179072932/photo/close-up-of-sorghum-in-morning-sun-light.jpg?s=612x612&w=0&k=20&c=IIYcKWtokaVXlfNqJekS4_R6wHKiBpoo1rqHLGLrZ_M=",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for flour, fodder, and biofuel.",
    scientificName: "Sorghum vulgare",
  },
  sugarcane: {
    title: "Sugarcane (गन्ना)",
    image: "https://media.istockphoto.com/id/965303384/photo/the-sugar-cane.jpg?s=612x612&w=0&k=20&c=-nwpqHxhmDCaB9s8KfR15ZnMVbos6yQ39Yl0vzCOt2E=",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for sugar, jaggery, and biofuel.",
    scientificName: "Saccharum officinarum",
  },
  tomato: {
    title: "Tomato (टमाटर)",
    image: "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg",
    category: "Rabi/Kharif",
    season: "All Season",
    uses: "Used in curries, sauces, and salads.",
    scientificName: "Solanum lycopersicum",
  },
  watermelon: {
    title: "Watermelon (तरबूज)",
    image: "https://media.istockphoto.com/id/1142119394/photo/whole-and-slices-watermelon-fruit-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=A5XnLyeI_3mwkCNadv-QLU4jzgNux8kUPfIlDvwT0jo=",
    category: "Summer",
    season: "Summer Season",
    uses: "Eaten fresh or used in juices.",
    scientificName: "Citrullus lanatus",
  },
  wheat: {
    title: "Wheat (गेहूं)",
    image: "https://cdn.pixabay.com/photo/2016/11/18/17/42/wheat-1836411_1280.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for bread, chapati, biscuits, and cereals.",
    scientificName: "Triticum aestivum",
  },
};


  const crop = cropData[name] || cropData["rice"];

  // ✅ Fetch real-time price using Gemini
  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const prompt = `Search for the current national average wholesale or mandi price of ${name} in Indian Rupees per kilogram. The final output must be ONLY the price, formatted exactly as: '₹ X.X per kg' (including the single quotes, with X.X being the average price rounded to one decimal place). DO NOT provide any other text, explanation, or formatting.`;
        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        setPrice(text.replace(/['"]/g, "")); // Clean quotes for display
      } catch (err) {
        console.error("Error fetching price:", err);
        setPrice("₹ -- per kg");
      }
      setLoading(false);
    };

    fetchPrice();
  }, [name]);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#2c3e50",
          color: "white",
          textAlign: "center",
          padding: "60px 20px",
          borderBottom: "5px solid #34495e",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "10px", fontFamily: "Georgia, serif" }}>
          Real-Time Crop Prices
        </h1>
        <p style={{ fontSize: "18px" }}>
          Stay updated with the latest {crop.title.split(" ")[0]} prices, weather updates, and farming tips.
        </p>
      </header>

      {/* Crop Details */}
      <main style={{ padding: "40px 20px", maxWidth: "1000px", margin: "30px auto" }}>
        <section
          style={{
            backgroundColor: "white",
            boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            padding: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "30px",
              marginBottom: "20px",
              textAlign: "center",
              color: "#2c3e50",
              fontFamily: "Georgia, serif",
            }}
          >
            {crop.title}
          </h2>

          {/* Crop Card */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#ecf0f1",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
              marginBottom: "30px",
            }}
          >
            <img
              src={crop.image}
              alt={crop.title}
              style={{
                maxWidth: "300px",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
              }}
            />
            <div>
              <p><strong>Price (per kg):</strong> {loading ? "Loading..." : price}</p>
              <p><strong>Season:</strong> {crop.season}</p>
              <p><strong>Uses:</strong> {crop.uses}</p>
            </div>
          </div>

          {/* Real-Time Price Section */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              marginBottom: "30px",
              boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                color: "#2c3e50",
                marginBottom: "10px",
                fontFamily: "Georgia, serif",
              }}
            >
              Current Market Price
            </h3>
            <p>
              <strong>Price Today (per kg):</strong> {loading ? "Fetching price..." : price}
            </p>
          </div>

          {/* Price Chart / External Info */}
          <iframe
            src={`https://procurementtactics.com/${name}-prices/`}
            width="100%"
            height="900"
            style={{
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
            }}
            title={`${name} Prices`}
          ></iframe>

          {/* Useful Resources */}
          <div style={{ marginTop: "40px" }}>
            <h3 style={{ fontSize: "24px", color: "#2c3e50", marginBottom: "15px" }}>
              Useful Resources
            </h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                <a href="#" style={{ color: "#16a085", fontSize: "18px" }}>
                  Government Schemes for {crop.title.split(" ")[0]} Farmers
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#16a085", fontSize: "18px" }}>
                  Market Rates in Your Region
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#16a085", fontSize: "18px" }}>
                  {crop.title.split(" ")[0]} Farming Tips and Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button
              onClick={() => navigate("/crops")}
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                padding: "15px 40px",
                fontSize: "18px",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#34495e")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2c3e50")}
            >
              Back to Crop Listings
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "15px",
          marginTop: "40px",
          fontSize: "16px",
        }}
      >
        <p>© 2025 Real-Time Crop Prices. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Frame;