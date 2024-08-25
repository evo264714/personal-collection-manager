import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error(t("login_failed"), error);
      Swal.fire({
        icon: "error",
        title: t("login_failed"),
      });
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 dark:text-gray-200">
          {t("login")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {t("login")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
