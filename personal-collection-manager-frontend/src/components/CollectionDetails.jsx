import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const CollectionDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/collections/${id}`);
        const collectionData = response.data;

        const updatedItems = collectionData.items.map((item) => ({
          ...item,
          likes: Array.isArray(item.likes) ? item.likes : [],
          comments: Array.isArray(item.comments) ? item.comments : [],
          customFields: Array.isArray(item.customFields)
            ? item.customFields
            : Object.entries(item.customFields || {}).map(([name, value]) => ({
                name,
                value,
              })),
        }));

        setCollection({ ...collectionData, items: updatedItems });
      } catch (error) {
        console.error(t("error_fetching_collection"), error.message);
        setError(error.message);
        Swal.fire(t("error"), t("failed_to_fetch_collection"), "error");
      }
    };

    fetchCollection();
  }, [id, t]);

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/collections/${id}/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        data: { userId: currentUser.uid },
      });
      setCollection((prevCollection) => ({
        ...prevCollection,
        items: prevCollection.items.filter((item) => item._id !== itemId),
      }));
      Swal.fire(t("deleted"), t("item_deleted_successfully"), "success");
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_delete_item"), "error");
    }
  };

  const handleLike = async (itemId) => {
    if (!currentUser) {
      Swal.fire({
        title: t("login_required"),
        text: t("please_login_to_like"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("login"),
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      const response = await axios.post(
        `/api/collections/${id}/items/${itemId}/like`,
        { userId: currentUser.uid },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setCollection((prevCollection) => {
        const updatedItems = prevCollection.items.map((item) => {
          if (item._id === itemId) {
            return { ...item, likes: response.data };
          }
          return item;
        });
        return { ...prevCollection, items: updatedItems };
      });
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_like_item"), "error");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!collection) {
    return <div>{t("loading")}</div>;
  }

  const handleComment = async (itemId) => {
    if (!currentUser) {
      Swal.fire({
        title: t("login_required"),
        text: t("please_login_to_comment"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("login"),
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    const { value: comment } = await Swal.fire({
      title: t("add_comment"),
      input: "textarea",
      inputLabel: t("your_comment"),
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return t("comment_required");
        }
      },
    });

    if (comment) {
      try {
        const response = await axios.post(
          `/api/collections/${id}/items/${itemId}/comment`,
          { userId: currentUser.uid, comment },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setCollection((prevCollection) => {
          const updatedItems = prevCollection.items.map((item) => {
            if (item._id === itemId) {
              return { ...item, comments: [...item.comments, response.data] };
            }
            return item;
          });
          return { ...prevCollection, items: updatedItems };
        });
      } catch (error) {
        Swal.fire(t("error"), t("failed_to_add_comment"), "error");
      }
    }
  };

  const isOwnerOrAdmin =
    currentUser &&
    (currentUser.uid === collection.userId || currentUser.role === "admin");

  return (
    <div
      className={`container mx-auto p-6 rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2
        className={`text-4xl font-bold mb-4 text-center ${
          theme === "dark" ? "text-blue-400" : "text-blue-600"
        }`}
      >
        {collection.name}
      </h2>
      {collection.imageURL && (
        <div className="flex justify-center mb-4">
          <img
            src={collection.imageURL}
            alt={collection.name}
            className="w-48 h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
      <div className="text-center mb-4">
        <p
          className={`mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-800"
          }`}
        >
          <span className="text-xl font-semibold">{t("description")}: </span>
          <span className="break-words">{collection.description}</span>
        </p>
        <p
          className={`mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-800"
          }`}
        >
          <span className="text-xl font-semibold">{t("category")}: </span>
          {collection.category}
        </p>
        {collection.customFields &&
          collection.customFields.map((field, index) => (
            <p
              key={index}
              className={`mb-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-700"
              }`}
            >
              <span className="font-semibold">{field.name}</span>: {field.value}
            </p>
          ))}
      </div>

      <h3
        className={`text-3xl font-bold mt-6 mb-4 text-center ${
          theme === "dark" ? "text-blue-300" : "text-blue-500"
        }`}
      >
        {t("items")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collection.items.map((item) => (
          <div
            key={item._id}
            className={`p-4 rounded-lg shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h4
              className={`text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {item.name}
            </h4>
            {item.imageURL && (
              <img
                src={item.imageURL}
                alt={item.name}
                className="w-full h-32 object-cover mb-2 rounded-lg"
              />
            )}
            <div
              className={theme === "dark" ? "text-gray-400" : "text-gray-800"}
            >
              {item.customFields &&
                item.customFields.map((field, index) => (
                  <p key={index} className="mb-1">
                    <span className="font-semibold">{field.name}:</span>{" "}
                    {field.value}
                  </p>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <Link
                to={`/collections/${id}/items/${item._id}`}
                className={`py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${
                  theme === "dark"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {t("details")}
              </Link>
              <button
                onClick={() => handleLike(item._id)}
                className="flex items-center text-red-500"
              >
                {item.likes.includes(currentUser?.uid) ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
                <span className="ml-2">{item.likes.length}</span>
              </button>
              <button
                onClick={() => handleComment(item._id)}
                className={`ml-4 flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                <FaComment className="mr-2" />
                <span>{item.comments.length}</span>
              </button>
              {isOwnerOrAdmin && (
                <>
                  <Link
                    to={`/collections/${id}/items/${item._id}/edit`}
                    className={`py-2 px-4 rounded hover:bg-green-600 transition duration-300 ${
                      theme === "dark"
                        ? "bg-green-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className={`py-2 px-4 rounded hover:bg-red-600 transition duration-300 ${
                      theme === "dark"
                        ? "bg-red-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {isOwnerOrAdmin && (
        <div className="text-center mt-6">
          <Link
            to={`/collections/${id}/items/new`}
            className={`py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${
              theme === "dark"
                ? "bg-blue-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {t("add_item")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CollectionDetails;
