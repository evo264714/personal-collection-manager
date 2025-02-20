import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import axios from "../api/axios";
import { FaReceipt, FaCalendarAlt, FaMoneyBillWave, FaBox, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

const PaymentHistory = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get("/api/payments", {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        
        const formattedPayments = response.data.map(payment => ({
          ...payment,
          amount: payment.amount / 100,
          createdAt: new Date(payment.createdAt),
          items: payment.items.map(item => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price, itemName: item.itemName || t("unnamed_item")
          }))
        }));

        setPayments(formattedPayments);
      } catch (err) {
        setError(t("failed_to_load_payments"));
      } finally {
        setLoading(false);
      }
    };

    currentUser && fetchPaymentHistory();
  }, [currentUser, t]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <div className="animate-pulse text-lg text-gray-500">
          {t("loading_payments")}...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}>
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <FaHistory className="inline-block mr-3 text-purple-500" />
          {t("payment_history")}
        </h1>

        {payments.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            {t("no_payments_found")}
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className={`rounded-xl p-6 shadow-lg transition-all duration-300 ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-gray-750" 
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <FaReceipt className="text-2xl text-purple-500" />
                    <span className="text-xl font-semibold">
                      {t("order_id")}: {payment._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-500" />
                    <span className="text-sm">
                      {payment.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex items-center space-x-2">
                  <FaMoneyBillWave className="text-green-500" />
                  <span className="text-xl font-bold">
                    {t("total_paid")}: ৳{payment.amount.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaBox className="mr-2 text-blue-500" />
                    {t("items_purchased")}:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                        <tr>
                          <th className="px-4 py-3 text-left">{t("item")}</th>
                          <th className="px-4 py-3 text-center">{t("quantity")}</th>
                          <th className="px-4 py-3 text-right">{t("price")}</th>
                          <th className="px-4 py-3 text-right">{t("total")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payment.items.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b ${
                              theme === "dark" ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <td className="px-4 py-3">
                              <Link
                                
                                className="hover:text-blue-500 transition-colors"
                              >
                                {item.itemName}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-center">{item.quantity} KG</td>
                            <td className="px-4 py-3 text-right">৳ {item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right">
                              ৳ {(item.quantity * item.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;