// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import Swal from "sweetalert2";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "../context/ThemeContext";
// import { FaTrash, FaMoneyBillWave } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const { currentUser } = useAuth();
//   const { t } = useTranslation();
//   const { theme } = useTheme();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await axios.get("/api/cart", {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         });
//         setCartItems(response.data);
//       } catch (error) {
//         console.error(error);
//         Swal.fire(t("error"), t("failed_to_fetch_cart"), "error");
//       }
//     };

//     fetchCartItems();
//   }, [currentUser, t]);

//   const handleRemoveFromCart = async (cartItemId) => {
//     try {
//       await axios.delete(`/api/cart/${cartItemId}`, {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       });
//       setCartItems((prevItems) =>
//         prevItems.filter((item) => item._id !== cartItemId)
//       );
//       Swal.fire(t("removed_from_cart"), "", "success");

//       window.dispatchEvent(new CustomEvent("cartUpdated"));
//     } catch (error) {
//       Swal.fire(t("error"), t("failed_to_remove_from_cart"), "error");
//     }
//   };

//   const handlePaymentRedirect = (item) => {
//     navigate("/payment", { state: { item } });
//   };

//   return (
//     <div
//       className={`container mx-auto p-6 rounded-lg shadow-lg ${
//         theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       <h2 className="text-4xl font-bold mb-4 text-center">{t("your_cart")}</h2>
//       {cartItems.length === 0 ? (
//         <p>{t("cart_empty")}</p>
//       ) : (
//         <table className="w-full text-left">
//           <thead>
//             <tr>
//               <th>{t("item_name")}</th>
//               <th>{t("Image")}</th>
//               <th>{t("Price")}</th>
//               <th>{t("actions")}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cartItems.map((item) => (
//               <tr key={item._id}>
//                 <td>{item.itemName}</td>
//                 <td>
//                   <img
//                     src={item.imageURL}
//                     alt={item.itemName}
//                     className="w-20 h-20 object-cover"
//                   />
//                 </td>
//                 <td>{item.price}</td>
//                 <td className="flex gap-6 mt-6">
//                   <button
//                     onClick={() => handleRemoveFromCart(item._id)}
//                     className="text-red-500 bg-red-100 rounded-full px-2 transition duration-300 transform hover:scale-105 hover:bg-red-700 hover:text-red-200"
//                   >
//                     <FaTrash />
//                   </button>
//                   <button
//                     onClick={() => handlePaymentRedirect(item)}
//                     className="text-green-500 bg-green-100 p-2 rounded-full transition duration-300 transform hover:scale-105 hover:bg-green-700 hover:text-green-200"
//                   >
//                     <FaMoneyBillWave />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Cart;

// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import Swal from "sweetalert2";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "../context/ThemeContext";
// import { FaTrash, FaMoneyBillWave, FaWallet } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const { currentUser } = useAuth();
//   const { t } = useTranslation();
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [redirect, setRedirect] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await axios.get("/api/cart", {
//           headers: {
//             Authorization: `Bearer ${currentUser.token}`,
//           },
//         });
//         setCartItems(response.data);
//       } catch (error) {
//         console.error(error);
//         Swal.fire(t("error"), t("failed_to_fetch_cart"), "error");
//       }
//     };

//     fetchCartItems();
//   }, [currentUser, t]);

//   useEffect(() => {
//     if (redirect && selectedItems.length > 0) {
//       navigate("/payment", {
//         state: { items: selectedItems, total: calculateTotal() },
//       });
//     }
//   }, [redirect, selectedItems, navigate]);

//   const calculateTotal = () => {
//     return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   };

//   const handleRemoveFromCart = async (cartItemId) => {
//     try {
//       await axios.delete(`/api/cart/${cartItemId}`, {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//       });
//       setCartItems((prevItems) =>
//         prevItems.filter((item) => item._id !== cartItemId)
//       );
//       Swal.fire(t("removed_from_cart"), "", "success");
//       window.dispatchEvent(new CustomEvent("cartUpdated"));
//     } catch (error) {
//       Swal.fire(t("error"), t("failed_to_remove_from_cart"), "error");
//     }
//   };

//   const handlePaymentRedirect = (items) => {
//     setSelectedItems(items);
//     setRedirect(true);
//   };

//   return (
//     <div
//       className={`container mx-auto p-6 rounded-lg shadow-lg ${
//         theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       <h2 className="text-4xl font-bold mb-4 text-center">{t("your_cart")}</h2>
//       {cartItems.length === 0 ? (
//         <p className="text-center text-gray-500">{t("cart_empty")}</p>
//       ) : (
//         <div className="space-y-6">
//           <table className="w-full">
//             <thead>
//               <tr
//                 className={`border-b ${
//                   theme === "dark" ? "border-gray-700" : "border-gray-200"
//                 }`}
//               >
//                 <th className="pb-4">{t("item_name")}</th>
//                 <th className="pb-4">{t("image")}</th>
//                 <th className="pb-4">{t("quantity")}</th>
//                 <th className="pb-4">{t("price")}</th>
//                 <th className="pb-4">{t("actions")}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cartItems.map((item) => (
//                 <tr
//                   key={item._id}
//                   className={`border-b ${
//                     theme === "dark" ? "border-gray-700" : "border-gray-200"
//                   }`}
//                 >
//                   <td className="py-4">{item.itemName}</td>
//                   <td className="py-4">
//                     <img
//                       src={item.imageURL}
//                       alt={item.itemName}
//                       className="w-20 h-20 object-cover rounded-lg"
//                     />
//                   </td>
//                   <td className="py-4">{item.quantity} KG</td>
//                   <td className="py-4">৳ {item.price * item.quantity}</td>
//                   <td className="py-4">
//                     <div className="flex gap-4 justify-center">
//                       <button
//                         onClick={() => handleRemoveFromCart(item._id)}
//                         className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div
//             className={`p-6 rounded-lg ${
//               theme === "dark" ? "bg-gray-800" : "bg-gray-50"
//             }`}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-xl font-semibold">{t("total")}:</span>
//               <span className="text-2xl font-bold text-green-600">
//                 ৳ {calculateTotal()}
//               </span>
//             </div>
//             <button
//               onClick={() => handlePaymentRedirect(cartItems)}
//               className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg
//                 flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700
//                 transition-all duration-300 shadow-lg"
//             >
//               <FaWallet className="text-xl" />
//               <span className="text-lg font-semibold">{t("pay_all")}</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;


import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { FaTrash, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      Swal.fire(t("error"), t("Please login first"), "error");
    }
  };

  useEffect(() => {
    fetchCartItems();
    
    // Add event listener for cart updates
    const handleCartUpdate = () => fetchCartItems();
    window.addEventListener("cartUpdated", handleCartUpdate);
    
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [currentUser, t]);

  const calculateTotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveItem = async (cartItemId) => {
    console.log("Removing cart item with ID:", cartItemId); // Debugging
    try {
      await axios.delete(`/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setCartItems(prev => prev.filter(item => item._id !== cartItemId));
      Swal.fire(t("removed_from_cart"), "", "success");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_remove_from_cart"), "error");
    }
  };

  const handleCheckout = () => {
    navigate("/payment", {
      state: {
        items: cartItems.map(item => ({
          id: item.itemId,
          name: item.itemName,
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateTotal()
      }
    });
  };

  return (
    <div className={`container mx-auto p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-4xl font-bold mb-8 text-center">{t("your_cart")}</h2>
      
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">{t("cart_empty")}</p>
      ) : (
        <div className="space-y-6">
          <div className={`overflow-x-auto rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
            <table className="w-full">
              <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                <tr>
                  <th className="px-6 py-4 text-left">{t("item")}</th>
                  <th className="px-6 py-4 text-center">{t("quantity")}</th>
                  <th className="px-6 py-4 text-right">{t("price")}</th>
                  <th className="px-6 py-4 text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id} className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.imageURL}
                          alt={item.itemName}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <span className="font-medium">{item.itemName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{item.quantity} KG</td>
                    <td className="px-6 py-4 text-right">৳{(item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">{t("total")}:</span>
              <span className="text-2xl font-bold text-green-600">
                ৳{calculateTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg
                flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700
                transition-all duration-300 shadow-lg font-semibold text-lg"
            >
              <FaWallet className="text-xl" />
              {t("checkout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;