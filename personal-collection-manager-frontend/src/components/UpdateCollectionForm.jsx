import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const UpdateCollectionForm = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [customFields, setCustomFields] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/collections/${id}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        const { name, description, category, imageURL, customFields, userId } =
          response.data;

        if (currentUser.uid !== userId && currentUser.role !== "admin") {
          Swal.fire(
            "Forbidden",
            "You do not have permission to edit this collection.",
            "error"
          );
          navigate("/collections");
          return;
        }

        setName(name);
        setDescription(description);
        setCategory(category);
        setImageURL(imageURL || "");
        setCustomFields(customFields || []);
      } catch (error) {
        console.error("Error fetching collection:", error.message);
        Swal.fire("Error", "Failed to fetch collection.", "error");
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchCollection();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const collection = {
      name,
      description,
      category,
      imageURL,
      customFields,
      userId: currentUser.uid,
    };

    try {
      await axios.put(`/api/collections/${id}`, collection, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      Swal.fire("Success", "Collection updated successfully", "success");
      navigate("/collections");
    } catch (error) {
      Swal.fire("Error", "Failed to update collection.", "error");
    }
  };

  const handleCustomFieldNameChange = (index, newName) => {
    const updatedFields = [...customFields];
    updatedFields[index].name = newName;
    setCustomFields(updatedFields);
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
      const newField = { name: fieldName, type: fieldType, value: "" };
      setCustomFields((prevFields) => [...prevFields, newField]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 dark:text-gray-200">
          Update Collection
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="Books">Books</option>
              <option value="Coins">Coins</option>
              <option value="Stamps">Stamps</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Image URL
            </label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Custom Fields
            </label>
            {customFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200">
                  {field.name} ({field.type})
                </label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) =>
                    handleCustomFieldNameChange(index, e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Add New Custom Field
            </label>
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

export default UpdateCollectionForm;
