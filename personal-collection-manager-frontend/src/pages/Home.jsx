import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from "react-i18next";
import CollectionList from "../components/CollectionList";
import { io } from "socket.io-client";
import TopCollections from "../components/TopCollections";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";


const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [error, setError] = useState(null);
  const [loadingRecentItems, setLoadingRecentItems] = useState(true);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const response = await axios.get("/api/collections/items/recent");
        if (response.status !== 204) {
          setRecentItems(response.data);
        }
      } catch (error) {
        setError(t("error_fetching_recent_items"));
      } finally {
        setLoadingRecentItems(false);
      }
    };

    fetchRecentItems();

    const socket = io(
      "https://personal-collection-manager-backend.onrender.com/"
    );

    socket.on("newItem", (newItem) => {
      setRecentItems((prevItems) => [newItem, ...prevItems.slice(0, 4)]);
    });

    return () => {
      socket.disconnect();
    };
  }, [t]);

  const handleItemDetailsClick = (collectionId, itemId) => {
    navigate(`/collections/${collectionId}/items/${itemId}`);
  };
  
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Recent Items Section */}
          {loadingRecentItems ? (
            <div className="text-center text-xl text-gray-500">{t("loading_recent_items")}</div>
          ) : recentItems.length > 0 ? (
            <section className="mb-20">
              <h2 className={`text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r ${
                theme === "dark" ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
              }`}>
                {t("recently_added_items")}
              </h2>
  
              <Carousel
                showThumbs={false}
                infiniteLoop
                useKeyboardArrows
                autoPlay
                stopOnHover
                showStatus={false}
                renderIndicator={(onClickHandler, isSelected, index, label) => (
                  <button
                    onClick={onClickHandler}
                    role="button"
                    aria-label={label}
                    className={`mx-1.5 h-2 w-8 rounded-full transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : theme === "dark" 
                          ? 'bg-gray-600' 
                          : 'bg-gray-300'
                    }`}
                  />
                )}
                className="recent-items-carousel"
              >
                {recentItems.map((item) => (
                  <div key={item.item._id} className="px-4 pb-8">
                    <div className={`group relative rounded-2xl overflow-hidden shadow-2xl ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}>
                      {/* Image Container */}
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={item.item.imageURL}
                          alt={item.item.name}
                          className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
  
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="mb-4">
                          <h3 className="text-3xl font-bold drop-shadow-md">
                            {item.item.name}
                          </h3>
                          <p className="text-gray-200 mt-2">
                            {t("from_collection")}:{" "}
                            <span className="font-semibold">{item.collectionName}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </section>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                <div className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                  {t("no_recent_items")}
                </div>
              </div>
            </div>
          )}
  
          <TopCollections />
          <section className="mt-20">
            <CollectionList />
          </section>
          <section>
            <Footer></Footer>
          </section>
        </div>
      </div>
    );
  };
export default Home;
