import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const stripePromise = loadStripe("pk_test_51NGMV1LxBrFA4g3g3Nv01XqL6yp9F3zhantWcCMUUodvVMbOwVq9Nk8KgUfVH5HFVRrXyzuMZWpGmsASQffhyWIh003YH2sSKB");

const PaymentSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!location.state?.items || !location.state?.total) {
      navigate("/cart", { replace: true });
    } else {
      setPaymentData({
        items: location.state.items,
        total: location.state.total
      });
    }
  }, [location.state, navigate]);

  if (!paymentData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="animate-pulse text-lg text-gray-500">
          {t("loading_payment")}...
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{t("payment_summary")}</h1>
        
        <div className={`mb-8 p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <h2 className="text-xl font-semibold mb-4">{t("order_summary")}</h2>
          <div className="space-y-3">
            {paymentData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="font-medium">
                  {item.quantity} KG × {item.price} ৳ =  {(item.quantity * item.price)} ৳
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-semibold">{t("total")}:</span>
            <span className="text-2xl font-bold text-green-600">
              {paymentData.total.toFixed(2)} ৳
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              items={paymentData.items}
              total={paymentData.total}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentSystem;