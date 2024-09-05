// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useTheme } from "../context/ThemeContext";
// import Swal from "sweetalert2";
// import { useTranslation } from "react-i18next";
// import {
//   FaSun,
//   FaMoon,
//   FaSignOutAlt,
//   FaSignInAlt,
//   FaUserPlus,
//   FaHome,
//   FaUserShield,
//   FaListAlt,
//   FaSearch,
// } from "react-icons/fa";
// import axios from "../api/axios";

// const Navbar = () => {
//   const { currentUser, logout } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const { t, i18n } = useTranslation();
//   const [searchResults, setSearchResults] = useState([]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       Swal.fire(t("logged_out"), t("logout_success"), "success");
//     } catch (error) {
//       Swal.fire(t("error"), t("logout_error"), "error");
//     }
//   };

//   const handleSearch = async () => {
//     const { value: query } = await Swal.fire({
//       title: t("search"),
//       input: "text",
//       inputPlaceholder: t("enter_search_term"),
//       showCancelButton: true,
//       confirmButtonText: t("search"),
//       showLoaderOnConfirm: true,
//       preConfirm: (query) => {
//         if (!query) {
//           Swal.showValidationMessage(t("search_query_required"));
//           return false;
//         }
//         return query;
//       },
//     });

//     if (query) {
//       try {
//         const response = await axios.get(`/api/collections/search?q=${query}`);
//         const results = response.data;

//         if (results.length === 0) {
//           Swal.fire(t("no_results_found"), "", "info");
//         } else {
//           const resultsHtml = results
//             .map((result) => {
//               if (result.itemId) {
//                 return `
//                   <li>
//                     <a href="/collections/${result.collectionId}/items/${
//                   result.itemId
//                 }" class="text-blue-500 hover:underline">
//                       ${result.itemName} - ${t("from_collection")}: ${
//                   result.collectionName
//                 }
//                     </a>
//                   </li>`;
//               } else {
//                 return `
//                   <li>
//                     <a href="/collections/${result.collectionId}" class="text-blue-500 hover:underline">
//                       ${result.collectionName}
//                     </a>
//                   </li>`;
//               }
//             })
//             .join("");

//           Swal.fire({
//             title: t("search_results"),
//             html: `<ul>${resultsHtml}</ul>`,
//             width: "80%",
//             confirmButtonText: t("close"),
//           });
//         }
//       } catch (error) {
//         Swal.fire(t("search_failed"), error.message, "error");
//       }
//     }
//   };

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <nav className="bg-color dark:bg-gray-900 p-4 shadow-lg">
//       <div className="container mx-auto flex justify-between items-center space-x-4">
//         <Link
//           to="/"
//           className="text-color text-2xl font-bold flex items-center hover:text-gray-300 transition duration-300"
//         >
//           <FaHome className="mr-2" /> {t("my_collection_manager")}
//         </Link>
//         <div className="flex items-center space-x-6">
//           <button
//             onClick={toggleTheme}
//             className={`text-color py-2 px-4 rounded-lg transition duration-300 flex items-center ${
//               theme === "light"
//                 ? "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-400"
//                 : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
//             }`}
//           >
//             {theme === "light" ? (
//               <>
//                 <FaMoon className="mr-2" />
//                 {t("dark_mode")}
//               </>
//             ) : (
//               <>
//                 <FaSun className="mr-2" />
//                 {t("light_mode")}
//               </>
//             )}
//           </button>

//           {currentUser && (
//             <Link
//               to="/my-collections"
//               className={`text-color py-2 px-4 rounded-lg transition duration-300 flex items-center ${
//                 theme === "light"
//                   ? "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300"
//                   : "bg-blue-700 hover:bg-blue-600 text-white border border-blue-600"
//               }`}
//             >
//               <FaListAlt className="mr-2" /> {t("my_collections")}
//             </Link>
//           )}

//           <button
//             onClick={handleSearch}
//             className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
//           >
//             <FaSearch className="mr-2" />
//             {t("search")}
//           </button>

//           {currentUser ? (
//             <div className="flex items-center space-x-4">
//               {/* <span className="text-color hidden sm:inline-block">
//                 {t("welcome")}, {currentUser.email}
//               </span> */}
//               {currentUser.role === "admin" && (
//                 <Link
//                   to="/admin"
//                   className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
//                 >
//                   <FaUserShield className="mr-2" /> {t("admin_dashboard")}
//                 </Link>
//               )}
//               <button
//                 onClick={handleLogout}
//                 className="text-color bg-red-500 hover:bg-red-700 py-2 px-4 rounded-lg flex items-center transition duration-300"
//               >
//                 <FaSignOutAlt className="mr-2" /> {t("logout")}
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-4">
//               <Link
//                 to="/login"
//                 className="text-color bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg transition duration-300 flex items-center"
//               >
//                 <FaSignInAlt className="mr-2" /> {t("login")}
//               </Link>
//               <Link
//                 to="/register"
//                 className="text-color bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg transition duration-300 flex items-center"
//               >
//                 <FaUserPlus className="mr-2" /> {t("register")}
//               </Link>
//             </div>
//           )}
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => changeLanguage("en")}
//             className={`text-color px-3 py-1 rounded-l-lg ${
//               i18n.language === "en" ? "bg-blue-500" : "bg-gray-500"
//             } hover:bg-blue-600 transition duration-300`}
//             disabled={i18n.language === "en"}
//           >
//             English
//           </button>
//           <button
//             onClick={() => changeLanguage("es")}
//             className={`text-color px-3 py-1 rounded-r-lg ${
//               i18n.language === "es" ? "bg-blue-500" : "bg-gray-500"
//             } hover:bg-blue-600 transition duration-300`}
//             disabled={i18n.language === "es"}
//           >
//             Español
//           </button>
//         </div>
//       </div>
//       {/* Search Results */}
//       {searchResults.length > 0 && (
//         <div className="search-results mt-4 p-4">
//           <h3 className="text-xl font-bold mb-2">{t("search_results")}</h3>
//           <ul>
//             {searchResults.map((result) => (
//               <li key={result.itemId || result.collectionId} className="mb-2">
//                 {result.itemId ? (
//                   <Link
//                     to={`/collections/${result.collectionId}/items/${result.itemId}`}
//                     className="text-blue-500 hover:underline"
//                   >
//                     {result.itemName} - {t("from_collection")}:{" "}
//                     {result.collectionName}
//                   </Link>
//                 ) : (
//                   <Link
//                     to={`/collections/${result.collectionId}`}
//                     className="text-blue-500 hover:underline"
//                   >
//                     {result.collectionName}
//                   </Link>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;





























import React, { useState } from "react";
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
  FaSearch,
  FaQuestionCircle // Help icon
} from "react-icons/fa";
import axios from "../api/axios";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      Swal.fire(t("logged_out"), t("logout_success"), "success");
    } catch (error) {
      Swal.fire(t("error"), t("logout_error"), "error");
    }
  };

  const handleSearch = async () => {
    const { value: query } = await Swal.fire({
      title: t("search"),
      input: "text",
      inputPlaceholder: t("enter_search_term"),
      showCancelButton: true,
      confirmButtonText: t("search"),
      showLoaderOnConfirm: true,
      preConfirm: (query) => {
        if (!query) {
          Swal.showValidationMessage(t("search_query_required"));
          return false;
        }
        return query;
      },
    });

    if (query) {
      try {
        const response = await axios.get(`/api/collections/search?q=${query}`);
        const results = response.data;

        if (results.length === 0) {
          Swal.fire(t("no_results_found"), "", "info");
        } else {
          const resultsHtml = results
            .map((result) => {
              if (result.itemId) {
                return `
                  <li>
                    <a href="/collections/${result.collectionId}/items/${
                  result.itemId
                }" class="text-blue-500 hover:underline">
                      ${result.itemName} - ${t("from_collection")}: ${
                  result.collectionName
                }
                    </a>
                  </li>`;
              } else {
                return `
                  <li>
                    <a href="/collections/${result.collectionId}" class="text-blue-500 hover:underline">
                      ${result.collectionName}
                    </a>
                  </li>`;
              }
            })
            .join("");

          Swal.fire({
            title: t("search_results"),
            html: `<ul>${resultsHtml}</ul>`,
            width: "80%",
            confirmButtonText: t("close"),
          });
        }
      } catch (error) {
        Swal.fire(t("search_failed"), error.message, "error");
      }
    }
  };

  // Handle help and JIRA ticket creation
  const handleHelp = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Create JIRA Ticket",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Ticket Summary">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Priority (High, Medium, Low)">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Collection Name">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Link">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
          document.getElementById("swal-input4").value,
        ];
      },
    });
  
    if (formValues) {
      const [summary, priority, collection, link] = formValues;
      try {
        const response = await axios.post("/api/jira/create-ticket", {
          summary,
          priority,
          collection,
          link,
          reporterEmail: currentUser.email, // Ensure you send the reporter's email
        });
        Swal.fire("Success", `JIRA Ticket Created: ${response.data.ticketUrl}`, "success");
      } catch (error) {
        Swal.fire("Error", "Failed to create JIRA ticket.", "error");
      }
    }
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-color dark:bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center space-x-4">
        <Link
          to="/"
          className="text-color text-2xl font-bold flex items-center hover:text-gray-300 transition duration-300"
        >
          <FaHome className="mr-2" /> {t("my_collection_manager")}
        </Link>
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            className={`text-color py-2 px-4 rounded-lg transition duration-300 flex items-center ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-400"
                : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
            }`}
          >
            {theme === "light" ? (
              <>
                <FaMoon className="mr-2" />
                {t("dark_mode")}
              </>
            ) : (
              <>
                <FaSun className="mr-2" />
                {t("light_mode")}
              </>
            )}
          </button>

          {currentUser && (
            <Link
              to="/my-collections"
              className={`text-color py-2 px-4 rounded-lg transition duration-300 flex items-center ${
                theme === "light"
                  ? "bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300"
                  : "bg-blue-700 hover:bg-blue-600 text-white border border-blue-600"
              }`}
            >
              <FaListAlt className="mr-2" /> {t("my_collections")}
            </Link>
          )}

          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
          >
            <FaSearch className="mr-2" />
            {t("search")}
          </button>

          {currentUser && (
            <>
              <button
                onClick={handleHelp}
                className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 hover:from-orange-500 hover:via-red-600 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
              >
                <FaQuestionCircle className="mr-2" /> {t("help")}
              </button>

              {currentUser.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
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
          )}

          {!currentUser && (
            <div className="flex items-center space-x-4">
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
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
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
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results mt-4 p-4">
          <h3 className="text-xl font-bold mb-2">{t("search_results")}</h3>
          <ul>
            {searchResults.map((result) => (
              <li key={result.itemId || result.collectionId} className="mb-2">
                {result.itemId ? (
                  <Link
                    to={`/collections/${result.collectionId}/items/${result.itemId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {result.itemName} - {t("from_collection")}:{" "}
                    {result.collectionName}
                  </Link>
                ) : (
                  <Link
                    to={`/collections/${result.collectionId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {result.collectionName}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
