import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cropsData = {
  rabi: [
    { name: "wheat", image: "https://5.imimg.com/data5/ST/QW/MY-38700875/fresh-wheat-crop.jpg" },
    { name: "barley", image: "https://t4.ftcdn.net/jpg/01/03/26/41/360_F_103264132_VDQIfJvaEMpL5ZjU3X9kraEJirbRCZkY.jpg" },
    { name: "mustard", image: "https://media.istockphoto.com/id/1255224413/photo/mustard-seeds-making-a-background-pattern.jpg?s=612x612&w=0&k=20&c=j_sAbmUAS7l5SZriqOm35tgEY6BBnpzwtROwjnljOcE=" },
    { name: "chickpea", image: "https://www.shutterstock.com/image-photo/food-background-texture-raw-chickpeas-600nw-1125715514.jpg" },
    { name: "potato", image: "https://images7.alphacoders.com/383/thumb-1920-383749.jpg" },
    { name: "tomato", image: "https://cdn.pixabay.com/photo/2022/09/05/09/50/tomatoes-7433786_1280.jpg" },
    { name: "oat", image: "https://t3.ftcdn.net/jpg/01/27/18/72/360_F_127187211_Lj3BnpJX5pGJO4ElrUMhWoZO9imT1XcC.jpg" },
    { name: "garlic", image: "https://images8.alphacoders.com/413/413326.jpg" },
    { name: "cabbage", image: "https://media.istockphoto.com/id/1328912132/photo/cabbage-field-at-fully-mature-stage-ready-to-harvest.jpg?s=612x612&w=0&k=20&c=EVkaA_SQm61ObApMKSATxrKusfOSTJyHTtSvtBpn-Pw=" },
    { name: "pea", image: "https://c4.wallpaperflare.com/wallpaper/664/303/730/leaves-peas-green-peas-pods-wallpaper-preview.jpg" },
  ],
  kharif: [
    { name: "rice", image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?cs=srgb&dl=pexels-polina-tankilevitch-4110251.jpg&fm=jpg" },
    { name: "corn", image: "https://img.freepik.com/premium-photo/corn-high-quality-4k-ultra-hd-hdr_670382-129533.jpg" },
    { name: "cotton", image: "https://media.istockphoto.com/id/1333742146/photo/tree-branch-with-cotton-flowers-on-white-background.jpg?s=612x612&w=0&k=20&c=AuiO_rCmM9NIAMMOuXgo3Xm9gJT67SgKGh0iNkbJ8PA=" },
    { name: "sorghum", image: "https://media.istockphoto.com/id/179072932/photo/close-up-of-sorghum-in-morning-sun-light.jpg?s=612x612&w=0&k=20&c=IIYcKWtokaVXlfNqJekS4_R6wHKiBpoo1rqHLGLrZ_M=" },
    { name: "jowar", image: "https://t4.ftcdn.net/jpg/03/53/13/93/360_F_353139364_iz2ohMDi3lQnCNiB5O1Usdr2OnAeBOck.jpg" },
    { name: "muskmelon", image: "https://t3.ftcdn.net/jpg/04/63/30/50/360_F_463305057_cxC6gANdimD6YTcah6t20Mw4AHuUwLJD.jpg" },
    { name: "sugarcane", image: "https://media.istockphoto.com/id/965303384/photo/the-sugar-cane.jpg?s=612x612&w=0&k=20&c=-nwpqHxhmDCaB9s8KfR15ZnMVbos6yQ39Yl0vzCOt2E=" },
    { name: "watermelon", image: "https://media.istockphoto.com/id/1142119394/photo/whole-and-slices-watermelon-fruit-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=A5XnLyeI_3mwkCNadv-QLU4jzgNux8kUPfIlDvwT0jo=" },
  ],
};

export default function CropsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showMoreRabi, setShowMoreRabi] = useState(false);
  const [showMoreKharif, setShowMoreKharif] = useState(false);

  const handleCardClick = (cropName) => {
    navigate(`/crops/frame?name=${cropName}`);
  };

  const filterCrops = (crops) =>
    crops.filter((crop) => crop.name.toLowerCase().includes(search.toLowerCase()));

  const renderCropCards = (crops, showMore, setShowMore) => {
    const visible = showMore ? crops : crops.slice(0, 6);
    const filtered = filterCrops(visible);

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((crop) => (
            <article
              key={crop.name}
              onClick={() => handleCardClick(crop.name)}
              onKeyDown={(e) => e.key === "Enter" && handleCardClick(crop.name)}
              role="button"
              tabIndex={0}
              className="group relative transform transition will-change-transform hover:-translate-y-3 hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative rounded-2xl p-[2px]">
                <div
                  className="absolute inset-0 rounded-2xl blur-[18px] opacity-60"
                  style={{
                    background:
                      "linear-gradient(120deg, rgba(192, 132, 252, 0.18) 0%, rgba(167, 139, 250, 0.12) 100%)",
                    zIndex: 0,
                  }}
                />
                <div
                  className="relative bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    minHeight: 320,
                    zIndex: 10,
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow:
                      "0 10px 30px rgba(16,24,40,0.06), 0 6px 12px rgba(167, 139, 250, 0.05)",
                    animation: "float 6s ease-in-out infinite",
                  }}
                >
                  <div className="w-full h-44 overflow-hidden rounded-t-2xl">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex flex-col items-center text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-violet-900 capitalize tracking-tight mb-1">
                      {crop.name}
                    </h3>
                    <p className="text-sm text-violet-800/70 mb-4">
                      Fresh farm produce • curated info
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(crop.name);
                        }}
                        className="relative inline-flex items-center px-5 py-2 rounded-full text-sm font-medium focus:outline-none"
                        aria-label={`View details for ${crop.name}`}
                      >
                        <span
                          className="absolute inset-0 rounded-full -z-10"
                          style={{
                            background:
                              "linear-gradient(90deg, #a78bfa 0%, #c4b5fd 100%)",
                            filter: "saturate(1.05)",
                            opacity: 0.95,
                            transform: "translateZ(0)",
                            transition: "opacity .25s ease",
                            boxShadow: "0 8px 30px rgba(167, 139, 250, 0.2)",
                          }}
                        />
                        <span className="relative text-white drop-shadow-sm px-2">View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3 text-xs font-semibold bg-white/70 backdrop-blur rounded-full px-3 py-1 text-violet-900">
                {Math.floor(Math.random() * 20) + 1} ₹/kg
              </div>
            </article>
          ))}
        </div>

        {search === "" && crops.length > 6 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowMore(!showMore)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md border border-slate-100 hover:scale-105 transition transform"
            >
              <span className="text-violet-900 font-semibold">{showMore ? "Show Less" : "Show More"}</span>
              <svg
                className={`w-4 h-4 text-violet-700 transform transition ${showMore ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen font-sans text-violet-900 relative">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 opacity-60"></div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) }
          50% { transform: translateY(-6px) }
          100% { transform: translateY(0px) }
        }
      `}</style>

      {/* header */}
      <header className="relative pt-20 pb-12">
        <div className="relative max-w-5xl text-center px-6 mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500 drop-shadow-sm mb-3">
            Real-Time Crop Prices
          </h1>
          <p className="text-slate-600/80 mb-8 max-w-2xl mx-auto text-lg">
            Fresh market rates, weather-aware tips and crop guides — curated for farmers & traders.
          </p>
          <div className="mx-auto max-w-2xl">
            <label className="relative block">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search crops, e.g. wheat, rice..."
                className="w-full rounded-full py-4 pl-6 pr-14 text-violet-900 placeholder:text-slate-500 bg-white/70 backdrop-blur-lg border border-white/60 shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
                aria-label="Search crops"
              />
              <svg
                className="w-6 h-6 absolute right-5 top-4 text-violet-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
              </svg>
            </label>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="max-w-7xl mx-auto p-8">
        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-violet-900 mb-6 flex items-center justify-center gap-3">
            <span className="inline-block transform -rotate-12">🌿</span> Rabi Crops
          </h2>
          {renderCropCards(cropsData.rabi, showMoreRabi, setShowMoreRabi)}
        </section>

        <section className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-violet-900 mb-6 flex items-center justify-center gap-3">
            <span className="inline-block transform rotate-3">🌾</span> Kharif Crops
          </h2>
          {renderCropCards(cropsData.kharif, showMoreKharif, setShowMoreKharif)}
        </section>
      </main>

      {/* footer */}
      <footer className="text-center py-8 border-t border-slate-200 bg-white/40">
        <p className="text-slate-600/80 text-sm">© 2025 Real-Time Crop Prices. Crafted with care.</p>
      </footer>
    </div>
  );
}
