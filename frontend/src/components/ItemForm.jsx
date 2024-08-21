import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const ItemForm = ({ isEdit = false }) => {
  const { id, itemId } = useParams();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [customFields, setCustomFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [existingItem, setExistingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectionFields = async () => {
      try {
        const response = await axios.get(`/api/collections/${id}`);
        setCustomFields(response.data.customFields);
      } catch (error) {
        console.error("Error fetching collection:", error.message);
        Swal.fire("Error", "Failed to fetch collection fields.", "error");
      }
    };

    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `/api/collections/${id}/items/${itemId}`
        );
        const itemData = response.data;
        setName(itemData.name);
        setImageURL(itemData.imageURL);
        setFieldValues(itemData.customFields || {});
        setExistingItem(itemData);
      } catch (error) {
        console.error("Error fetching item:", error.message);
        Swal.fire("Error", "Failed to fetch item.", "error");
      }
    };

    fetchCollectionFields();
    if (isEdit) fetchItem();
  }, [id, itemId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const item = {
      name,
      imageURL,
      customFields: fieldValues,
      likes: existingItem?.likes || [],
      comments: existingItem?.comments || [],
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      };

      if (isEdit) {
        await axios.put(`/api/collections/${id}/items/${itemId}`, item, config);
        Swal.fire("Success", "Item updated successfully", "success");
      } else {
        await axios.post(`/api/collections/${id}/items`, item, config);
        Swal.fire("Success", "Item added successfully", "success");
      }
      navigate(`/collections/${id}`);
    } catch (error) {
      console.error("Error submitting item:", error.message);
      Swal.fire(
        "Error",
        isEdit ? "Failed to update item." : "Failed to add item.",
        "error"
      );
    }
  };

  const handleFieldChange = (name, value) => {
    setFieldValues((prevValues) => ({ ...prevValues, [name]: value }));
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
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {isEdit ? "Edit Item" : "New Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                  : "focus:ring-blue-200"
              }`}
            />
          </div>
          <div className="mb-4">
            <label
              className={`block ${
                theme === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Image URL
            </label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                  : "focus:ring-blue-200"
              }`}
            />
          </div>
          {customFields.map((field, index) => (
            <div key={index} className="mb-4">
              <label
                className={`block ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {field.name}
              </label>
              <input
                type={field.type === "Date" ? "date" : "text"}
                value={fieldValues[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-gray-500"
                    : "focus:ring-blue-200"
                }`}
              />
            </div>
          ))}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg transition duration-300 ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
