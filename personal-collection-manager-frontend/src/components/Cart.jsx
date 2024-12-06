import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cart", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire(t("error"), t("failed_to_fetch_cart"), "error");
      }
    };

    fetchCartItems();
  }, [currentUser, t]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await axios.delete(`/api/cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      // Remove the item from the local state as well
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== cartItemId)
      );
      Swal.fire(t("removed_from_cart"), "", "success");
  
      // Emit custom event to update the cart count in Navbar
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_remove_from_cart"), "error");
    }
  };

  return (
    <div
      className={`container mx-auto p-6 rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-4xl font-bold mb-4 text-center">
        {t("your_cart")}
      </h2>
      {cartItems.length === 0 ? (
        <p>{t("cart_empty")}</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>{t("item_name")}</th>
              <th>{t("image")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>{item.itemName}</td>
                <td>
                  <img
                    src={item.imageURL}
                    alt={item.itemName}
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Cart;
