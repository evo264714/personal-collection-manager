import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaStar, FaUserCircle  } from "react-icons/fa";
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
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
    <div className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-xl ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`}>
      {/* Item Header */}
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
          theme === "dark" ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
        }`}>
          {item.name}
        </h1>
        
        {item.imageURL && (
          <div className="relative w-full h-96 mb-6 rounded-2xl overflow-hidden group">
            <img
              src={item.imageURL}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${
              theme === "dark" ? "from-gray-900/80" : "from-white/80"
            }`}></div>
          </div>
        )}
      </div>

      {/* Custom Fields Grid */}
      {item.customFields && item.customFields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {item.customFields.map((field, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <span className="block text-sm font-semibold mb-1 opacity-80">
                {field.name}
              </span>
              <span className="block text-lg">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            item.likes.includes(currentUser?.uid)
              ? 'text-red-500 bg-red-100/80'
              : theme === "dark" 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
          }`}
        >
          {item.likes.includes(currentUser?.uid) ? (
            <FaHeart className="w-6 h-6" />
          ) : (
            <FaRegHeart className="w-6 h-6" />
          )}
          <span className="text-lg font-semibold">{item.likes.length}</span>
        </button>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}>
          <FaStar className="w-6 h-6 text-yellow-400" />
          <span className="text-lg font-semibold">
            {item.comments.length} {t("reviews")}
          </span>
        </div>
      </div>

      {/* Add Review Button */}
      <div className="text-center mb-10">
        <button
          onClick={handleComment}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            theme === "dark"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          {t("add_review")}
        </button>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <h3 className={`text-2xl font-bold mb-6 border-b pb-3 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}>
          {t("customer_reviews")}
        </h3>
        
        {item.comments.map((review) => (
          <div
            key={review._id}
            className={`p-6 rounded-xl ${
              theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-4 mb-3">
              <FaUserCircle className="w-10 h-10 opacity-80" />
              <div>
                <h4 className="font-semibold">{review.userName || t("anonymous")}</h4>
                <p className="text-sm opacity-75">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-lg leading-relaxed">{review.comment}</p>
          </div>
        ))}

        {item.comments.length === 0 && (
          <div className={`text-center py-12 rounded-xl ${
            theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
          }`}>
            <p className="opacity-75">{t("no_reviews_yet")}</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default ItemDetails;
