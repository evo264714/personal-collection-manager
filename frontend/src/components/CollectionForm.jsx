import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const CollectionForm = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [customFields, setCustomFields] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "You must be logged in to create a collection.",
        confirmButtonText: "Login",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    const collection = {
      name,
      description,
      category,
      imageURL,
      customFields,
      userId: currentUser.uid,
    };

    try {
      await axios.post("/api/collections", collection, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      Swal.fire("Success", "Collection created successfully", "success");
      navigate("/collections");
    } catch (error) {
      console.error("Error creating collection:", error);
      Swal.fire("Error", "Failed to create collection.", "error");
    }
  };

  const addCustomField = async (fieldType) => {
    const { value: fieldName } = await Swal.fire({
      title: "Enter field name",
      input: "text",
      inputLabel: "Field Name",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (fieldName) {
      const newField = { name: fieldName, type: fieldType };
      setCustomFields((prevFields) => [...prevFields, newField]);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-700 text-gray-200"
            : "bg-white text-gray-800"
        } p-8 rounded-lg shadow-md w-full max-w-md`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">New Collection</h2>
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
                  ? "bg-gray-600 text-gray-200 border-gray-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                theme === "dark"
                  ? "bg-gray-600 text-gray-200 border-gray-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                theme === "dark"
                  ? "bg-gray-600 text-gray-200 border-gray-500"
                  : "border-gray-300"
              }`}
            >
              <option disabled value="">
                Select a category
              </option>
              <option value="Books">Books</option>
              <option value="Coins">Coins</option>
              <option value="Stamps">Stamps</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block">Image URL</label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-lg focus:ring ${
                theme === "dark"
                  ? "bg-gray-600 text-gray-200 border-gray-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4">
            <label className="block">Add Custom Fields</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["String", "Integer", "Text", "Boolean", "Date"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addCustomField(type)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            {customFields.map((field, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-700">
                  {field.name} ({field.type})
                </p>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollectionForm;
