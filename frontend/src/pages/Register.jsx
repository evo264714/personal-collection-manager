import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: t("oops"),
        text: t("passwords_do_not_match"),
      });
      return;
    }
    try {
      await register(email, password);
      Swal.fire({
        icon: "success",
        title: t("registration_successful"),
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("registration_failed"),
        text: error.message,
      });
      console.error(t("registration_failed"), error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 dark:text-gray-300">
          {t("register")}
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
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-600"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300">
              {t("confirm_password")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 dark:bg-green-600 text-white py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition duration-300"
          >
            {t("register")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
