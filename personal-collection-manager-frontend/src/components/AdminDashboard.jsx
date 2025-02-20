import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  FaUserPlus,
  FaTrash,
  FaLock,
  FaUnlock,
  FaUserMinus,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentUser?.token) return;

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          Swal.fire(
            t("unauthorized"),
            t("not_authorized_access_resource"),
            "error"
          );
          logout();
          window.location.href = "/login";
        } else {
          Swal.fire(t("error"), t("failed_to_fetch_users"), "error");
        }
      }
    };

    fetchUsers();
  }, [currentUser, logout, t]);

  const handleMakeAdmin = async (id) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${id}/role`,
        { role: "admin" },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", t("user_promoted_to_admin"), "success").then(
          () => {
            window.location.reload(); // Reload the page
          }
        );
      }
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_promote_user"), "error");
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      const response = await axios.put(
        `/api/admin/users/${id}/role`,
        { role: "user" },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      if (response.status === 200) {
        if (id === currentUser.uid) {
          Swal.fire({
            icon: "success",
            title: t("admin_privileges_removed"),
            text: t("admin_no_longer"),
            timer: 4000,
            showConfirmButton: true,
          }).then(async () => {
            await logout();
          });
        } else {
          Swal.fire("Success", t("admin_privileges_removed"), "success").then(
            () => {
              window.location.reload();
            }
          );
        }
      }
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_remove_admin_privileges"), "error");
    }
  };

  const handleStatusToggle = async (id, isActive) => {
    try {
      await axios.put(
        `/api/admin/users/${id}/status`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      Swal.fire(
        "Success",
        t("user_status_updated", {
          isActive: isActive ? t("unblocked") : t("blocked"),
        }),
        "success"
      ).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire(t("error"), t("failed_to_update_status"), "error");
    }
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: t("are_you_sure"),
      text: t("this_action_cannot_be_undone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("yes_delete_it"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/admin/users/${id}`, {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });
          Swal.fire(t("deleted"), t("user_has_been_deleted"), "success").then(
            () => {
              window.location.reload();
            }
          );
        } catch (error) {
          Swal.fire(t("error"), t("failed_to_delete_user"), "error");
        }
      }
    });
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-gray-900 text-gray-100" 
        : "bg-gray-50 text-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r ${
          theme === "dark" 
            ? "from-purple-400 to-blue-400" 
            : "from-purple-600 to-blue-600"
        }`}>
          {t("admin_dashboard")}
        </h2>

        <div className={`rounded-2xl shadow-xl overflow-hidden ${
          theme === "dark" 
            ? "bg-gray-800" 
            : "bg-white"
        }`}>
          <div className={`px-6 py-4 ${
            theme === "dark" 
              ? "bg-gray-700" 
              : "bg-gray-50"
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t("total_users")}: {users.length}</span>
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>{users.filter(u => u.isActive).length} {t("active")}</span>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>{users.filter(u => !u.isActive).length} {t("blocked")}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                theme === "dark" 
                  ? "bg-gray-700/50" 
                  : "bg-gray-50"
              }`}>
                <tr>
                  {["email", "role", "status", "actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold tracking-wide"
                    >
                      {t(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr 
                    key={user._id}
                    className={`transition-all duration-200 hover:${theme === "dark" 
                      ? "bg-gray-700/30" 
                      : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          user.isActive ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                        {user.email}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                      }`}>
                        {user.isActive ? t("active") : t("blocked")}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {user.role === "user" ? (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className={`p-2 rounded-lg hover:bg-green-500/10 text-green-500 transition-all tooltip`}
                            data-tip={t("make_admin")}
                          >
                            <FaUserPlus className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemoveAdmin(user._id)}
                            className={`p-2 rounded-lg hover:bg-purple-500/10 text-purple-500 transition-all tooltip`}
                            data-tip={t("remove_admin")}
                          >
                            <FaUserMinus className="w-5 h-5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleStatusToggle(user._id, !user.isActive)}
                          className={`p-2 rounded-lg ${
                            user.isActive 
                              ? "hover:bg-orange-500/10 text-orange-500" 
                              : "hover:bg-green-500/10 text-green-500"
                          } transition-all tooltip`}
                          data-tip={user.isActive ? t("block") : t("unblock")}
                        >
                          {user.isActive ? (
                            <FaLock className="w-5 h-5" />
                          ) : (
                            <FaUnlock className="w-5 h-5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className={`p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all tooltip`}
                          data-tip={t("delete_user")}
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className={`p-12 text-center ${
              theme === "dark" 
                ? "text-gray-400" 
                : "text-gray-500"
            }`}>
              <FaUserMinus className="mx-auto h-12 w-12 mb-4" />
              {t("no_users_found")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
