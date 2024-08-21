import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const MyCollections = () => {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCollections = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `/api/collections/user/${currentUser.uid}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError(error.message);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          Swal.fire(t("error"), t("fetch_collections_error"), "error");
        }
      }
    };

    fetchCollections();
  }, [currentUser, navigate, t]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/collections/${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setCollections((prevCollections) =>
        prevCollections.filter((collection) => collection._id !== id)
      );
      Swal.fire(t("deleted"), t("collection_deleted_success"), "success");
    } catch (error) {
      Swal.fire(t("error"), t("delete_collection_error"), "error");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
    >
      <h2
        className={`text-4xl font-bold text-center mb-8 ${
          theme === "light" ? "text-gray-800" : "text-gray-200"
        }`}
      >
        {t("my_collections")}
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table
          className={`min-w-full shadow-lg rounded-lg ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}
        >
          <thead
            className={`${theme === "light" ? "bg-gray-200" : "bg-gray-700"}`}
          >
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {t("image")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {t("name")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                {t("actions")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody
            className={`${
              theme === "light"
                ? "bg-white divide-y divide-gray-200"
                : "bg-gray-800 divide-y divide-gray-700"
            }`}
          >
            {collections.map((collection) => (
              <tr
                key={collection._id}
                className={`${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"
                } transition duration-300`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {collection.imageURL ? (
                    <img
                      src={collection.imageURL}
                      alt={collection.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                      <span>{t("no_image")}</span>
                    </div>
                  )}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap cursor-pointer ${
                    theme === "light" ? "text-gray-900" : "text-gray-200"
                  }`}
                  onClick={() => navigate(`/collections/${collection._id}`)}
                >
                  <span className="text-sm font-medium">{collection.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <Link
                      to={`/collections/${collection._id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {t("update")}
                    </Link>
                    <button
                      onClick={() => handleDelete(collection._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      {t("delete")}
                    </button>
                    <Link
                      to="/collections/new"
                      className="text-gray-600 hover:text-black text-sm font-medium"
                    >
                      {t("add_new")}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
              </tr>
            ))}
          </tbody>
        </table>
        {collections.length === 0 && (
          <p
            className={`text-center text-xl mt-4 ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {t("no_collections_found")}
          </p>
        )}
      </div>
    </div>
  );
};

export default MyCollections;
