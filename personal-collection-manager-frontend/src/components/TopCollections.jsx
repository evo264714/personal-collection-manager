import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const TopCollections = () => {
  const [topCollections, setTopCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTopCollections = async () => {
      try {
        const response = await axios.get("/api/collections/top");
        if (response.status !== 204) {
          setTopCollections(response.data);
        } else {
          setTopCollections([]);
        }
      } catch (error) {
        console.error("Error fetching top collections:", error.message);
        setError(t("error_fetching_top_collections") + ": " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCollections();
  }, [t]);

  const handleDetailsClick = (collectionId) => {
    navigate(`/collections/${collectionId}`);
  };

  if (loading) {
    return (
      <div className="text-center text-xl">{t("loading_top_collections")}</div>
    );
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }
  
  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'}`}>
          {t("top_collections")}
        </h2>

        {topCollections.length > 0 ? (
          <Carousel
            // ... keep existing carousel props
          >
            {topCollections.map((collection) => (
              <div key={collection._id} className="px-4 pb-12">
                <div className={`group relative rounded-2xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  {/* Collection Badge */}
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ {t("trending_now")}
                  </div>

                  {/* Image Container with Spacing */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={collection.imageURL}
                      alt={collection.name}
                      className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  </div>

                  {/* Content Section with Adjusted Spacing */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {collection.name}
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 rounded-full`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                          </svg>
                          <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {collection.items.length} {t("items")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button with Proper Spacing */}
                    <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleDetailsClick(collection._id)}
                        className={`w-full py-4 px-8 rounded-full font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                            : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <span>{t("explore_collection")}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
            <div className="text-center py-12">
              <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <div className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                  {t("no_top_collections")}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

export default TopCollections;
