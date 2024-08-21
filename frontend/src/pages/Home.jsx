import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from "react-i18next";
import CollectionList from "../components/CollectionList";
import { io } from "socket.io-client";
import TopCollections from "../components/TopCollections";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [error, setError] = useState(null);
  const [loadingRecentItems, setLoadingRecentItems] = useState(true);
  const { t } = useTranslation();
  const { theme } = useTheme();

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

    const socket = io("http://localhost:5000");

    socket.on("newItem", (newItem) => {
      setRecentItems((prevItems) => [newItem, ...prevItems.slice(0, 4)]);
    });

    return () => {
      socket.disconnect();
    };
  }, [t]);

  return (
    <div
      className={`home-container p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {loadingRecentItems ? (
        <div className="text-center text-xl">{t("loading_recent_items")}</div>
      ) : recentItems.length > 0 ? (
        <section className="recent-items-carousel mb-12">
          <h2 className="text-4xl font-bold text-center mb-8">
            {t("recently_added_items")}
          </h2>
          <Carousel
            showThumbs={false}
            infiniteLoop
            useKeyboardArrows
            autoPlay
            stopOnHover
            showStatus={false}
            className="recent-items-carousel"
          >
            {recentItems.map((item) => (
              <div
                key={item.item._id}
                className={`item-card ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-black"
                } p-4 rounded-lg shadow-lg`}
              >
                <img
                  src={item.item.imageURL}
                  alt={item.item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">{item.item.name}</h3>
                <p className="text-gray-700 my-4">
                  {t("from_collection")}: {item.collectionName}
                </p>
              </div>
            ))}
          </Carousel>
        </section>
      ) : (
        <div className="text-center text-xl">{t("no_recent_items")}</div>
      )}

      <TopCollections />

      <section className="collection-list">
        <CollectionList />
      </section>
    </div>
  );
};

export default Home;
