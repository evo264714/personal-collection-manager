import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ items, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Convert total to cents for Stripe
      const amountInCents = Math.round(total * 100);
      
      const { data } = await axios.post(
        "/api/payments/create-payment-intent",
        { 
          amount: amountInCents,
          items: items.map(item => ({
            itemId: item.id,
            itemName: item.name,
            collectionId: item.collectionId,
            price: item.price,
            quantity: item.quantity,
            imageURL: item.imageURL
          }))
        },
        { 
          headers: { 
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json"
          } 
        }
      );

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: currentUser.name || currentUser.email,
              email: currentUser.email,
              address: { country: "BD" }
            }
          }
        }
      );

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent.status === "succeeded") {
        try {
          await axios.delete("/api/cart/clear", {
            headers: { 
              Authorization: `Bearer ${currentUser.token}`,
              "X-User-ID": currentUser.uid
            }
          });
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          
          await Swal.fire({
            title: t("payment_success"),
            text: t("payment_success_message"),
            icon: "success",
            background: theme === "dark" ? "#1f2937" : "#fff",
            color: theme === "dark" ? "#fff" : "#000"
          });

          navigate("/payment-history");
        } catch (clearError) {
          console.error("Cart clearing failed:", clearError);
          throw new Error(t("cart_clear_failed"));
        }
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError(err.message);
      await Swal.fire({
        title: t("payment_failed"),
        text: err.message || t("payment_error"),
        icon: "error",
        background: theme === "dark" ? "#1f2937" : "#fff",
        color: theme === "dark" ? "#fff" : "#000"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
        <CardElement
          options={{
            style: {
              base: {
                color: theme === "dark" ? "#fff" : "#1f2937",
                fontSize: "16px",
                "::placeholder": {
                  color: theme === "dark" ? "#9ca3af" : "#6b7280"
                }
              }
            }
          }}
        />
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          loading ? "bg-gray-400 cursor-not-allowed" : 
          theme === "dark" ? 
            "bg-purple-600 hover:bg-purple-700" : 
            "bg-purple-500 hover:bg-purple-600"
        } text-white`}
      >
        {loading ? t("processing") : `${t("pay")} ৳${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;