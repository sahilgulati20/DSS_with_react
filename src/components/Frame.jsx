import React, { useState, useEffect } from "react";
// --- OPTIMIZATION: Moved static data outside the component ---
// This prevents them from being re-created on every render.
const staticPrices = {
  wheat: "₹ 2800.0 per quintal",
  barley: "₹ 2500.0 per quintal",
  mustard: "₹ 6500.0 per quintal",
  chickpea: "₹ 7000.0 per quintal",
  potato: "₹ 2000.0 per quintal",
  tomato: "₹ 2500.0 per quintal",
  oat: "₹ 3500.0 per quintal",
  garlic: "₹ 15000.0 per quintal",
  cabbage: "₹ 1800.0 per quintal",
  pea: "₹ 5000.0 per quintal",
  rice: "₹ 4000.0 per quintal",
  corn: "₹ 2500.0 per quintal",
  cotton: "₹ 8500.0 per quintal",
  sorghum: "₹ 3000.0 per quintal",
  jowar: "₹ 3200.0 per quintal",
  muskmelon: "₹ 3500.0 per quintal",
  sugarcane: "₹ 400.0 per quintal",
  watermelon: "₹ 2000.0 per quintal",
};

const cropData = {
  // 🌾 RABI CROPS
  wheat: {
    title: "Wheat (गेहूं)",
    image: "https://5.imimg.com/data5/ST/QW/MY-38700875/fresh-wheat-crop.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for bread, chapati, biscuits, and cereals.",
    scientificName: "Triticum aestivum",
  },
  barley: {
    title: "Barley (جौ)",
    image:
      "https://t4.ftcdn.net/jpg/01/03/26/41/360_F_103264132_VDQIfJvaEMpL5ZjU3X9kraEJirbRCZkY.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for malt, beer production, and food grains.",
    scientificName: "Hordeum vulgare",
  },
  mustard: {
    title: "Mustard (सरसों)",
    image:
      "https://media.istockphoto.com/id/1255224413/photo/mustard-seeds-making-a-background-pattern.jpg?s=612x612&w=0&k=20&c=j_sAbmUAS7l5SZriqOm35tgEY6BBnpzwtROwjnljOcE=",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for mustard oil, spices, and fodder.",
    scientificName: "Brassica juncea",
  },
  chickpea: {
    title: "Chickpea (चना)",
    image:
      "https://www.shutterstock.com/image-photo/food-background-texture-raw-chickpeas-600nw-1125715514.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used in pulses, snacks, and flour.",
    scientificName: "Cicer arietinum",
  },
  potato: {
    title: "Potato (आलू)",
    image: "https://images7.alphacoders.com/383/thumb-1920-383749.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Staple vegetable for curries and snacks.",
    scientificName: "Solanum tuberosum",
  },
  tomato: {
    title: "Tomato (टमाटर)",
    image:
      "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg",
    category: "Rabi",
    season: "All Season",
    uses: "Used in curries, sauces, and salads.",
    scientificName: "Solanum lycopersicum",
  },
  oat: {
    title: "Oat (जई)",
    image:
      "https://t3.ftcdn.net/jpg/01/27/18/72/360_F_127187211_Lj3BnpJX5pGJO4ElrUMhWoZO9imT1XcC.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used for oatmeal, cereals, and livestock feed.",
    scientificName: "Avena sativa",
  },
  garlic: {
    title: "Garlic (लहसुन)",
    image: "https://images8.alphacoders.com/413/413326.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used as a spice and for medicinal purposes.",
    scientificName: "Allium sativum",
  },
  cabbage: {
    title: "Cabbage (पत्ता गोभी)",
    image:
      "https://media.istockphoto.com/id/1328912132/photo/cabbage-field-at-fully-mature-stage-ready-to-harvest.jpg?s=612x612&w=0&k=20&c=EVkaA_SQm61ObApMKSATxrKusfOSTJyHTtSvtBpn-Pw=",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used in salads, curries, and pickles.",
    scientificName: "Brassica oleracea",
  },
  pea: {
    title: "Pea (मटर)",
    image:
      "https://c4.wallpaperflare.com/wallpaper/664/303/730/leaves-peas-green-peas-pods-wallpaper-preview.jpg",
    category: "Rabi",
    season: "Winter Season",
    uses: "Used as vegetables and in soups, curries, and snacks.",
    scientificName: "Pisum sativum",
  },

  // 🌾 KHARIF CROPS
  rice: {
    title: "Rice (चावल)",
    image:
      "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?cs=srgb&dl=pexels-polina-tankilevitch-4110251.jpg&fm=jpg",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Staple food, rice flour, and various dishes.",
    scientificName: "Oryza sativa",
  },
  corn: {
    title: "Corn (मकई)",
    image:
      "https://img.freepik.com/premium-photo/corn-high-quality-4k-ultra-hd-hdr_670382-129533.jpg",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for food, animal feed, corn oil, and biofuel.",
    scientificName: "Zea ma",
  },
  cotton: {
    title: "Cotton (कपास)",
    image:
      "https://media.istockphoto.com/id/1333742146/photo/tree-branch-with-cotton-flowers-on-white-background.jpg?s=612x612&w=0&k=20&c=AuiO_rCmM9NIAMMOuXgo3Xm9gJT67SgKGh0iNkbJ8PA=",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for textiles, cottonseed oil, and fabric.",
    scientificName: "Gossypium hirsutum",
  },
  sorghum: {
    title: "Sorghum (ज्वार)",
    image:
      "https://media.istockphoto.com/id/179072932/photo/close-up-of-sorghum-in-morning-sun-light.jpg?s=612x612&w=0&k=20&c=IIYcKWtokaVXlfNqJekS4_R6wHKiBpoo1rqHLGLrZ_M=",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for food, fodder, and alcohol production.",
    scientificName: "Sorghum bicolor",
  },
  jowar: {
    title: "Jowar (ज्वार)",
    image:
      "https://t4.ftcdn.net/jpg/03/53/13/93/360_F_353139364_iz2ohMDi3lQnCNiB5O1Usdr2OnAeBOck.jpg",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for flour, porridge, and livestock feed.",
    scientificName: "Sorghum vulgare",
  },
  muskmelon: {
    title: "Muskmelon (खरबूजा)",
    image:
      "https://t3.ftcdn.net/jpg/04/63/30/50/360_F_463305057_cxC6gANdimD6YTcah6t20Mw4AHuUwLJD.jpg",
    category: "Kharif",
    season: "Summer/Monsoon Season",
    uses: "Consumed as fruit and used in juices and desserts.",
    scientificName: "Cucumis melo",
  },
  sugarcane: {
    title: "Sugarcane (गन्ना)",
    image:
      "https://media.istockphoto.com/id/965303384/photo/the-sugar-cane.jpg?s=612x612&w=0&k=20&c=-nwpqHxhmDCaB9s8KfR15ZnMVbos6yQ39Yl0vzCOt2E=",
    category: "Kharif",
    season: "Monsoon Season",
    uses: "Used for sugar, jaggery, and ethanol production.",
    scientificName: "Saccharum officinarum",
  },
  watermelon: {
    title: "Watermelon (तरबूज)",
    image:
      "httpsall-images.co/wp-content/uploads/2021/07/Watermelon-Slice-Transparent-PNG.png",
    category: "Kharif",
    season: "Summer/Monsoon Season",
    uses: "Consumed as fruit and used in juices and smoothies.",
    scientificName: "Citrullus lanatus",
  },
};

function Frame() {
  // --- FIX: Removed router hooks ---
  // const location = useLocation();
  // const navigate = useNavigate();

  // --- FIX: Read 'name' from window.location.search on component mount ---
  // This avoids the useLocation() hook, which caused the error.
  const [name, setName] = useState(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("name")?.toLowerCase() || "rice";
  });

  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const crop = cropData[name] || cropData["rice"];

  // --- FIX: Create a simple navigate function using browser APIs ---
  // This avoids the useNavigate() hook.
  const navigate = (path) => {
    // We assume /crops is a path on the same domain
    window.location.href = path;
  };

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);

      // show static price instantly
      const staticPrice = staticPrices[name] || "₹ -- per quintal";
      setPrice(staticPrice);

      try {
        // --- FIX: Reverted to the deployed 'onrender.com' server URL ---
        // Fetching from 'http://localhost' while the app is on 'https'
        // causes a "mixed content" error, which results in "Failed to fetch".
        // This uses the secure, deployed server URL.
        const response = await fetch(
          `https://dss-crop-server.onrender.com/get-price/${name}`
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Backend price response:", data);

        // --- BUG FIX 2: Parse the correct JSON response from your server ---
        if (data && data.price && data.unit) {
          // Format the price string from the server's JSON response
          // e.g., "₹ 2538.02 per quintal"
          const formattedPrice = `₹ ${data.price} ${data.unit}`;
          setPrice(formattedPrice);
        } else {
          // Fallback if the JSON is incomplete, but the request was okay
          console.warn("Received incomplete price data from backend:", data);
          setPrice(staticPrice); // Revert to static price
        }
        // --- End of Fix ---
      } catch (error) {
        console.error("Error fetching price from backend:", error);
        // If fetch fails, the static price is already set, so no need to set it again
        setPrice(staticPrice); // Ensure static price remains on error
      }

      setLoading(false);
    };

    fetchPrice();
  }, [name]); // 'name' is the only dependency needed here

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-green-50 via-emerald-50 to-white">
      {/* HEADER (Commented out as in original) */}
      {/* <header ... </header> */}

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-12 space-y-16">
        {/* Crop Card */}
        <section className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-green-100 p-8 sm:p-12 transition-all hover:shadow-green-200/70 hover:scale-[1.02] duration-300">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <img
              src={crop?.image}
              alt={crop?.title}
              className="w-80 h-56 object-cover rounded-2xl shadow-lg border-4 border-green-100"
            />
            <div>
              <h2 className="text-4xl font-bold text-green-800 mb-4">
                {crop?.title}
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Scientific Name:</strong> {crop?.scientificName}
                </p>
                <p>
                  <strong>Category:</strong> {crop?.category}
                </p>
                <p>
                  <strong>Season:</strong> {crop?.season}
                </p>
                <p>
                  <strong>Uses:</strong> {crop?.uses}
                </p>
              </div>
              <div className="mt-6">
                <p className="text-lg text-gray-800">
                  <strong>Current Price:</strong>{" "}
                  <span
                    className={`text-2xl font-semibold text-green-700 ${
                      loading ? "animate-pulse" : ""
                    }`}
                  >
                    {price}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section>
          <h3 className="text-3xl font-semibold text-green-800 mb-6 text-center">
            📊 Market Trends and Insights
          </h3>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-green-200">
            <iframe
              src={`https://procurementtactics.com/${name}-prices/`}
              width="100%"
              height="900"
              className="border-none"
              title={`${name} Price Chart`}
            ></iframe>
          </div>
        </section>

        {/* Useful Links */}
        <section className="bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-50 shadow-lg rounded-3xl p-8 border border-green-200">
          <h3 className="text-3xl font-bold text-green-800 mb-6 text-center">
            🌱 Useful Resources
          </h3>
          <ul className="space-y-3 text-green-800 font-medium text-lg">
            <li>
              <a href="#" className="hover:text-green-600 transition">
                🏛️ Government Schemes for {crop?.title?.split(" ")[0]} Farmers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600 transition">
                💹 Market Rates in Your Region
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600 transition">
                🌾 {crop?.title?.split(" ")[0]} Farming Tips & Best Practices
              </a>
            </li>
          </ul>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/crops")}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-green-300 hover:scale-105 transition-transform duration-300 font-semibold text-lg"
          >
            ⬅ Back to Crop Listings
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-gray-600 py-6 border-t border-green-100 bg-white">
        <p>© 2025 Real-Time Crop Prices. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Frame;

