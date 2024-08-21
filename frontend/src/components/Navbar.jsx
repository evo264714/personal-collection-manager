import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaUserShield,
  FaListAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire(t("logged_out"), t("logout_success"), "success");
    } catch (error) {
      Swal.fire(t("error"), t("logout_error"), "error");
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-color dark:bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-color text-2xl font-bold flex items-center hover:text-gray-300 transition duration-300"
        >
          <FaHome className="mr-2" /> {t("my_collection_manager")}
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="text-color bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg transition duration-300 flex items-center"
          >
            {theme === "light" ? (
              <FaMoon className="mr-2" />
            ) : (
              <FaSun className="mr-2" />
            )}
            {theme === "light" ? t("dark_mode") : t("light_mode")}
          </button>
          {currentUser ? (
            <>
              <span className="text-color mr-4 hidden sm:inline-block">
                {t("welcome")}, {currentUser.email}
              </span>
              <Link
                to="/my-collections"
                className="text-color bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FaListAlt className="mr-2" /> {t("my_collections")}
              </Link>
              {currentUser.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-color bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg transition duration-300 flex items-center"
                >
                  <FaUserShield className="mr-2" /> {t("admin_dashboard")}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-color bg-red-500 hover:bg-red-700 py-2 px-4 rounded-lg flex items-center transition duration-300"
              >
                <FaSignOutAlt className="mr-2" /> {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-color bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FaSignInAlt className="mr-2" /> {t("login")}
              </Link>
              <Link
                to="/register"
                className="text-color bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <FaUserPlus className="mr-2" /> {t("register")}
              </Link>
            </>
          )}
          <div className="flex">
            <button
              onClick={() => changeLanguage("en")}
              className={`text-color px-3 py-1 rounded-l-lg ${
                i18n.language === "en" ? "bg-blue-500" : "bg-gray-500"
              } hover:bg-blue-600 transition duration-300`}
              disabled={i18n.language === "en"}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("es")}
              className={`text-color px-3 py-1 rounded-r-lg ${
                i18n.language === "es" ? "bg-blue-500" : "bg-gray-500"
              } hover:bg-blue-600 transition duration-300`}
              disabled={i18n.language === "es"}
            >
              Español
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
