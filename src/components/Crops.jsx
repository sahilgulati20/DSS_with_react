import React, { useState, useEffect } from "react";
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

function CropsList() {
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
    const visibleCrops = showMore ? crops : crops.slice(0, 4);
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filterCrops(visibleCrops).map((crop) => (
            <div
              key={crop.name}
              onClick={() => handleCardClick(crop.name)}
              className="cursor-pointer border rounded-2xl shadow-md p-4 hover:shadow-2xl transition duration-300 bg-white flex flex-col items-center"
            >
              <img
                src={crop.image}
                alt={crop.name}
                className="w-32 h-32 mb-3 object-cover rounded-xl"
              />
              <h2 className="text-lg font-semibold capitalize mb-1">{crop.name}</h2>
              <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm mt-2 hover:bg-green-600 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
        {search === "" && crops.length > 4 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-blue-600 font-medium hover:underline"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-green-700">
          🌾 Real-Time Crop Prices
        </h1>
        <input
          type="text"
          placeholder="Search for a crop..."
          className="w-full sm:w-1/2 mx-auto block border border-gray-300 rounded-full px-4 py-2 text-center focus:ring-2 focus:ring-green-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <main className="space-y-12">
        {/* Rabi Crops */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">
            🌿 Rabi Crops
          </h2>
          {renderCropCards(cropsData.rabi, showMoreRabi, setShowMoreRabi)}
        </section>

        {/* Kharif Crops */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">
            🌾 Kharif Crops
          </h2>
          {renderCropCards(cropsData.kharif, showMoreKharif, setShowMoreKharif)}
        </section>
      </main>

      <footer className="mt-12 text-center text-gray-500">
        <p>© 2025 Real-Time Crop Prices. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default CropsList;