import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const MyCollections = () => {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCollections = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `/api/collections/user/${currentUser.uid}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError(error.message);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          Swal.fire(t("error"), t("fetch_collections_error"), "error");
        }
      }
    };

    fetchCollections();
  }, [currentUser, navigate, t]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/collections/${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setCollections((prevCollections) =>
        prevCollections.filter((collection) => collection._id !== id)
      );
      Swal.fire(t("deleted"), t("collection_deleted_success"), "success");
    } catch (error) {
      Swal.fire(t("error"), t("delete_collection_error"), "error");
    }
  };

      return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                {t('my_collections')}
              </h2>
              <Link
                to="/collections/new"
                className={`flex items-center space-x-2 py-3 px-6 rounded-full transition-all duration-300 shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-gray-900'
                }`}
              >
                <span className="font-semibold">{t('add_new')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
    
            {error && <p className="text-red-500 mb-8 text-center text-lg">{error}</p>}
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <div
                    key={collection._id}
                    className={`group relative rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      {collection.imageURL ? (
                        <>
                          <img
                            src={collection.imageURL}
                            alt={collection.name}
                            className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400">{t('no_image')}</span>
                        </div>
                      )}
                    </div>
    
                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3
                          className="text-2xl font-bold truncate cursor-pointer hover:text-purple-500 transition-colors"
                          onClick={() => navigate(`/collections/${collection._id}`)}
                        >
                          {collection.name}
                        </h3>
                      </div>
    
                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => navigate(`/collections/${collection._id}/edit`)}
                          className="p-2 rounded-lg hover:bg-purple-500/10 text-purple-500 transition-colors tooltip"
                          data-tip={t('update')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
    
                        <button
                          onClick={() => handleDelete(collection._id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors tooltip"
                          data-tip={t('delete')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
    
                        <Link
                          to={`/collections/${collection._id}`}
                          className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors tooltip"
                          data-tip={t('view')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <div className="mt-6 text-2xl text-gray-500 dark:text-gray-400">
                      {t('no_collections_found')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };
    
    export default MyCollections;