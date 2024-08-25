import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const ItemDetails = () => {
  const { t } = useTranslation();
  const { collectionId, itemId } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `/api/collections/${collectionId}/items/${itemId}`
        );

        // Ensure customFields is an array
        const itemData = response.data;
        itemData.customFields = Array.isArray(itemData.customFields)
          ? itemData.customFields
          : Object.entries(itemData.customFields || {}).map(([name, value]) => ({
              name,
              value,
            }));

        setItem(itemData);
      } catch (error) {
        setError(t("error_fetching_item"));
        Swal.fire(t("error"), t("failed_to_fetch_item"), "error");
      }
    };

    fetchItem();
  }, [collectionId, itemId, t]);

  const handleLike = async () => {
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
        `/api/collections/${collectionId}/items/${itemId}/like`,
        { userId: currentUser.uid },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setItem((prevItem) => ({
        ...prevItem,
        likes: response.data,
      }));
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_like_item"), "error");
    }
  };

  const handleComment = async () => {
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
          `/api/collections/${collectionId}/items/${itemId}/comment`,
          { userId: currentUser.uid, comment },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setItem((prevItem) => ({
          ...prevItem,
          comments: [...prevItem.comments, response.data],
        }));
      } catch (error) {
        Swal.fire(t("error"), t("failed_to_add_comment"), "error");
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!item) {
    return <div>{t("loading")}</div>;
  }

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
        {item.name}
      </h2>
      {item.imageURL && (
        <div className="flex justify-center mb-4">
          <img
            src={item.imageURL}
            alt={item.name}
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
      <div className="text-center mb-4">
        <div
          className={`mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-800"
          }`}
        >
          {item.customFields &&
            item.customFields.map((field, index) => (
              <p key={index} className="mb-1">
                <span className="font-semibold">{field.name}:</span>{" "}
                {field.value}
              </p>
            ))}
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={handleLike}
            className={`flex items-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {currentUser && item.likes.includes(currentUser.uid) ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
            <span className="ml-2">{item.likes.length}</span>
          </button>
          <button
            onClick={handleComment}
            className={`ml-4 flex items-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <FaComment className="mr-2" />
            <span>{item.comments.length}</span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-3xl font-bold mb-4">
          {t("comments")} ({item.comments.length})
        </h4>
        <div className="space-y-4">
          {item.comments.map((comment) => (
            <div
              key={comment._id}
              className={`p-4 rounded-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
