// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "../api/axios";
// import Swal from "sweetalert2";
// import { useAuth } from "../context/AuthContext";
// import {
//   FaHeart,
//   FaRegHeart,
//   FaComment,
//   FaEdit,
//   FaTrash,
//   FaCartPlus,
// } from "react-icons/fa";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "../context/ThemeContext";

// const CollectionDetails = () => {
//   const { t } = useTranslation();
//   const { id } = useParams();
//   const [collection, setCollection] = useState(null);
//   const [error, setError] = useState(null);
//   const { currentUser } = useAuth();
//   const { theme } = useTheme();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCollection = async () => {
//       try {
//         const response = await axios.get(`/api/collections/${id}`);
//         const collectionData = response.data;

//         const updatedItems = collectionData.items.map((item) => ({
//           ...item,
//           likes: Array.isArray(item.likes) ? item.likes : [],
//           comments: Array.isArray(item.comments) ? item.comments : [],
//           customFields: Array.isArray(item.customFields)
//             ? item.customFields
//             : Object.entries(item.customFields || {}).map(([name, value]) => ({
//                 name,
//                 value,
//               })),
//           availableQuantity: item.availableQuantity || 0, // Ensure availableQuantity exists
//         }));

//         setCollection({ ...collectionData, items: updatedItems });
//       } catch (error) {
//         console.error(t("error_fetching_collection"), error.message);
//         setError(error.message);
//         Swal.fire(t("error"), t("failed_to_fetch_collection"), "error");
//       }
//     };

//     fetchCollection();
//   }, [id, t]);

//   const handleDeleteItem = async (itemId) => {
//     try {
//       await axios.delete(`/api/collections/${id}/items/${itemId}`, {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//         data: { userId: currentUser.uid },
//       });
//       setCollection((prevCollection) => ({
//         ...prevCollection,
//         items: prevCollection.items.filter((item) => item._id !== itemId),
//       }));
//       Swal.fire(t("deleted"), t("item_deleted_successfully"), "success");
//     } catch (error) {
//       Swal.fire(t("error"), t("failed_to_delete_item"), "error");
//     }
//   };

//   const handleLike = async (itemId) => {
//     if (!currentUser) {
//       Swal.fire({
//         title: t("login_required"),
//         text: t("please_login_to_like"),
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: t("login"),
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/login");
//         }
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `/api/collections/${id}/items/${itemId}/like`,
//         { userId: currentUser.uid },
//         {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         }
//       );
//       setCollection((prevCollection) => {
//         const updatedItems = prevCollection.items.map((item) => {
//           if (item._id === itemId) {
//             return { ...item, likes: response.data };
//           }
//           return item;
//         });
//         return { ...prevCollection, items: updatedItems };
//       });
//     } catch (error) {
//       Swal.fire(t("error"), t("failed_to_like_item"), "error");
//     }
//   };

//   const handleComment = async (itemId) => {
//     if (!currentUser) {
//       Swal.fire({
//         title: t("login_required"),
//         text: t("please_login_to_comment"),
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: t("login"),
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/login");
//         }
//       });
//       return;
//     }

//     const { value: comment } = await Swal.fire({
//       title: t("add_comment"),
//       input: "textarea",
//       inputLabel: t("your_comment"),
//       showCancelButton: true,
//       inputValidator: (value) => {
//         if (!value) {
//           return t("comment_required");
//         }
//       },
//     });

//     if (comment) {
//       try {
//         const response = await axios.post(
//           `/api/collections/${id}/items/${itemId}/comment`,
//           { userId: currentUser.uid, comment },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );
//         setCollection((prevCollection) => {
//           const updatedItems = prevCollection.items.map((item) => {
//             if (item._id === itemId) {
//               return { ...item, comments: [...item.comments, response.data] };
//             }
//             return item;
//           });
//           return { ...prevCollection, items: updatedItems };
//         });
//       } catch (error) {
//         Swal.fire(t("error"), t("failed_to_add_comment"), "error");
//       }
//     }
//   };

//   const handleAddToCart = async (item) => {
//     if (!currentUser) {
//       Swal.fire({
//         title: t("login_required"),
//         text: t("please_login_to_add_to_cart"),
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: t("login"),
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/login");
//         }
//       });
//       return;
//     }

//     const { value: quantity } = await Swal.fire({
//       title: t("add_to_cart"),
//       input: "number",
//       inputLabel: t("quantity_in_kg"),
//       inputPlaceholder: t("enter_quantity"),
//       inputAttributes: {
//         min: 1,
//         max: item.availableQuantity,
//       },
//       showCancelButton: true,
//       inputValidator: (value) => {
//         if (!value) {
//           return t("quantity_required");
//         }
//         if (value > item.availableQuantity) {
//           return t("quantity_exceeds_available");
//         }
//       },
//     });

//     if (quantity) {
//       try {
//         await axios.post(
//           `/api/cart/add`,
//           {
//             itemId: item._id,
//             collectionId: id,
//             itemName: item.name,
//             price: item.price,
//             imageURL: item.imageURL,
//             quantity: parseInt(quantity, 10),
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );

//         // Update available quantity
//         const updatedItems = collection.items.map((i) =>
//           i._id === item._id
//             ? { ...i, availableQuantity: i.availableQuantity - quantity }
//             : i
//         );
//         setCollection({ ...collection, items: updatedItems });

//         window.dispatchEvent(new CustomEvent("cartUpdated"));

//         Swal.fire(t("added_to_cart"), "", "success");
//       } catch (error) {
//         Swal.fire(t("error"), t("failed_to_add_to_cart"), "error");
//       }
//     }
//   };

//   const isOwnerOrAdmin =
//     currentUser &&
//     (currentUser.uid === collection?.userId || currentUser.role === "admin");

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   if (!collection) {
//     return <div>{t("loading")}</div>;
//   }

//   const disabledStyles = {
//     dark: "bg-red-300 opacity-60",
//     light: "bg-red-300 opacity-60",
//   };

//   return (
//     <div
//       className={`container mx-auto p-6 rounded-lg shadow-lg ${
//         theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       <h2
//         className={`text-4xl font-bold mb-4 text-center ${
//           theme === "dark" ? "text-blue-400" : "text-blue-600"
//         }`}
//       >
//         {collection.name}
//       </h2>
//       {collection.imageURL && (
//         <div className="flex justify-center mb-4">
//           <img
//             src={collection.imageURL}
//             alt={collection.name}
//             className="w-48 h-48 object-cover rounded-lg shadow-md"
//           />
//         </div>
//       )}
//       <div className="text-center mb-4">
//         <p
//           className={`mb-2 ${
//             theme === "dark" ? "text-gray-300" : "text-gray-800"
//           }`}
//         >
//           <span className="text-xl font-semibold">{t("description")}: </span>
//           <span className="break-words">{collection.description}</span>
//         </p>
//         <p
//           className={`mb-2 ${
//             theme === "dark" ? "text-gray-300" : "text-gray-800"
//           }`}
//         >
//           <span className="text-xl font-semibold">{t("category")}: </span>
//           {collection.category}
//         </p>
//         {collection.customFields &&
//           collection.customFields.map((field, index) => (
//             <p
//               key={index}
//               className={`mb-1 ${
//                 theme === "dark" ? "text-gray-400" : "text-gray-700"
//               }`}
//             >
//               <span className="font-semibold">{field.name}</span> {field.value}
//             </p>
//           ))}
//       </div>

//       <h3
//         className={`text-3xl font-bold mt-6 mb-4 text-center ${
//           theme === "dark" ? "text-blue-300" : "text-blue-500"
//         }`}
//       >
//         {t("items")}
//       </h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {collection.items.map((item) => (
//           <div
//             key={item._id}
//             className={`p-4 rounded-lg shadow-lg transition-all duration-300 ${
//               item.availableQuantity <= 0
//                 ? theme === "dark"
//                   ? disabledStyles.dark
//                   : disabledStyles.light
//                 : theme === "dark"
//                 ? "bg-gray-800 hover:bg-gray-750"
//                 : "bg-white hover:bg-gray-50"
//             } ${
//               item.availableQuantity <= 0
//                 ? "cursor-not-allowed"
//                 : "cursor-pointer"
//             }`}
//           >
//             <h4
//               className={`text-2xl font-bold mb-2 ${
//                 theme === "dark" ? "text-red-500" : "text-red-900"
//               }`}
//             >
//               {item.name}
//             </h4>
//             <h4
//               className={`text-xl font-bold mb-2 ${
//                 theme === "dark" ? "text-green-500" : "text-green-900"
//               }`}
//             >
//               {t("Price: ")}
//               {item.price} {t("TK/KG")}
//             </h4>
//             <p className={theme === "dark" ? "text-gray-400" : "text-gray-800"}>
//               {t("available_quantity")}: {item.availableQuantity} KG
//             </p>
//             {item.imageURL && (
//               <img
//                 src={item.imageURL}
//                 alt={item.name}
//                 className="w-full h-32 object-cover mb-2 rounded-lg"
//               />
//             )}

//             <div
//               className={theme === "dark" ? "text-gray-400" : "text-gray-800"}
//             >
//               {item.customFields &&
//                 item.customFields.map((field, index) => (
//                   <p key={index} className="mb-1">
//                     <span className="font-semibold">{field.name}:</span>{" "}
//                     {field.value}
//                   </p>
//                 ))}
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <Link
//                 to={`/collections/${id}/items/${item._id}`}
//                 className={`p-2 rounded hover:bg-orange-400 shadow-lg shadow-orange-700/100 transition duration-300 transform hover:scale-105 ${
//                   theme === "dark"
//                     ? "bg-orange-100 text-black"
//                     : "bg-orange-100 text-black"
//                 }`}
//               >
//                 {t("details")}
//               </Link>
//               <button
//                 onClick={() => handleLike(item._id)}
//                 className="flex items-center text-red-500 transform hover:scale-105"
//               >
//                 {item.likes.includes(currentUser?.uid) ? (
//                   <FaHeart />
//                 ) : (
//                   <FaRegHeart />
//                 )}
//                 <span className="ml-2">{item.likes.length}</span>
//               </button>
//               <button
//                 onClick={() => handleComment(item._id)}
//                 className={`ml-4 flex items-center transform hover:scale-105 ${
//                   theme === "dark" ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 <FaComment className="mr-2" />
//                 <span>{item.comments.length}</span>
//               </button>
//               {isOwnerOrAdmin && (
//                 <>
//                   <Link
//                     to={`/collections/${id}/items/${item._id}/edit`}
//                     className={`py-2 px-4 rounded hover:bg-green-600 shadow-lg shadow-green-700/100 transition duration-300 transform hover:scale-105 ${
//                       theme === "dark"
//                         ? "bg-green-500 text-white"
//                         : "bg-green-500 text-white"
//                     }`}
//                   >
//                     <FaEdit />
//                   </Link>
//                   <button
//                     onClick={() => handleDeleteItem(item._id)}
//                     className={`py-2 px-4 rounded hover:bg-red-600 shadow-lg shadow-red-700/100 transition duration-300 transform hover:scale-105 ${
//                       theme === "dark"
//                         ? "bg-red-500 text-white"
//                         : "bg-red-500 text-white"
//                     }`}
//                   >
//                     <FaTrash />
//                   </button>
//                 </>
//               )}
//             </div>

//             <button
//               onClick={() =>
//                 item.availableQuantity > 0 && handleAddToCart(item)
//               }
//               className={`w-full mt-4 p-2 rounded hover:text-pink-500 shadow-lg shadow-pink-700/100 transition duration-300 transform hover:scale-105 ${
//                 item.availableQuantity <= 0
//                   ? theme === "dark"
//                     ? "bg-gray-700 text-gray-500 cursor-not-allowed"
//                     : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                   : theme === "dark"
//                   ? "bg-pink-100 text-black hover:bg-pink-200"
//                   : "bg-pink-100 text-pink-700 hover:bg-pink-200"
//               }`}
//               disabled={item.availableQuantity <= 0}
//             >
//               <FaCartPlus className="mr-2 inline" />
//               {item.availableQuantity <= 0
//                 ? t("out_of_stock")
//                 : t("add_to_cart")}
//             </button>
//           </div>
//         ))}
//       </div>

//       {isOwnerOrAdmin && (
//         <div className="text-center mt-6">
//           <Link
//             to={`/collections/${id}/items/new`}
//             className={`py-2 px-4 rounded hover:bg-emerald-600 hover:text-white transition duration-300 shadow-lg shadow-green-700/100 transform hover:scale-105 ${
//               theme === "dark"
//                 ? "bg-emerald-500 text-black"
//                 : "bg-emerald-500 text-black"
//             }`}
//           >
//             {t("add_item")}
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollectionDetails;







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
  FaCartPlus,
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
          availableQuantity: item.availableQuantity || 0,
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
    
      const handleAddToCart = async (item) => {
        if (!currentUser) {
          Swal.fire({
            title: t("login_required"),
            text: t("please_login_to_add_to_cart"),
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
    
        const { value: quantity } = await Swal.fire({
          title: t("add_to_cart"),
          input: "number",
          inputLabel: t("quantity_in_kg"),
          inputPlaceholder: t("enter_quantity"),
          inputAttributes: {
            min: 1,
            max: item.availableQuantity,
          },
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return t("quantity_required");
            }
            if (value > item.availableQuantity) {
              return t("quantity_exceeds_available");
            }
          },
        });
    
        if (quantity) {
          try {
            await axios.post(
              `/api/cart/add`,
              {
                itemId: item._id,
                collectionId: id,
                itemName: item.name,
                price: item.price,
                imageURL: item.imageURL,
                quantity: parseInt(quantity, 10),
              },
              {
                headers: {
                  Authorization: `Bearer ${currentUser.token}`,
                },
              }
            );
    
            // Update available quantity
            const updatedItems = collection.items.map((i) =>
              i._id === item._id
                ? { ...i, availableQuantity: i.availableQuantity - quantity }
                : i
            );
            setCollection({ ...collection, items: updatedItems });
    
            window.dispatchEvent(new CustomEvent("cartUpdated"));
    
            Swal.fire(t("added_to_cart"), "", "success");
          } catch (error) {
            Swal.fire(t("error"), t("failed_to_add_to_cart"), "error");
          }
        }
      };

  // Keep all your existing handler functions (handleDeleteItem, handleLike, handleComment, handleAddToCart) 
  // exactly as they were in the original code

  const isOwnerOrAdmin =
    currentUser &&
    (currentUser.uid === collection?.userId || currentUser.role === "admin");

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!collection) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-6xl mx-auto p-6 rounded-xl shadow-lg ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        {/* Collection Header */}
        <div className="text-center mb-8">
          <h2 className={`text-4xl font-bold mb-4 ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`}>
            {collection.name}
          </h2>
          {collection.imageURL && (
            <img
              src={collection.imageURL}
              alt={collection.name}
              className="w-64 h-64 object-cover rounded-xl shadow-lg mx-auto mb-4"
            />
          )}
          <p className={`text-lg ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            {collection.description}
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.items.map((item) => (
            <div
              key={item._id}
              className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
                item.availableQuantity <= 0 ? 'opacity-75' : 'hover:shadow-2xl'
              } ${
                theme === "dark" 
                  ? "bg-gray-700 hover:bg-gray-650" 
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {/* Item Image */}
              {item.imageURL && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Stock Status Badge */}
                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    item.availableQuantity > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.availableQuantity > 0 
                      ? `${item.availableQuantity} KG ${t("available")}`
                      : t("out_of_stock")}
                  </div>
                </div>
              )}

              {/* Item Content */}
              <div className="p-4">
                {/* Item Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-xl font-bold truncate ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {item.name}
                  </h3>
                  <span className={`text-lg font-semibold ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}>
                    ৳{item.price}/KG
                  </span>
                </div>

                {/* Custom Fields */}
                {item.customFields && item.customFields.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.customFields.map((field, index) => (
                      <div
                        key={index}
                        className={`px-2 py-1 rounded-md text-sm ${
                          theme === "dark" 
                            ? "bg-gray-600 text-gray-300" 
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="font-medium">{field.name}:</span> {field.value}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-3">
                    {/* Like Button */}
                    <button
                      onClick={() => handleLike(item._id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                        item.likes.includes(currentUser?.uid)
                          ? 'text-red-500 bg-red-100'
                          : theme === "dark" 
                            ? 'text-gray-400 hover:bg-gray-600' 
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item.likes.includes(currentUser?.uid) ? (
                        <FaHeart className="w-4 h-4" />
                      ) : (
                        <FaRegHeart className="w-4 h-4" />
                      )}
                      <span className="text-sm">{item.likes.length}</span>
                    </button>

                    {/* Comment Button */}
                    <button
                      onClick={() => handleComment(item._id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                        theme === "dark" 
                          ? 'text-gray-400 hover:bg-gray-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FaComment className="w-4 h-4" />
                      <span className="text-sm">{item.comments.length}</span>
                    </button>
                  </div>

                  {/* Details Button */}
                  <Link
                    to={`/collections/${id}/items/${item._id}`}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      theme === "dark" 
                        ? 'text-blue-400 hover:bg-blue-900' 
                        : 'text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {t("details")}
                  </Link>
                </div>

                {/* Owner Actions */}
                {isOwnerOrAdmin && (
                  <div className="flex items-center space-x-2 mt-3">
                    <Link
                      to={`/collections/${id}/items/${item._id}/edit`}
                      className={`p-2 rounded-lg hover:bg-green-100 transition-colors ${
                        theme === "dark" 
                          ? 'text-green-400 hover:bg-gray-600' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                    >
                      <FaEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className={`p-2 rounded-lg hover:bg-red-100 transition-colors ${
                        theme === "dark" 
                          ? 'text-red-400 hover:bg-gray-600' 
                          : 'text-red-600 hover:bg-red-100'
                      }`}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => item.availableQuantity > 0 && handleAddToCart(item)}
                  disabled={item.availableQuantity <= 0}
                  className={`w-full mt-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                    item.availableQuantity <= 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${
                          theme === "dark" 
                            ? 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                            : 'from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                        } text-white`
                  }`}
                >
                  <FaCartPlus className="w-5 h-5" />
                  <span>{item.availableQuantity > 0 ? t("add_to_cart") : t("out_of_stock")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Button */}
        {isOwnerOrAdmin && (
          <div className="text-center mt-8">
            <Link
              to={`/collections/${id}/items/new`}
              className={`inline-block px-6 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r ${
                theme === "dark" 
                  ? 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' 
                  : 'from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600'
              } text-white`}
            >
              {t("add_item")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetails;