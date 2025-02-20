// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "../context/ThemeContext";

// const CollectionList = () => {
//   const { t } = useTranslation();
//   const [collections, setCollections] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const { theme } = useTheme();

//   useEffect(() => {
//     const fetchCollections = async () => {
//       try {
//         const response = await axios.get("/api/collections");
//         if (Array.isArray(response.data)) {
//           setCollections(response.data);
//         } else {
//           throw new Error(t("data_format_error"));
//         }
//       } catch (error) {
//         console.error(t("error_fetching_collections"), error.message);
//         setError(error.message);
//         Swal.fire(t("error"), t("failed_to_fetch_collections"), "error");
//       }
//     };

//     fetchCollections();
//   }, [t]);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/collections/${id}`, {
//         headers: {
//           Authorization: `Bearer ${currentUser?.token}`,
//         },
//         data: { userId: currentUser.uid },
//       });
//       setCollections((prevCollections) =>
//         prevCollections.filter((collection) => collection._id !== id)
//       );
//       Swal.fire(t("deleted"), t("collection_deleted_successfully"), "success");
//     } catch (error) {
//       Swal.fire(t("error"), t("failed_to_delete_collection"), "error");
//       if (error.response && error.response.status === 401) {
//         navigate("/login");
//       }
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen p-4 ${
//         theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-black"
//       }`}
//     >
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold">{t("Collections")}</h2>
//         {currentUser && (
//           <Link
//             to="/collections/new"
//             className={`py-2 px-4 rounded hover:bg-emerald-600 shadow-lg shadow-emerald-600/50 hover:text-white transform hover:scale-105 transition duration-300 ease-in-out ${
//               theme === "dark"
//                 ? "bg-emerald-500 text-black"
//                 : "bg-emerald-500 text-black"
//             }`}
//           >
//             {t("add_collection")}
//           </Link>
//         )}
//       </div>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {collections.length > 0 ? (
//           collections.map((collection) => {
//             const isOwnerOrAdmin =
//               currentUser &&
//               (currentUser.uid === collection.userId ||
//                 currentUser.role === "admin");

//             return (
//               <div
//                 key={collection._id}
//                 className={`p-4 rounded-lg shadow-md flex flex-col justify-between h-full ${
//                   theme === "dark"
//                     ? "bg-gray-800 text-gray-100"
//                     : "bg-gray-100 text-black"
//                 }`}
//               >
//                 <div className="flex flex-col">
//                   {collection.imageURL && (
//                     <div className="flex justify-center items-center">
//                       <img
//                         src={collection.imageURL}
//                         alt={collection.name}
//                         className="h-44 w-56 mb-2 rounded"
//                       />
//                     </div>
//                   )}

//                   <Link
//                     to={`/collections/${collection._id}`}
//                     className={`text-2xl font-semibold hover:text-gray-300 transition duration-300 text-center ${
//                       theme === "dark" ? "text-red-500" : "text-red-500"
//                     }`}
//                   >
//                     {collection.name}
//                   </Link>
//                   <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
//                     <span className="font-bold text-green-500">
//                       Description:{" "}
//                     </span>
//                     {collection.description}
//                   </p>
//                   <p>
//                     <span className="font-bold text-green-500">
//                       {t("category")}:{" "}
//                     </span>
//                     {collection.category}
//                   </p>

//                   <p className="text-2xl font-bold text-green-500">
//                     {t("available_items: ")}
//                   </p>

//                   {collection.customFields &&
//                     collection.customFields.map((field, index) => (
//                       <p key={index} className="">
//                         {index + 1}. {field.name}
//                       </p>
//                     ))}
//                 </div>
//                 <div className="mt-4 flex justify-between w-full">
//                   <Link
//                     to={`/collections/${collection._id}`}
//                     className={`py-2 px-4 rounded hover:bg-orange-400 shadow-lg shadow-orange-600/50 transition duration-300 transform hover:scale-105 ${
//                       theme === "dark"
//                         ? "bg-orange-200 text-black"
//                         : "bg-orange-200 text-black"
//                     }`}
//                   >
//                     {t("details")}
//                   </Link>
//                   {isOwnerOrAdmin && (
//                     <>
//                       <button
//                         onClick={() =>
//                           navigate(`/collections/${collection._id}/edit`)
//                         }
//                         className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 shadow-lg shadow-green-600/50 transition duration-300 transform hover:scale-105"
//                       >
//                         {t("edit")}
//                       </button>
//                       <button
//                         onClick={() => handleDelete(collection._id)}
//                         className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg shadow-red-600/50 hover:bg-red-600 transition duration-300 transform hover:scale-105"
//                       >
//                         {t("delete")}
//                       </button>
//                       {/* <Link
//                         to={`/collections/${collection._id}/items/new`}
//                         className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
//                       >
//                         {t("add_item")}
//                       </Link> */}
//                       <Link
//                         to={`/collections/${collection._id}/items/new`}
//                         className={`py-2 px-4 rounded hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-600/50 transition duration-300 transform hover:scale-105 ${
//                           theme === "dark"
//                             ? "bg-emerald-500 text-black"
//                             : "bg-emerald-500 text-black"
//                         }`}
//                       >
//                         {t("add_item")}
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <p className="text-center text-xl col-span-2">
//             {t("No Collection Found")}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CollectionList;


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
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
            {t("Collections")}
          </h2>
          {currentUser && (
            <Link
              to="/collections/new"
              className={`flex items-center space-x-2 py-3 px-6 rounded-full transition-all duration-300 shadow-lg ${
                theme === "dark" 
                  ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white" 
                  : "bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-gray-900"
              }`}
            >
              <span className="font-semibold">{t("add_collection")}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>

        {error && <p className="text-red-500 mb-8 text-center text-lg">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.length > 0 ? (
            collections.map((collection) => {
              const isOwnerOrAdmin = currentUser && (currentUser.uid === collection.userId || currentUser.role === "admin");

              return (
                <div
                  key={collection._id}
                  className={`group relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {/* Image Section */}
                  {collection.imageURL && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={collection.imageURL}
                        alt={collection.name}
                        className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-6">
                    <Link
                      to={`/collections/${collection._id}`}
                      className="block mb-4 group-hover:text-emerald-500 transition-colors"
                    >
                      <h3 className="text-2xl font-bold truncate bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                        {collection.name}
                      </h3>
                    </Link>

                    {/* Metadata */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm truncate">{collection.description}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{collection.category}</span>
                      </div>
                    </div>

                    {/* Custom Fields */}
                    {collection.customFields && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {collection.customFields.map((field, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              theme === "dark" 
                                ? "bg-gray-700 text-emerald-400" 
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {field.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/collections/${collection._id}`}
                        className={`flex-1 text-center py-2 px-4 rounded-lg transition-all ${
                          theme === "dark" 
                            ? "bg-gray-700 hover:bg-gray-600 text-cyan-400" 
                            : "bg-gray-100 hover:bg-gray-200 text-cyan-600"
                        }`}
                      >
                        {t("details")}
                      </Link>
                      
                      {isOwnerOrAdmin && (
                        <>
                          <button
                            onClick={() => navigate(`/collections/${collection._id}/edit`)}
                            className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(collection._id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          <Link
                            to={`/collections/${collection._id}/items/new`}
                            className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-16">
              <div className="text-2xl text-gray-500">{t("No Collection Found")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionList;