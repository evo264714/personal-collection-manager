
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const CollectionList = () => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme(); 

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get("/api/collections");
        if (Array.isArray(response.data)) {
          setCollections(response.data);
        } else {
          throw new Error(t("data_format_error"));
        }
      } catch (error) {
        console.error(t("error_fetching_collections"), error.message);
        setError(error.message);
        Swal.fire(t("error"), t("failed_to_fetch_collections"), "error");
      }
    };

    fetchCollections();
  }, [t]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/collections/${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
        data: { userId: currentUser.uid },
      });
      setCollections((prevCollections) =>
        prevCollections.filter((collection) => collection._id !== id)
      );
      Swal.fire(t("deleted"), t("collection_deleted_successfully"), "success");
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_delete_collection"), "error");
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{t("Collections")}</h2>
        {currentUser && (
          <Link
            to="/collections/new"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            {t("add_collection")}
          </Link>
        )}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {collections.length > 0 ? (
          collections.map((collection) => {
            const isOwnerOrAdmin =
              currentUser &&
              (currentUser.uid === collection.userId ||
                currentUser.role === "admin");

            return (
              <div
                key={collection._id}
                className={`p-4 rounded-lg shadow-md flex flex-col justify-between h-full ${
                  theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-black"
                }`}
              >
                <div className="flex flex-col items-center">
                  {collection.imageURL && (
                    <img
                      src={collection.imageURL}
                      alt={collection.name}
                      className="w-24 h-24 object-cover mb-2 rounded"
                    />
                  )}
                  <Link
                    to={`/collections/${collection._id}`}
                    className={`text-xl font-semibold hover:text-gray-300 transition duration-300 text-center ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {collection.name}
                  </Link>
                  <p className="text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                    {collection.description}
                  </p>
                  <p className="text-center">
                    {t("category")}: {collection.category}
                  </p>
                  {collection.customFields &&
                    collection.customFields.map((field, index) => (
                      <p key={index} className="text-center">
                        {field.name} {field.value}
                      </p>
                    ))}
                </div>
                <div className="mt-4 flex justify-between w-full">
                  <Link
                    to={`/collections/${collection._id}`}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                  >
                    {t("details")}
                  </Link>
                  {isOwnerOrAdmin && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/collections/${collection._id}/edit`)
                        }
                        className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                      >
                        {t("edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(collection._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                      >
                        {t("delete")}
                      </button>
                      <Link
                        to={`/collections/${collection._id}/items/new`}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                      >
                        {t("add_item")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-xl col-span-2">
            {t("No Collection Found")}
          </p>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
