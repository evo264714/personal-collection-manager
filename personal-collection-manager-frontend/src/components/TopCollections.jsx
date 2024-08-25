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
    <>
      {topCollections.length > 0 ? (
        <section className="top-collections-slider mb-12">
          <h2 className="text-4xl font-bold text-center mb-8">
            {t("top_collections")}
          </h2>
          <Carousel
            showThumbs={false}
            infiniteLoop
            useKeyboardArrows
            autoPlay
            stopOnHover
            showStatus={false}
            className="top-collections-slider"
          >
            {topCollections.map((collection) => (
              <div
                key={collection._id}
                className={`collection-card bg-white dark:bg-gray-800 dark:text-gray-200 p-4 rounded-lg shadow-lg`}
              >
                <img
                  src={collection.imageURL}
                  alt={collection.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t("item_count")}: {collection.items.length}
                </p>
                <button
                  onClick={() => handleDetailsClick(collection._id)}
                  className="bg-blue-500 dark:bg-blue-600 text-white my-4 px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition duration-300"
                >
                  {t("details")}
                </button>
              </div>
            ))}
          </Carousel>
        </section>
      ) : (
        <div className="text-center text-xl">{t("no_top_collections")}</div>
      )}
    </>
  );
};

export default TopCollections;
