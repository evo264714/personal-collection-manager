import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const UpdateItemForm = () => {
  const { collectionId, itemId } = useParams();
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [customFields, setCustomFields] = useState({});
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/collections/${collectionId}`);
        const collection = response.data;

        if (
          currentUser.uid !== collection.userId &&
          currentUser.role !== "admin"
        ) {
          Swal.fire(
            "Forbidden",
            "You do not have permission to edit this item.",
            "error"
          );
          navigate(`/collections/${collectionId}`);
          return;
        }

        const item = collection.items.find((item) => item._id === itemId);
        if (item) {
          setName(item.name);
          setImageURL(item.imageURL);
          setCustomFields(item.customFields || {});
        } else {
          throw new Error("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error.message);
        Swal.fire("Error", "Failed to fetch item.", "error");
      }
    };
    fetchItem();
  }, [collectionId, itemId, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const item = { name, imageURL, customFields };

    try {
      await axios.put(
        `/api/collections/${collectionId}/items/${itemId}`,
        item,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      Swal.fire("Success", "Item updated successfully", "success");
      navigate(`/collections/${collectionId}`);
    } catch (error) {
      Swal.fire("Error", "Failed to update item.", "error");
    }
  };

  const handleCustomFieldChange = (field, value) => {
    setCustomFields((prevFields) => ({ ...prevFields, [field]: value }));
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-md w-full max-w-md ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                theme === "dark"
                  ? "focus:ring-blue-600 border-gray-700 bg-gray-700"
                  : "focus:ring-blue-200"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block">Image URL</label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                theme === "dark"
                  ? "focus:ring-blue-600 border-gray-700 bg-gray-700"
                  : "focus:ring-blue-200"
              }`}
            />
          </div>
          {Object.keys(customFields).map((field) => (
            <div key={field} className="mb-4">
              <label className="block">{field}</label>
              <input
                type="text"
                value={customFields[field]}
                onChange={(e) => handleCustomFieldChange(field, e.target.value)}
                className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                  theme === "dark"
                    ? "focus:ring-blue-600 border-gray-700 bg-gray-700"
                    : "focus:ring-blue-200"
                }`}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateItemForm;
